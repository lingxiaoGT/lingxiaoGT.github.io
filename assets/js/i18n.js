let currentLang = 'zh';
let langData = {};

export async function loadLanguage(lang) {
    try {
        const res = await fetch(`assets/data/i18n/${lang}.json`);
        langData = await res.json();
        currentLang = lang;
        return langData;
    } catch (e) {
        console.warn(`加载语言 ${lang} 失败，使用中文后备`);
        const fallback = await fetch('assets/data/i18n/zh.json');
        langData = await fallback.json();
        currentLang = 'zh';
        return langData;
    }
}

export function getText(key) {
    return langData[key] || key;
}

export function setLanguage(lang) {
    return loadLanguage(lang);
}

export { currentLang };