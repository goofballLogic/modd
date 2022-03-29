export function ensureStylesheet(linkHref) {
    document.addEventListener("DOMContentLoaded", () => {
        const link = document.createElement("LINK");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", linkHref);
        document.head.appendChild(link);
        console.log("Registered:", linkHref);
    });
}