
export const bookmarkAttribute = "urn:bookmark:SpNXsKH7HEi4p4KgJx1Otg";

export default function ElementAggregate({ container, entities, initialBoundaryNode }) {

    const findBookmark = boundaryNode => Array.from(container.childNodes).indexOf(boundaryNode);

    const boundaries = [];
    return async (mt, md) => {

        for (let i = 0; i < entities.length; i++) {

            const boundaryNode = boundaries[i] || initialBoundaryNode;
            const bookmark = findBookmark(boundaryNode);
            await entities[i](mt, { ...md, [bookmarkAttribute]: bookmark });
            boundaries[i] = container.childNodes[bookmark] || initialBoundaryNode;

        }

    }

}