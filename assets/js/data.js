let toolsData = [];
let tagMapping = {};

export async function loadTools() {
    const res = await fetch('assets/data/tools.json');
    toolsData = await res.json();
    return toolsData;
}

export async function loadTagMapping() {
    const res = await fetch('assets/data/tag-mapping.json');
    tagMapping = await res.json();
    return tagMapping;
}

export { toolsData, tagMapping };