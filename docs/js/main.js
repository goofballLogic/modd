document.addEventListener("DOMContentLoaded", async () => {

    const embeddables = Array.from(document.querySelectorAll("a.embeddable-code"));
    const loadingContents = embeddables.map(fetchContent);
    for (const loadingContent of loadingContents) {

        try {
            const [embeddable, text] = await loadingContent;
            const codeElement = document.createElement("CODE");
            codeElement.innerText = text;
            embeddable.after(codeElement);
        } catch (err) {
            console.error(err);
        }
    }

});

async function fetchContent(embeddable) {
    const resp = await fetch(embeddable.href);
    const text = await resp.text();
    return [embeddable, text];
}