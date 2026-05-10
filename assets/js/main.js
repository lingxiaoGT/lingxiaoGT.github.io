import { loadTools, loadTagMapping } from './data.js';
import { loadLanguage, setLanguage, getText } from './i18n.js';
import {
    renderCategoryButtons,
    renderTags,
    renderCards,
    toggleTag,
    initCharts,
    updateCompareBar,
    showDetail,
    copyToClipboard,
    openFeedbackModal,
    toggleFavorite,
    toggleCompare
} from './render.js';

window.selectedTags = JSON.parse(localStorage.getItem('selectedTags')) || [];
window.currentCategory = 'all';
window.currentSearch = '';
window.expandedParents = new Set();
window.toolsData = [];
window.tagMapping = {};

window.toggleTag = toggleTag;
window.toggleFavorite = toggleFavorite;
window.toggleCompare = toggleCompare;
window.copyToClipboard = copyToClipboard;
window.showDetail = showDetail;
window.openFeedbackModal = openFeedbackModal;
window.closeModal = () => document.getElementById('detailModal')?.classList.remove('show');
window.closeFeedbackModal = () => document.getElementById('feedbackModal')?.classList.remove('show');
window.closeSubmitModal = () => document.getElementById('submitModal')?.classList.remove('show');

document.addEventListener('DOMContentLoaded', async () => {
    await loadTagMapping();
    await loadTools();
    await loadLanguage('zh');
    applyTranslations();

    renderCategoryButtons();
    renderTags();
    renderCards();
    updateCompareBar();
    initCharts();
    loadTheme();

    document.getElementById('langSelect')?.addEventListener('change', async (e) => {
        await setLanguage(e.target.value);
        applyTranslations();
        renderTags();
        renderCards();
        if (window.statusChart) {
            window.statusChart.data.labels = [getText('normal'), getText('warning')];
            window.statusChart.update();
        }
    });

    document.getElementById('search')?.addEventListener('input', (e) => {
        window.currentSearch = e.target.value.trim();
        renderCards();
    });

    document.getElementById('randomBtn')?.addEventListener('click', () => {
        const filtered = window.toolsData.filter(t => {
            if (window.currentCategory !== 'all' && t.category !== window.currentCategory) return false;
            if (window.selectedTags.length && !window.selectedTags.every(tag => t.tags.includes(tag))) return false;
            return true;
        });
        if (filtered.length === 0) return;
        const random = filtered[Math.floor(Math.random() * filtered.length)];
        window.open(random.url, '_blank');
    });

    document.getElementById('favoriteBtn')?.addEventListener('click', () => {
        if (window.currentCategory === 'favorite') {
            window.currentCategory = 'all';
            document.getElementById('favoriteBtn').classList.remove('bg-yellow-500', 'text-white');
        } else {
            window.currentCategory = 'favorite';
            document.getElementById('favoriteBtn').classList.add('bg-yellow-500', 'text-white');
        }
        renderCards();
    });

    document.getElementById('submitLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('submitModal')?.classList.add('show');
    });

    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkIcon = document.getElementById('darkIcon');
    darkModeToggle?.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        if (document.documentElement.classList.contains('dark')) {
            darkIcon?.classList.remove('fa-moon');
            darkIcon?.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            darkIcon?.classList.remove('fa-sun');
            darkIcon?.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
        if (window.catChart && window.statusChart) {
            const color = document.documentElement.classList.contains('dark') ? '#fff' : '#333';
            window.catChart.options.plugins.legend.labels.color = color;
            window.statusChart.options.plugins.legend.labels.color = color;
            window.catChart.update();
            window.statusChart.update();
        }
    });

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTop.classList.add('opacity-100', 'visible');
            else backToTop.classList.remove('opacity-100', 'visible');
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    document.addEventListener('keydown', (e) => {
        const search = document.getElementById('search');
        if (e.key === '/' && document.activeElement !== search) {
            e.preventDefault();
            search?.focus();
        }
        if (e.key === 'Escape' && search) {
            search.value = '';
            window.currentSearch = '';
            renderCards();
        }
    });

    console.log('%c✨ 嘿嘿，你发现隐藏彩蛋啦！ ✨', 'color: #10b981; font-size: 16px; font-weight: bold;');
    console.log('%c如果你喜欢这个导航站，欢迎去爱发电支持作者～', 'color: #946ce6; font-size: 14px;');
    console.log('%chttps://ifdian.net/a/gt0507', 'color: #3b82f6; text-decoration: underline;');
    console.log(`%c你™故意   /                              \\`, 'color: #8B4513');
    console.log(`%c找猹是     |   r   ﹀    一  ﹀  乀 |`, 'color: #8B4513');
    console.log(`%c不是？     \\  |   ▂▂ ˉ _  ︻︻  \\`, 'color: #8B4513');
    console.log(`%c                ⌒v  <●>      <●>  | |   `, 'color: #8B4513');
    console.log(`%c            __\\と       （ , .）,      /_`, 'color: #8B4513');
    console.log(`%c         一ˉˉ    乀       ﾉ      乀   /    ˉˉ一`, 'color: #8B4513');
    console.log(`%c   一ˉˉ              \\ ︶   ˉˉ ˉ   /             ˉˉ一`, 'color: #8B4513');
    console.log(`%c/               \\\\\\  ヽ二二 ”//                      \\`, 'color: #8B4513');
    console.log(`%c|                       \\\\          /                              |  `, 'color: #8B4513');
    console.log(`%c||           \\/  \\/  \\\\      /  \\/                      \\\\`, 'color: #8B4513');
});

function applyTranslations() {
    const map = {
        siteTitleMain: 'siteTitle',
        randomText: 'randomBtn',
        favoriteBtnText: 'favoriteBtn',
        statsSummary: 'statsSummary',
        compareText: 'compareSelected',
        compareBtnText: 'compareBtn',
        clearCompareText: 'clearCompare',
        footerUpdate: 'footerUpdate',
        footerOfficial: 'footerOfficial',
        submitLinkText: 'submitLink',
        reportLinkText: 'reportLink',
        thanksText: 'thanksText',
        footerFeatures: 'footerFeatures',
        commentsTitle: 'commentsTitle',
        submitTitle: 'submitTitle',
        submitName: 'submitNamePlaceholder',
        submitUrl: 'submitUrlPlaceholder',
        submitDesc: 'submitDescPlaceholder',
        cancelBtn: 'cancel',
        submitBtn: 'submit',
        feedbackTitle: 'feedbackTitle',
        feedbackMessage: 'feedbackMessagePlaceholder',
        feedbackCancelBtn: 'cancel',
        feedbackSubmitBtn: 'submit',
    };
    for (const [id, key] of Object.entries(map)) {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = getText(key);
            else if (el.tagName === 'BUTTON') el.innerText = getText(key);
            else el.innerText = getText(key);
        }
    }
    const search = document.getElementById('search');
    if (search) search.placeholder = getText('searchPlaceholder');
    const shortcut = document.getElementById('shortcutHint');
    if (shortcut) shortcut.innerHTML = getText('shortcutHint');
    const hope = document.getElementById('feedbackHope');
    if (hope) hope.innerText = getText('feedbackHope') || '希望不要用到 awq';
    const compareTextSpan = document.getElementById('compareText');
    if (compareTextSpan) compareTextSpan.innerText = getText('compareSelected');
    const compareBtnSpan = document.getElementById('compareBtnText');
    if (compareBtnSpan) compareBtnSpan.innerText = getText('compareBtn');
    const clearCompareSpan = document.getElementById('clearCompareText');
    if (clearCompareSpan) clearCompareSpan.innerText = getText('clearCompare');
}

function loadTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
        const darkIcon = document.getElementById('darkIcon');
        if (darkIcon) {
            darkIcon.classList.remove('fa-moon');
            darkIcon.classList.add('fa-sun');
        }
    }
}