document.querySelectorAll('[data-icone]').forEach((placeholder) => {
    const svg = ICONES[placeholder.dataset.icone];
    if (svg) {
        placeholder.outerHTML = svg;
    }
});
