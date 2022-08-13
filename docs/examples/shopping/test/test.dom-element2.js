import { expect } from "https://unpkg.com/@esm-bundle/chai@4.3.4-fix.0/esm/chai.js";
import { cleanHTML } from "./html-processing.js";
import Aggregate from "../src/entities/aggregate.js";
import { asArray } from "../src/maps/arrays.js";
import Filter from "../src/entities/filter.js";
import { Logged } from "../src/entities/log.js";
import Outbound from "../src/entities/outbound.js";

import DOMElement2 from "../src/entities/dom-element2.js";

/*

    Each thing which needs the ability to mutate based on a message declares itself along
    with the message types allowed.

    The problem is that if we render the initial view based on an HTML template, mutation
    could result in significant (or entire) switching out of elements / child components.
    That in turn makes a nonsense of the original rendering.

    The thing which is galling is that sending messages through to the tree of components
    should make things easier because each component should be able to update itself and
    so each individual component's mutation should be trivial (even it it's switching out
    a significant tree underneath the current component).

    HTML templates don't let you declare mutation logic easily because each element might
    need to mutate depending on the message passed.

             -> C3
    C1 -> C2
             -> C4

    <c1>
        <c2>
            <c3 />
            <c4 />
        </c2>
    </c1>

    C2 needs to decide whether to render C3 or C4. C2 could have two html templates but ideally
    it would be nice to be able to build this from a single appearing template, like:

    () => el`
        <component2>
            ${(mt, md) => md.flag
                ? () => el`<component3 />`
                : () => el`<component4 />`
            }
        </component2>
    `;

*/

const placeholder = `<a class="gMKDkl80MszlRsSUYzeIcbwW1PnrTwmA"></a>`;
const placeholderSelector = "a.gMKDkl80MszlRsSUYzeIcbwW1PnrTwmA";

function getSelector(elm) {
    if (elm.tagName === "BODY") return "BODY";
    const names = [];
    console.log(elm.outerHTML);
    while (elm.parentElement && elm.tagName !== "BODY") {
        let c = 1, e = elm;
        for (; e.previousElementSibling; e = e.previousElementSibling, c++);
        names.unshift(elm.tagName + ":nth-child(" + c + ")");
        elm = elm.parentElement;
    }
    return names.join(">");
}

function El(snippets, ...children) {

    let waitCount = 10;
    function waitForContainer(opts) {
        if (waitCount-- < 1)
            throw new Error("Stuck waiting for container");
        if (opts.container)
            return entity(opts);
        else
            return moreOpts => waitForContainer({ ...opts, ...moreOpts });
    }

    function entity(opts) {

        const mutate = opts.mutate || (() => []);

        const handler = async (messageType, messageData) => {

            /*
                I receive a message, so I will mutate in some way, assuming that I
                have access to currently rendered elements
            */
            const nodes = getRenderedNodes(opts);
            const renderMessages = await mutate(nodes);
            /*
                Now that I have mutated my elements, I will pass messages to the
                children
            */
            const aggregate = getChildrenAggregate(opts);
            const childrenMessages = await aggregate(messageType, messageData);

            /*
                return out any messages we received
            */
            const output = [
                ...asArray(renderMessages),
                ...asArray(childrenMessages)
            ];
            return output;

        };
        handler.id = name;
        return handler;

    }

    let aggregate;

    function getChildrenAggregate({ container, name }) {

        if (!aggregate) {

            /*
                our children will (probably) lack the container they need to render into,
                so we call them with an opts object containing the container within which
                to render themselves
            */
            const childEntities = children.map(c =>
                c({ container })
            );

            const filteredChildEntities = childEntities.map(c =>
                Filter({ blacklist: true, messages: [Logged] }, c)
            );

            aggregate = Filter(
                { blacklistEntities: true },
                Aggregate(`Children of ${name}`, filteredChildEntities)
            );

        }
        return aggregate;

    }

    let nodes;

    function getRenderedNodes({ container, name }) {

        if (!nodes) {

            const template = document.createElement("TEMPLATE");
            template.innerHTML = snippets.join(placeholder);
            nodes = Array.from(template.content.childNodes);

            const placeholders = nodes
                // only elements
                .filter(n => n.nodeType == Node.ELEMENT_NODE)
                // elements might be placeholders, or might contain placeholders
                .map(el => el.matches(placeholderSelector)
                    // is an placeholder?
                    ? [[container, el]]
                    // contains placeholders?
                    : Array
                        .from(el.querySelectorAll(placeholderSelector))
                        .map(placeholder => [el, placeholder]))
                // flatten
                .reduce((acc, xs) => acc.concat(xs), [])
                // for each parent and placeholder, find the previous sibling
                .map(([parent, placeholder]) => [parent, placeholder, placeholder.previousSibling])
                ;

            const placeholderStreaks = [];
            let currentStreak = [];
            const endStreak = () => {
                if (currentStreak.length)
                    placeholderStreaks.push(currentStreak);
                currentStreak = [];
            }

            for (let i = 0; i < placeholders.length; i++) {

                const [parent, placeholder, previousSibling] = placeholders[i];

                const startStreak = () => {
                    currentStreak.push(parent, previousSibling, i);
                }
                if (!currentStreak.length) {

                    /*
                        we're starting a new streak.
                        Store:
                            - the parent,
                            - the previousSibling (or null) as a marker for rendering position
                            - the child index
                    */
                    startStreak();

                } else {

                    /*
                        is the previous sibling:
                            - null? (a new streak immediately inside a node)
                            - not an element (a new streak immediately after a non-element e.g. a text node)
                            - an element, but not a placeholder (a new streak after some other element)
                    */
                    if (previousSibling == null
                        || previousSibling.nodeType != Node.ELEMENT_NODE
                        || !previousSibling.matches(placeholderSelector)) {

                        endStreak();
                        startStreak();

                    } else {

                        /* otherwise add the position of the next child to the current streak */
                        currentStreak.push(i);

                    }

                }

            }
            endStreak();

            for (const node of nodes)
                container.appendChild(node);

            for (let [, placeholder] of placeholders) {
                placeholder.remove();
            }

        }
        return nodes;

    }

    return ({
        container,
        name
    }) => waitForContainer({ container, name })

}



describe("DOM Element (2)", () => {

    let container;
    const something = Symbol("something");

    describe("Given a simple element in a div", () => {

        beforeEach(async () => {

            container = document.createElement("DIV");
            const SimpleEl = El`<span>hello</span>`;
            const simpleEl = SimpleEl({ container, name: "Simple" });
            await simpleEl(something, "hello world");

        });

        it("Then it should render as expected", () => {

            const expected = cleanHTML(container.outerHTML);
            const actual = "<div><span>hello</span></div>";
            expect(expected).equals(actual);

        });

    });

    describe("Given a simple element in a simple element in a div", () => {

        beforeEach(() => {

            container = document.createElement("body");
            const InnerSimpleEl = El`<span>inner</span>`({ name: "Inner" });
            const OuterSimpleEl = El`<span>outer${InnerSimpleEl}also outer</span>`({ name: "Outer" });

            const elements = OuterSimpleEl({ container });
            // kick off message
            elements(something, "hello");

        });

        it("Then it should render as expected", () => {

            const expected = cleanHTML(container.outerHTML);
            const actual = "<div><span>outer<span>inner</span>also outer</span></div>";
            expect(expected).equals(actual);

        });

    });

    describe("Given various multi-root elements beside each other or interspersed inside an element also containing some text", () => {

        beforeEach(async () => {

            const Inner1 = El`<span>First</span><span>Inner One</span>`;
            const Inner2 = El`<span>Second</span><span>Inner Two</span>`;
            const Inner3 = El`<span>Third</span><span>Inner Three</span>`;
            const Outer = El`${Inner1}Before${Inner2}${Inner3}After`;

            container = document.createElement("div");
            const elements = Outer({ container });
            await elements(something);

        });

        it("Then it should render as expected", () => {

            const expected = cleanHTML(container.outerHTML);
            const actual = cleanHTML(`
                <div>
                    <span>First</span><span>Inner One</span>
                    Before
                    <span>Second</span><span>Inner Two</span>
                    <span>Third</span><span>Inner Three</span>
                    After
                </div>
            `);
            expect(expected).equals(actual, expected
                .replace(/</g, "\n<")
                .replace(/>/g, ">\n")
                .replace(/\n+/g, "\n")
            );

        });
    });

});