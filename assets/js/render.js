import { toolsData, tagMapping } from './data.js';
import { getText } from './i18n.js';

let catChart, statusChart;

export function renderCategoryButtons() {
    const categories = [
        { key: 'all', name: '全部' },
        { key: '网页版MC', name: '网页版MC' },
        { key: '工具类', name: '工具类' },
        { key: 'Wiki与百科', name: 'Wiki与百科' },
        { key: '社区/论坛', name: '社区/论坛' },
        { key: '模组/资源站', name: '模组/资源站' },
        { key: '启动器/加载器', name: '启动器/加载器' },
        { key: '材质/光影/皮肤装饰', name: '材质/光影/皮肤装饰' },
        { key: '服务器/技术', name: '服务器/技术' },
        { key: '其他资源', name: '其他资源' }
    ];
    const container = document.getElementById('categoryButtons');
    container.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.dataset.category = cat.key;
        btn.className = `cat-btn px-4 py-2 rounded-full text-sm font-medium ${cat.key === 'all' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300'}`;
        btn.textContent = cat.name;
        btn.onclick = () => {
            document.querySelectorAll('.cat-btn').forEach(b => {
                b.classList.remove('bg-green-600', 'text-white', 'shadow-sm');
                b.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
            });
            btn.classList.add('bg-green-600', 'text-white', 'shadow-sm');
            btn.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-800', 'dark:text-gray-200');
            window.currentCategory = cat.key;
            renderCards(toolsData);
        };
        container.appendChild(btn);
    });
}

function buildParentToChildren() {
    const parentToChildren = {};
    toolsData.forEach(tool => {
        tool.tags.forEach(tag => {
            const parent = tagMapping[tag] || '其他';
            if (!parentToChildren[parent]) parentToChildren[parent] = new Set();
            if (tag !== parent) parentToChildren[parent].add(tag);
        });
    });
    for (let parent in parentToChildren) {
        parentToChildren[parent] = Array.from(parentToChildren[parent]).sort();
    }
    return parentToChildren;
}

function createTagButton(tag) {
    const btn = document.createElement('button');
    btn.className = `tag-btn px-3 py-1 rounded-full text-xs font-medium ${window.selectedTags.includes(tag) ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`;
    btn.dataset.tag = tag;
    btn.textContent = tag;
    btn.onclick = () => window.toggleTag(tag);
    return btn;
}

export function renderTags() {
    const tagFilters = document.getElementById('tagFilters');
    if (!tagFilters) return;

    const parentToChildren = buildParentToChildren();
    let parents = Object.keys(parentToChildren).sort();
    if (parents.includes('其他')) {
        parents = parents.filter(p => p !== '其他');
        parents.push('其他');
    }

    tagFilters.innerHTML = '';
    parents.forEach(parent => {
        const children = parentToChildren[parent];
        if (children.length === 0) return;

        const parentContainer = document.createElement('div');
        parentContainer.className = 'parent-tag-container';

        const parentBtn = document.createElement('button');
        parentBtn.className = `flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600`;
        parentBtn.innerHTML = `<span>${parent}</span> <i class="fas fa-chevron-down transition-transform ${window.expandedParents.has(parent) ? 'rotate-180' : ''}"></i>`;
        parentBtn.onclick = (e) => {
            e.stopPropagation();
            if (window.expandedParents.has(parent)) window.expandedParents.delete(parent);
            else window.expandedParents.add(parent);
            renderTags();
        };
        parentContainer.appendChild(parentBtn);

        const childContainer = document.createElement('div');
        childContainer.className = `flex flex-wrap gap-2 child-tag-container ${window.expandedParents.has(parent) ? '' : 'hidden'}`;
        children.forEach(childTag => {
            childContainer.appendChild(createTagButton(childTag));
        });
        parentContainer.appendChild(childContainer);

        tagFilters.appendChild(parentContainer);
    });
}

export function renderCards() {
    const container = document.getElementById('tools-container');
    if (!container) return;
    let filtered = toolsData.filter(tool => {
        if (window.currentCategory !== 'all' && tool.category !== window.currentCategory) return false;
        if (window.selectedTags.length && !window.selectedTags.every(tag => tool.tags.includes(tag))) return false;
        if (window.currentSearch) {
            const lowerSearch = window.currentSearch.toLowerCase();
            const match = tool.name.toLowerCase().includes(lowerSearch) || tool.desc.toLowerCase().includes(lowerSearch);
            if (!match && window.pinyin) {
                const namePinyin = window.pinyin(tool.name, { toneType: 'none' }).join('');
                const descPinyin = window.pinyin(tool.desc, { toneType: 'none' }).join('');
                return namePinyin.includes(lowerSearch) || descPinyin.includes(lowerSearch);
            }
            return match;
        }
        return true;
    });

    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center py-12 text-gray-500 dark:text-gray-400 text-lg">${getText('noMatch')}</div>`;
        return;
    }

    const categories = {};
    filtered.forEach(tool => {
        if (!categories[tool.category]) categories[tool.category] = [];
        categories[tool.category].push(tool);
    });

    const categoryOrder = ['网页版MC', '工具类', 'Wiki与百科', '社区/论坛', '模组/资源站', '启动器/加载器', '材质/光影/皮肤装饰', '服务器/技术', '其他资源'];
    categoryOrder.forEach(cat => {
        if (categories[cat]) {
            const details = document.createElement('details');
            details.className = 'category-group';
            details.open = true;
            details.innerHTML = `
                <summary class="category-summary">
                    <span>${cat} (${categories[cat].length})</span>
                    <i class="fas fa-chevron-down transition-transform"></i>
                </summary>
                <div class="category-content"></div>
            `;
            container.appendChild(details);
            const contentDiv = details.querySelector('.category-content');
            categories[cat].forEach(tool => {
                contentDiv.appendChild(createCard(tool));
            });
        }
    });
}

export function createCard(tool) {
    const card = document.createElement('div');
    card.className = 'card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col cursor-pointer';
    card.onclick = () => window.open(tool.url, '_blank');

    const statusText = tool.status === 'normal' ? getText('normal') : (tool.warningText || getText('warning'));
    const isFavorite = JSON.parse(localStorage.getItem('favorites') || '[]').includes(tool.name);
    const isCompare = JSON.parse(localStorage.getItem('compareList') || '[]').includes(tool.name);

    card.innerHTML = `
        <div class="p-4 flex-1">
            <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${tool.name}</h3>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tool.status === 'normal' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}">${statusText}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">${tool.desc}</p>
            <div class="flex flex-wrap gap-1 mb-3">
                ${tool.tags.map(tag => `<span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">${tag}</span>`).join('')}
            </div>
            <div class="mt-auto flex items-center justify-between" onclick="event.stopPropagation()">
                <div class="flex items-center gap-2">
                    <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="visit-link text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm" data-url="${tool.url}" onclick="event.stopPropagation()">${getText('visit')}</a>
                    <button onclick="window.showDetail('${tool.name}'); event.stopPropagation()" class="text-blue-500 hover:text-blue-700 text-sm"><i class="far fa-eye"></i></button>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.toggleFavorite('${tool.name}'); event.stopPropagation()" class="text-yellow-500 hover:text-yellow-600" title="${getText('favoriteBtn')}">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-star"></i>
                    </button>
                    <button onclick="window.toggleCompare('${tool.name}'); event.stopPropagation()" class="text-gray-400 hover:text-gray-600" title="${getText('compareBtn')}">
                        <i class="${isCompare ? 'fas fa-check-square' : 'far fa-square'}"></i>
                    </button>
                    <button onclick="window.copyToClipboard('${tool.url}'); event.stopPropagation()" class="text-gray-400 hover:text-gray-600" title="${getText('copy')}">
                        <i class="far fa-copy"></i>
                    </button>
                    <button onclick="window.openFeedbackModal('${tool.name}'); event.stopPropagation()" class="text-gray-400 hover:text-gray-600 feedback-btn" title="${getText('feedbackTitle')}">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

export function showDetail(name) {
    const tool = toolsData.find(t => t.name === name);
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalDetail = document.getElementById('modalDetail');
    const modalLink = document.getElementById('modalLink');
    if (tool && modal && modalTitle && modalDesc && modalDetail && modalLink) {
        modalTitle.textContent = tool.name;
        modalDesc.textContent = tool.desc;
        modalDetail.textContent = tool.detail || getText('detailDefault');
        modalLink.href = tool.url;
        modal.classList.add('show');
    }
}

export function copyToClipboard(text) {
    const toast = document.getElementById('copyToast');
    if (!toast) return;
    navigator.clipboard.writeText(text).then(() => {
        toast.textContent = getText('copySuccess');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }).catch(() => alert(getText('copyFail')));
}

export function openFeedbackModal(toolName) {
    const modal = document.getElementById('feedbackModal');
    const toolNameInput = document.getElementById('feedbackToolName');
    const toolNameDisplay = document.getElementById('feedbackToolNameDisplay');
    if (modal && toolNameInput && toolNameDisplay) {
        toolNameInput.value = toolName;
        toolNameDisplay.textContent = toolName;
        modal.classList.add('show');
    }
}

export function toggleFavorite(name) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(name);
    if (index === -1) favorites.push(name);
    else favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderCards();
}

export function toggleCompare(name) {
    let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    const index = compareList.indexOf(name);
    if (index === -1) compareList.push(name);
    else compareList.splice(index, 1);
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareBar();
    renderCards();
}

export function updateCompareBar() {
    const compareCount = document.getElementById('compareCount');
    const compareBtn = document.getElementById('compareBtn');
    const compareBar = document.getElementById('compareBar');
    const list = JSON.parse(localStorage.getItem('compareList') || '[]');
    compareCount.textContent = list.length;
    if (list.length >= 2) compareBtn.disabled = false;
    else compareBtn.disabled = true;
    if (list.length > 0) compareBar.classList.remove('translate-y-full');
    else compareBar.classList.add('translate-y-full');
}

export function initCharts() {
    const catCanvas = document.getElementById('categoryChart');
    const statusCanvas = document.getElementById('statusChart');
    if (!catCanvas || !statusCanvas) return;
    const catCtx = catCanvas.getContext('2d');
    const statusCtx = statusCanvas.getContext('2d');
    const catCount = {};
    const statusCount = { normal: 0, warning: 0 };
    toolsData.forEach(t => {
        catCount[t.category] = (catCount[t.category] || 0) + 1;
        statusCount[t.status] = (statusCount[t.status] || 0) + 1;
    });

    window.catChart = new Chart(catCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(catCount),
            datasets: [{ data: Object.values(catCount), backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'] }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#333' } } } }
    });

    window.statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: [getText('normal'), getText('warning')],
            datasets: [{ data: [statusCount.normal, statusCount.warning], backgroundColor: ['#10b981', '#f59e0b'] }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#333' } } } }
    });
}