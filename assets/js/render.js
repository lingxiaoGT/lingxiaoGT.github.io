// 渲染模块 (～￣▽￣)～
import { getText } from './i18n.js';

// 辅助：构建父标签到子标签的映射
function buildParentToChildren() {
    const parentToChildren = {};
    window.toolsData.forEach(tool => {
        tool.tags.forEach(tag => {
            const parent = window.tagMapping[tag] || '其他';
            if (!parentToChildren[parent]) parentToChildren[parent] = new Set();
            if (tag !== parent) parentToChildren[parent].add(tag);
        });
    });
    for (let parent in parentToChildren) {
        parentToChildren[parent] = Array.from(parentToChildren[parent]).sort();
    }
    return parentToChildren;
}

// 创建单个标签按钮
function createTagButton(tag) {
    const btn = document.createElement('button');
    btn.className = `tag-btn px-3 py-1 rounded-full text-xs font-medium ${window.selectedTags.includes(tag) ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`;
    btn.dataset.tag = tag;
    btn.textContent = tag;
    btn.onclick = () => window.toggleTag(tag);
    return btn;
}

// 渲染标签区域（支持折叠和置顶）
export function renderTags() {
    const container = document.getElementById('tagFilters');
    if (!container) return;

    const parentToChildren = buildParentToChildren();
    let parents = Object.keys(parentToChildren).sort();
    if (parents.includes('其他')) {
        parents = parents.filter(p => p !== '其他');
        parents.push('其他');
    }

    container.innerHTML = '';
    parents.forEach(parent => {
        const children = parentToChildren[parent];
        if (!children || children.length === 0) return;

        const parentContainer = document.createElement('div');
        parentContainer.className = 'parent-tag-container';

        const parentBtn = document.createElement('button');
        const isExpanded = window.expandedParents.has(parent);
        parentBtn.className = `flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600`;
        parentBtn.innerHTML = `<span>${parent}</span> <i class="fas fa-chevron-down transition-transform ${isExpanded ? 'rotate-180' : ''}"></i>`;
        parentBtn.onclick = (e) => {
            e.stopPropagation();
            if (window.expandedParents.has(parent)) window.expandedParents.delete(parent);
            else window.expandedParents.add(parent);
            renderTags();
        };
        parentContainer.appendChild(parentBtn);

        const childContainer = document.createElement('div');
        childContainer.className = `flex flex-wrap gap-2 child-tag-container ${isExpanded ? '' : 'hidden'}`;
        children.forEach(childTag => {
            childContainer.appendChild(createTagButton(childTag));
        });
        parentContainer.appendChild(childContainer);

        container.appendChild(parentContainer);
    });
}

// 渲染分类按钮
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
    if (!container) return;
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
            renderCards();
        };
        container.appendChild(btn);
    });
}

// 渲染工具卡片
export function renderCards() {
    const container = document.getElementById('tools-container');
    if (!container) return;

    let filtered = window.toolsData.filter(tool => {
        if (window.currentCategory !== 'all' && tool.category !== window.currentCategory) return false;
        if (window.selectedTags.length && !window.selectedTags.every(tag => tool.tags.includes(tag))) return false;
        if (window.currentSearch) {
            const lower = window.currentSearch.toLowerCase();
            const match = tool.name.toLowerCase().includes(lower) || tool.desc.toLowerCase().includes(lower);
            if (!match && window.pinyin) {
                const namePinyin = window.pinyin(tool.name, { toneType: 'none' }).join('');
                const descPinyin = window.pinyin(tool.desc, { toneType: 'none' }).join('');
                if (namePinyin.includes(lower) || descPinyin.includes(lower)) return true;
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

    // 按分类分组
    const categories = {};
    filtered.forEach(tool => {
        if (!categories[tool.category]) categories[tool.category] = [];
        categories[tool.category].push(tool);
    });

    const order = ['网页版MC', '工具类', 'Wiki与百科', '社区/论坛', '模组/资源站', '启动器/加载器', '材质/光影/皮肤装饰', '服务器/技术', '其他资源'];
    order.forEach(cat => {
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

// 创建单个卡片
function createCard(tool) {
    const card = document.createElement('div');
    card.className = 'card bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col cursor-pointer';
    card.onclick = () => window.open(tool.url, '_blank');

    const statusText = tool.status === 'normal' ? getText('normal') : (tool.warningText || getText('warning'));
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    const isFavorite = favorites.includes(tool.name);
    const isCompare = compareList.includes(tool.name);

    card.innerHTML = `
        <div class="p-4 flex-1">
            <div class="flex items-start justify-between mb-2">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">${escapeHtml(tool.name)}</h3>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tool.status === 'normal' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'}">${statusText}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">${escapeHtml(tool.desc)}</p>
            <div class="flex flex-wrap gap-1 mb-3">
                ${tool.tags.map(tag => `<span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">${escapeHtml(tag)}</span>`).join('')}
            </div>
            <div class="mt-auto flex items-center justify-between" onclick="event.stopPropagation()">
                <div class="flex items-center gap-2">
                    <a href="${tool.url}" target="_blank" rel="noopener noreferrer" class="visit-link text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium text-sm" data-url="${tool.url}" onclick="event.stopPropagation()">${getText('visit')}</a>
                    <button onclick="window.showDetail('${escapeHtml(tool.name)}'); event.stopPropagation()" class="text-blue-500 hover:text-blue-700 text-sm"><i class="far fa-eye"></i></button>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.toggleFavorite('${escapeHtml(tool.name)}'); event.stopPropagation()" class="text-yellow-500 hover:text-yellow-600" title="${getText('favoriteBtn')}">
                        <i class="${isFavorite ? 'fas' : 'far'} fa-star"></i>
                    </button>
                    <button onclick="window.toggleCompare('${escapeHtml(tool.name)}'); event.stopPropagation()" class="text-gray-400 hover:text-gray-600" title="${getText('compareBtn')}">
                        <i class="${isCompare ? 'fas fa-check-square' : 'far fa-square'}"></i>
                    </button>
                    <button onclick="window.copyToClipboard('${tool.url}'); event.stopPropagation()" class="text-gray-400 hover:text-gray-600" title="${getText('copy')}">
                        <i class="far fa-copy"></i>
                    </button>
                    <button onclick="window.openFeedbackModal('${escapeHtml(tool.name)}'); event.stopPropagation()" class="text-gray-400 hover:text-gray-600 feedback-btn" title="${getText('feedbackTitle')}">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    return card;
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== 导出的函数 ==========
export function toggleTag(tag) {
    const idx = window.selectedTags.indexOf(tag);
    if (idx === -1) window.selectedTags.push(tag);
    else window.selectedTags.splice(idx, 1);
    localStorage.setItem('selectedTags', JSON.stringify(window.selectedTags));
    renderTags();
    renderCards();
}

export function showDetail(name) {
    const tool = window.toolsData.find(t => t.name === name);
    const modal = document.getElementById('detailModal');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDesc');
    const detail = document.getElementById('modalDetail');
    const link = document.getElementById('modalLink');
    if (tool && modal && title && desc && detail && link) {
        title.textContent = tool.name;
        desc.textContent = tool.desc;
        detail.textContent = tool.detail || getText('detailDefault');
        link.href = tool.url;
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
    const nameInput = document.getElementById('feedbackToolName');
    const nameSpan = document.getElementById('feedbackToolNameDisplay');
    if (modal && nameInput && nameSpan) {
        nameInput.value = toolName;
        nameSpan.textContent = toolName;
        modal.classList.add('show');
    }
}

export function toggleFavorite(name) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const idx = favorites.indexOf(name);
    if (idx === -1) favorites.push(name);
    else favorites.splice(idx, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderCards();
}

export function toggleCompare(name) {
    let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    const idx = compareList.indexOf(name);
    if (idx === -1) compareList.push(name);
    else compareList.splice(idx, 1);
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareBar();
    renderCards();
}

export function updateCompareBar() {
    const countSpan = document.getElementById('compareCount');
    const compareBtn = document.getElementById('compareBtn');
    const bar = document.getElementById('compareBar');
    const list = JSON.parse(localStorage.getItem('compareList') || '[]');
    if (countSpan) countSpan.textContent = list.length;
    if (compareBtn) compareBtn.disabled = list.length < 2;
    if (bar) {
        if (list.length > 0) bar.classList.remove('translate-y-full');
        else bar.classList.add('translate-y-full');
    }
}

export function initCharts() {
    const catCanvas = document.getElementById('categoryChart');
    const statusCanvas = document.getElementById('statusChart');
    if (!catCanvas || !statusCanvas) return;
    const catCtx = catCanvas.getContext('2d');
    const statusCtx = statusCanvas.getContext('2d');

    const catCount = {};
    const statusCount = { normal: 0, warning: 0 };
    window.toolsData.forEach(t => {
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