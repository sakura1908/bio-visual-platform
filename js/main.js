// ===== 生物知识可视化平台 - 主逻辑 =====

// 状态管理
let gameState = {
    xp: 0,
    level: 0,
    badges: [],
    knowledgeViewed: new Set(),
    experimentsCompleted: [],
    audioEnabled: true,
    isAudioPaused: false,
    currentSection: 'home',
    favorites: [],
    notes: '',
    currentFavItem: null,
    isLightTheme: false,
    sectionProgress: {
        plant: { viewed: 0, total: 12 },
        animal: { viewed: 0, total: 15 },
        human: { viewed: 0, total: 18 },
        cell: { viewed: 0, total: 8 },
        lifescience: { viewed: 0, total: 6 },
        experiment: { viewed: 0, total: 7 }
    }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    initNavigation();
    updateGameUI();
    initVocabulary();
    initTheme();
    updateProgressUI();
    loadNotes();
    updateAudioButtonState();
    initOnboarding();
    
    // 切换浏览器标签页时暂停朗读，避免离开页面后仍继续播放
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            gameState.isAudioPaused = true;
            updateAudioButtonState();
        }
    });
});

// 从localStorage加载游戏状态
function loadGameState() {
    const saved = localStorage.getItem('bioLearnGameState');
    if (saved) {
        const parsed = JSON.parse(saved);
        gameState = { ...gameState, ...parsed };
        // 恢复Set
        if (parsed.knowledgeViewed) {
            gameState.knowledgeViewed = new Set(parsed.knowledgeViewed);
        }
    }
}

// 保存游戏状态
function saveGameState() {
    const toSave = { ...gameState };
    toSave.knowledgeViewed = Array.from(gameState.knowledgeViewed);
    localStorage.setItem('bioLearnGameState', JSON.stringify(toSave));
}

// ===== 导航系统 =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
        });
    });
}

// ===== 新手引导 =====
let currentOnboardingStep = 1;
const totalOnboardingSteps = 4;

function initOnboarding() {
    const hasSeen = localStorage.getItem('bioLearnOnboardingSeen');
    if (hasSeen) return;
    
    // 延迟一点显示，让页面先加载完成
    setTimeout(() => {
        const overlay = document.getElementById('onboardingOverlay');
        if (overlay) overlay.style.display = 'flex';
    }, 800);
}

function showOnboardingStep(step) {
    document.querySelectorAll('.onboarding-step').forEach(s => s.classList.remove('active'));
    const target = document.querySelector('.onboarding-step[data-step="' + step + '"]');
    if (target) target.classList.add('active');
    currentOnboardingStep = step;
}

function nextOnboardingStep() {
    if (currentOnboardingStep < totalOnboardingSteps) {
        showOnboardingStep(currentOnboardingStep + 1);
    } else {
        finishOnboarding();
    }
}

function prevOnboardingStep() {
    if (currentOnboardingStep > 1) {
        showOnboardingStep(currentOnboardingStep - 1);
    }
}

function skipOnboarding() {
    const overlay = document.getElementById('onboardingOverlay');
    if (overlay) overlay.style.display = 'none';
    localStorage.setItem('bioLearnOnboardingSeen', 'true');
}

function finishOnboarding() {
    skipOnboarding();
    showToast('🎉 开始你的生物探索之旅吧！');
}

function switchSection(sectionId) {
    // 切换板块时停止当前朗读，避免跨板块音频继续播放
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    gameState.isAudioPaused = false;
    updateAudioButtonState();
    
    // 隐藏所有章节
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // 显示目标章节
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
    }
    
    // 更新导航高亮
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.dataset.section === sectionId);
    });
    
    // 移动端导航
    document.querySelector('.nav-links').classList.remove('show');
    
    gameState.currentSection = sectionId;
    
    // 添加经验值
    if (sectionId !== 'home') {
        addXP(5, '探索' + sectionId + '板块');
    }
}

function toggleNav() {
    document.querySelector('.nav-links').classList.toggle('show');
}

// ===== 主题切换 =====
function initTheme() {
    const savedTheme = localStorage.getItem('bioLearnTheme');
    if (savedTheme === 'light') {
        gameState.isLightTheme = true;
        document.body.classList.add('light-theme');
        document.getElementById('themeBtn').textContent = '☀️';
    }
}

function toggleTheme() {
    gameState.isLightTheme = !gameState.isLightTheme;
    document.body.classList.toggle('light-theme', gameState.isLightTheme);
    document.getElementById('themeBtn').textContent = gameState.isLightTheme ? '☀️' : '🌙';
    localStorage.setItem('bioLearnTheme', gameState.isLightTheme ? 'light' : 'dark');
}

// ===== 搜索系统 =====
function openSearch() {
    document.getElementById('searchOverlay').classList.add('active');
    document.getElementById('searchContainer').classList.add('active');
    document.getElementById('searchInput').focus();
}

function closeSearch() {
    document.getElementById('searchOverlay').classList.remove('active');
    document.getElementById('searchContainer').classList.remove('active');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '<p class="search-hint">🔍 输入关键词搜索知识点</p>';
}

function performSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsEl = document.getElementById('searchResults');
    
    if (query.length < 1) {
        resultsEl.innerHTML = '<p class="search-hint">🔍 输入关键词搜索知识点</p>';
        return;
    }
    
    const results = searchKnowledge(query);
    
    if (results.length === 0) {
        resultsEl.innerHTML = '<p class="search-hint">❌ 没有找到相关知识点，试试其他关键词</p>';
        return;
    }
    
    resultsEl.innerHTML = results.map(r => `
        <div class="search-result-item" onclick="jumpToResult('${r.section}', '${r.subsection}', '${r.id}')">
            <span class="search-result-icon">${r.icon}</span>
            <div class="search-result-content">
                <div class="search-result-title">${r.title}</div>
                <div class="search-result-desc">${r.desc}</div>
                <span class="search-result-section">${r.sectionName}</span>
            </div>
        </div>
    `).join('');
}

function searchKnowledge(query) {
    const results = [];
    const sections = [
        { key: 'plant', name: '🌱 植物世界', subsections: BIO_DATA.plant?.sections || {} },
        { key: 'animal', name: '🐛 动物王国', subsections: BIO_DATA.animal?.sections || {} },
        { key: 'human', name: '🧍 人体奥秘', subsections: BIO_DATA.human?.sections || {} },
        { key: 'cell', name: '🔬 细胞探秘', subsections: BIO_DATA.cell?.sections || {} },
        { key: 'lifescience', name: '🌏 生命科学', subsections: BIO_DATA.lifescience?.sections || {} }
    ];
    
    sections.forEach(sec => {
        Object.entries(sec.subsections).forEach(([subKey, sub]) => {
            if (sub.hotspots) {
                sub.hotspots.forEach(item => {
                    const searchText = (item.name + ' ' + (item.facts || []).join(' ')).toLowerCase();
                    if (searchText.includes(query)) {
                        results.push({
                            section: sec.key,
                            subsection: subKey,
                            id: item.id,
                            icon: item.icon || '📚',
                            title: item.name,
                            desc: item.facts?.[0] || '',
                            sectionName: sec.name
                        });
                    }
                });
            }
            
            if (sub.stages) {
                sub.stages.forEach(item => {
                    const searchText = (item.name + ' ' + (item.desc || '')).toLowerCase();
                    if (searchText.includes(query)) {
                        results.push({
                            section: sec.key,
                            subsection: subKey,
                            id: item.name,
                            icon: item.icon || '📚',
                            title: item.name,
                            desc: item.desc || '',
                            sectionName: sec.name
                        });
                    }
                });
            }
            
            if (sub.senses) {
                sub.senses.forEach(item => {
                    const searchText = (item.organ + ' ' + item.function).toLowerCase();
                    if (searchText.includes(query)) {
                        results.push({
                            section: sec.key,
                            subsection: subKey,
                            id: item.organ,
                            icon: item.icon || '👁️',
                            title: item.organ + ' — ' + item.sense,
                            desc: item.function,
                            sectionName: sec.name
                        });
                    }
                });
            }
        });
    });
    
    return results.slice(0, 20);
}

function jumpToResult(section, subsection, id) {
    closeSearch();
    switchSection(section);
    
    setTimeout(() => {
        if (section === 'plant' && typeof showPlantSection === 'function') showPlantSection(subsection);
        if (section === 'animal' && typeof showAnimalSection === 'function') showAnimalSection(subsection);
        if (section === 'human' && typeof showHumanSection === 'function') showHumanSection(subsection);
        if (section === 'cell' && typeof switchCellType === 'function') switchCellType(subsection);
        if (section === 'lifescience' && typeof showLifeSection === 'function') showLifeSection(subsection);
        window.scrollTo({ top: 200, behavior: 'smooth' });
    }, 100);
}

function handleSearchKeydown(e) {
    if (e.key === 'Escape') closeSearch();
}

// ===== 收藏系统 =====
function toggleFavorites() {
    document.getElementById('favoritesPanel').classList.toggle('active');
    renderFavorites();
}

function toggleFavorite(section) {
    const nameEl = document.getElementById('plantPartName');
    const iconEl = document.getElementById('plantPartIcon');
    const name = nameEl ? nameEl.textContent.replace(/^[^\s]+\s*/, '') : '未命名';
    const icon = iconEl ? iconEl.textContent : '📚';
    
    const favItem = {
        id: section + '_' + Date.now(),
        section: section,
        name: name,
        icon: icon,
        timestamp: Date.now()
    };
    
    const existingIndex = gameState.favorites.findIndex(f => f.section === section && f.name === name);
    
    if (existingIndex >= 0) {
        gameState.favorites.splice(existingIndex, 1);
        showToast('已取消收藏');
    } else {
        gameState.favorites.push(favItem);
        showToast('已添加到收藏夹 ❤️');
    }
    
    saveGameState();
    updateFavButton();
}

function updateFavButton() {
    const btn = document.getElementById('plantFavBtn');
    if (!btn) return;
    
    const nameEl = document.getElementById('plantPartName');
    const name = nameEl ? nameEl.textContent.replace(/^[^\s]+\s*/, '') : '';
    const isFav = gameState.favorites.some(f => f.name === name);
    btn.textContent = isFav ? '❤️' : '♡';
    btn.classList.toggle('active', isFav);
}

function renderFavorites() {
    const list = document.getElementById('favoritesList');
    
    if (gameState.favorites.length === 0) {
        list.innerHTML = '<p class="fav-empty">还没有收藏内容，快去学习吧！</p>';
        return;
    }
    
    const sectionNames = {
        plant: '🌱 植物',
        animal: '🐛 动物',
        human: '🧍 人体',
        cell: '🔬 细胞',
        lifescience: '🌏 生命科学'
    };
    
    list.innerHTML = gameState.favorites.map(fav => `
        <div class="fav-item" onclick="jumpToFavorite('${fav.section}')">
            <span class="fav-item-icon">${fav.icon}</span>
            <div class="fav-item-content">
                <div class="fav-item-title">${fav.name}</div>
                <div class="fav-item-section">${sectionNames[fav.section] || fav.section}</div>
            </div>
            <button class="fav-item-remove" onclick="event.stopPropagation(); removeFavorite('${fav.id}')">✕</button>
        </div>
    `).join('');
}

function jumpToFavorite(section) {
    toggleFavorites();
    switchSection(section);
}

function removeFavorite(id) {
    gameState.favorites = gameState.favorites.filter(f => f.id !== id);
    saveGameState();
    renderFavorites();
    showToast('已移除');
}

// ===== 笔记系统 =====
function toggleNotes() {
    document.getElementById('notesPanel').classList.toggle('active');
}

function loadNotes() {
    const savedNotes = localStorage.getItem('bioLearnNotes');
    if (savedNotes) {
        gameState.notes = savedNotes;
        const notesInput = document.getElementById('notesInput');
        if (notesInput) notesInput.value = savedNotes;
    }
}

function saveNotes() {
    gameState.notes = document.getElementById('notesInput').value;
    localStorage.setItem('bioLearnNotes', gameState.notes);
}

function exportNotes() {
    const notes = document.getElementById('notesInput').value;
    if (!notes) {
        showToast('笔记为空');
        return;
    }
    
    const content = '生物知识可视化平台 - 学习笔记\n\n' + notes;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '生物学习笔记_' + new Date().toLocaleDateString() + '.txt';
    a.click();
    URL.revokeObjectURL(url);
    showToast('笔记已导出！');
}

// ===== 学习进度 =====
function updateProgressUI() {
    const progress = gameState.sectionProgress;
    
    ['plant', 'animal', 'human', 'cell', 'lifescience', 'experiment'].forEach(sec => {
        const viewed = progress[sec]?.viewed || 0;
        const total = progress[sec]?.total || 1;
        const percent = Math.round((viewed / total) * 100);
        
        const secCap = sec.charAt(0).toUpperCase() + sec.slice(1);
        const fill = document.getElementById('progress' + secCap);
        const text = document.getElementById('progress' + secCap + 'Text');
        
        if (fill) fill.style.width = percent + '%';
        if (text) text.textContent = percent + '%';
    });
    
    const totalViewed = Object.values(progress).reduce((sum, p) => sum + p.viewed, 0);
    const totalItems = Object.values(progress).reduce((sum, p) => sum + p.total, 0);
    const overallPercent = Math.round((totalViewed / totalItems) * 100);
    
    const overallPercentEl = document.getElementById('overallPercent');
    const overallFillEl = document.getElementById('overallFill');
    if (overallPercentEl) overallPercentEl.textContent = overallPercent + '%';
    if (overallFillEl) overallFillEl.style.width = overallPercent + '%';
}

function recordKnowledgeView(section, itemId) {
    const key = section + '_' + itemId;
    if (!gameState.knowledgeViewed.has(key)) {
        gameState.knowledgeViewed.add(key);
        
        if (gameState.sectionProgress[section]) {
            gameState.sectionProgress[section].viewed++;
        }
        
        updateProgressUI();
        saveGameState();
    }
}

// ===== 植物世界 =====
function showPlantSection(section) {
    document.querySelectorAll('#plant .plant-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('#plant .sub-nav-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById('plant-' + section);
    if (target) target.classList.add('active');
    
    const sections = ['whole-plant', 'seed-structure', 'plant-classification', 'lifecycle', 'environment-adaptation'];
    const btn = document.querySelector('#plant .sub-nav-btn:nth-child(' + (sections.indexOf(section) + 1) + ')');
    if (btn) btn.classList.add('active');
    
    addXP(5, '切换植物章节');
}

function showPlantPart(partId) {
    const plant = BIO_DATA.plant.sections['whole-plant'];
    const part = plant.hotspots.find(h => h.id === partId);
    if (!part) return;
    
    document.getElementById('plantPartIcon').textContent = part.icon;
    document.getElementById('plantPartName').textContent = part.name;
    
    const factsHtml = part.facts.map(f => '<li>' + f + '</li>').join('');
    // 附图：为花、根、茎提供教材风格 SVG 结构示意图
    const diagram = getPlantDiagram(partId);
    const diagramHtml = diagram ? '<div class="plant-diagram">' + diagram + '</div>' : '';
    document.getElementById('plantPartFacts').innerHTML = diagramHtml + '<ul>' + factsHtml + '</ul>';
    
    document.getElementById('plantGradeTags').style.display = 'flex';
    document.getElementById('plantSpeakBtn').style.display = 'inline-block';
    
    const partEl = document.querySelector('.plant-part[data-part="' + partId + '"]');
    if (partEl) {
        partEl.style.filter = 'brightness(1.5)';
        setTimeout(() => { partEl.style.filter = ''; }, 500);
    }
    
    if (!gameState.knowledgeViewed.has('plant_' + partId)) {
        gameState.knowledgeViewed.add('plant_' + partId);
        recordKnowledgeView('plant', partId);
        addXP(BIO_DATA.game.xpRewards.readKnowledge, '学习植物知识');
        checkBadges();
    }
    
    updateFavButton();
    speak(part.name + '。' + part.facts.join('。'));
}

// ============================================================
// 植物结构 SVG 附图（教材风格示意）
// 解决问题：开花植物结构缺附图、植物分类对比缺直观图示
// ============================================================
function getPlantDiagram(partId) {
    const diagrams = {
        flower: `
            <svg viewBox="0 0 360 280" style="width:100%;max-width:360px;background:linear-gradient(135deg,#f0fdf4,#ecfeff);border-radius:12px;padding:8px;" xmlns="http://www.w3.org/2000/svg">
                <!-- 萼片（绿色，底层） -->
                <g stroke="#14532d" stroke-width="2">
                    <path d="M120 150 Q90 110 110 80 Q140 95 150 140 Z" fill="#22c55e" opacity="0.85"/>
                    <path d="M240 150 Q270 110 250 80 Q220 95 210 140 Z" fill="#16a34a" opacity="0.85"/>
                    <path d="M180 165 Q150 130 170 95 Q200 110 195 150 Z" fill="#15803d" opacity="0.8"/>
                </g>
                <!-- 花瓣（粉红色） -->
                <g stroke="#9f1239" stroke-width="2">
                    <ellipse cx="120" cy="120" rx="42" ry="58" fill="#f472b6" opacity="0.9" transform="rotate(-30 120 120)"/>
                    <ellipse cx="240" cy="120" rx="42" ry="58" fill="#ec4899" opacity="0.9" transform="rotate(30 240 120)"/>
                    <ellipse cx="180" cy="85" rx="42" ry="58" fill="#f9a8d4" opacity="0.9"/>
                    <ellipse cx="145" cy="170" rx="38" ry="54" fill="#f472b6" opacity="0.85" transform="rotate(-70 145 170)"/>
                    <ellipse cx="215" cy="170" rx="38" ry="54" fill="#ec4899" opacity="0.85" transform="rotate(70 215 170)"/>
                </g>
                <!-- 雄蕊（多根，黄色花药+细丝） -->
                <g stroke="#a16207" stroke-width="1.8">
                    <line x1="180" y1="140" x2="150" y2="95" />
                    <line x1="180" y1="140" x2="210" y2="95" />
                    <line x1="180" y1="140" x2="165" y2="90" />
                    <line x1="180" y1="140" x2="195" y2="90" />
                    <circle cx="150" cy="93" r="7" fill="#fde047"/>
                    <circle cx="210" cy="93" r="7" fill="#facc15"/>
                    <circle cx="165" cy="88" r="6.5" fill="#fde047"/>
                    <circle cx="195" cy="88" r="6.5" fill="#facc15"/>
                </g>
                <!-- 雌蕊（中央，粗，绿色子房+紫色柱头） -->
                <g stroke="#581c87" stroke-width="2">
                    <rect x="173" y="140" width="14" height="48" rx="6" fill="#a3e635"/>
                    <ellipse cx="180" cy="130" rx="9" ry="14" fill="#c084fc"/>
                </g>
                <!-- 子房标注 -->
                <text x="172" y="208" font-size="11" fill="#581c87" font-weight="bold">子房</text>
                <!-- 引线 + 标签 -->
                <g stroke-dasharray="3,2" stroke-width="1.2">
                    <line x1="100" y1="78" x2="60" y2="48" stroke="#15803d"/>
                    <line x1="180" y1="60" x2="180" y2="28" stroke="#be185d"/>
                    <line x1="148" y1="86" x2="92" y2="40" stroke="#a16207"/>
                    <line x1="186" y1="128" x2="280" y2="110" stroke="#581c87"/>
                </g>
                <text x="20" y="44" font-size="12" fill="#15803d" font-weight="bold">萼片</text>
                <text x="158" y="22" font-size="12" fill="#be185d" font-weight="bold">花瓣</text>
                <text x="50" y="36" font-size="12" fill="#a16207" font-weight="bold">雄蕊</text>
                <text x="284" y="108" font-size="12" fill="#581c87" font-weight="bold">雌蕊</text>
                <!-- 底部说明 -->
                <text x="180" y="265" font-size="11" fill="#475569" text-anchor="middle">花的结构（剖面示意）</text>
            </svg>
        `,
        root: `
            <svg viewBox="0 0 360 260" style="width:100%;max-width:360px;background:linear-gradient(135deg,#fef3c7,#fef9c3);border-radius:12px;padding:8px;" xmlns="http://www.w3.org/2000/svg">
                <!-- 地平线 -->
                <line x1="20" y1="70" x2="340" y2="70" stroke="#78350f" stroke-width="2"/>
                <text x="24" y="62" font-size="10" fill="#78350f">地面</text>
                <!-- 左：直根（桃树） -->
                <g stroke="#78350f" stroke-width="1.8">
                    <path d="M90 70 L86 200" stroke-width="6" stroke="#92400e"/>
                    <path d="M88 110 Q70 135 60 160" fill="none" stroke="#a16207" stroke-width="2"/>
                    <path d="M88 110 Q106 135 116 160" fill="none" stroke="#a16207" stroke-width="2"/>
                    <path d="M87 150 Q73 170 66 190" fill="none" stroke="#a16207" stroke-width="1.6"/>
                    <path d="M87 150 Q101 170 108 190" fill="none" stroke="#a16207" stroke-width="1.6"/>
                    <path d="M86 180 Q78 195 73 210" fill="none" stroke="#a16207" stroke-width="1.4"/>
                    <path d="M86 180 Q94 195 99 210" fill="none" stroke="#a16207" stroke-width="1.4"/>
                </g>
                <text x="90" y="245" font-size="12" fill="#92400e" font-weight="bold" text-anchor="middle">直根（桃树）</text>
                <text x="90" y="232" font-size="10" fill="#78350f" text-anchor="middle">一根粗壮主根</text>
                <!-- 右：须根（水稻） -->
                <g stroke="#78350f" stroke-width="1.8">
                    <path d="M260 70 L258 100" stroke-width="3" stroke="#92400e"/>
                    <path d="M260 95 Q240 120 230 160" fill="none" stroke="#a16207" stroke-width="1.6"/>
                    <path d="M260 95 Q250 120 244 165" fill="none" stroke="#a16207" stroke-width="1.6"/>
                    <path d="M260 95 Q272 120 278 165" fill="none" stroke="#a16207" stroke-width="1.6"/>
                    <path d="M260 95 Q282 118 290 158" fill="none" stroke="#a16207" stroke-width="1.6"/>
                    <path d="M260 95 Q268 125 270 175" fill="none" stroke="#a16207" stroke-width="1.6"/>
                    <path d="M230 160 Q226 185 222 205" fill="none" stroke="#a16207" stroke-width="1.4"/>
                    <path d="M244 165 Q242 188 240 210" fill="none" stroke="#a16207" stroke-width="1.4"/>
                    <path d="M278 165 Q280 188 282 210" fill="none" stroke="#a16207" stroke-width="1.4"/>
                    <path d="M290 158 Q294 182 298 205" fill="none" stroke="#a16207" stroke-width="1.4"/>
                    <path d="M270 175 Q270 195 270 215" fill="none" stroke="#a16207" stroke-width="1.4"/>
                </g>
                <text x="260" y="245" font-size="12" fill="#92400e" font-weight="bold" text-anchor="middle">须根（水稻）</text>
                <text x="260" y="232" font-size="10" fill="#78350f" text-anchor="middle">无主根，细根丛生</text>
                <!-- 对比箭头 -->
                <text x="180" y="130" font-size="14" fill="#dc2626" font-weight="bold" text-anchor="middle">VS</text>
            </svg>
        `,
        stem: `
            <svg viewBox="0 0 360 260" style="width:100%;max-width:360px;background:linear-gradient(135deg,#ecfdf5,#f0fdfa);border-radius:12px;padding:8px;" xmlns="http://www.w3.org/2000/svg">
                <!-- 1.直立茎 -->
                <g>
                    <line x1="50" y1="50" x2="50" y2="200" stroke="#15803d" stroke-width="4"/>
                    <circle cx="50" cy="45" r="7" fill="#f472b6"/>
                    <ellipse cx="42" cy="90" rx="10" ry="5" fill="#22c55e" transform="rotate(-30 42 90)"/>
                    <ellipse cx="58" cy="130" rx="10" ry="5" fill="#22c55e" transform="rotate(30 58 130)"/>
                    <text x="50" y="225" font-size="10" fill="#15803d" font-weight="bold" text-anchor="middle">直立茎</text>
                    <text x="50" y="240" font-size="9" fill="#475569" text-anchor="middle">向日葵</text>
                </g>
                <!-- 2.缠绕茎 -->
                <g>
                    <path d="M110 200 Q100 170 120 150 Q140 130 120 110 Q100 90 120 70 Q140 55 130 45" fill="none" stroke="#166534" stroke-width="3"/>
                    <circle cx="130" cy="42" r="6" fill="#f472b6"/>
                    <line x1="95" y1="200" x2="95" y2="50" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,2"/>
                    <text x="115" y="225" font-size="10" fill="#166534" font-weight="bold" text-anchor="middle">缠绕茎</text>
                    <text x="115" y="240" font-size="9" fill="#475569" text-anchor="middle">牵牛花</text>
                </g>
                <!-- 3.匍匐茎 -->
                <g>
                    <path d="M170 180 Q185 175 200 180 Q215 185 230 180 Q245 175 260 180" fill="none" stroke="#15803d" stroke-width="3"/>
                    <circle cx="180" cy="178" r="5" fill="#86efac"/>
                    <circle cx="210" cy="178" r="5" fill="#86efac"/>
                    <circle cx="240" cy="178" r="5" fill="#86efac"/>
                    <line x1="180" y1="183" x2="178" y2="200" stroke="#a16207" stroke-width="1.5"/>
                    <line x1="210" y1="183" x2="210" y2="200" stroke="#a16207" stroke-width="1.5"/>
                    <line x1="240" y1="183" x2="242" y2="200" stroke="#a16207" stroke-width="1.5"/>
                    <text x="215" y="225" font-size="10" fill="#15803d" font-weight="bold" text-anchor="middle">匍匐茎</text>
                    <text x="215" y="240" font-size="9" fill="#475569" text-anchor="middle">红薯</text>
                </g>
                <!-- 4.变态储存茎 -->
                <g>
                    <ellipse cx="310" cy="180" rx="22" ry="16" fill="#fbbf24" stroke="#a16207" stroke-width="2"/>
                    <circle cx="295" cy="180" r="2.5" fill="#92400e"/>
                    <circle cx="305" cy="174" r="2.5" fill="#92400e"/>
                    <circle cx="318" cy="186" r="2.5" fill="#92400e"/>
                    <line x1="310" y1="164" x2="310" y2="145" stroke="#15803d" stroke-width="2"/>
                    <ellipse cx="304" cy="150" rx="6" ry="3" fill="#22c55e"/>
                    <text x="310" y="225" font-size="10" fill="#a16207" font-weight="bold" text-anchor="middle">变态储存茎</text>
                    <text x="310" y="240" font-size="9" fill="#475569" text-anchor="middle">土豆</text>
                </g>
            </svg>
        `
    };
    return diagrams[partId] || '';
}

function speakPlantFacts() {
    const name = document.getElementById('plantPartName').textContent;
    const facts = Array.from(document.querySelectorAll('#plantPartFacts li')).map(l => l.textContent);
    speak(name + '的知识点：' + facts.join('。'));
}

function speak(text) {
    if (!gameState.audioEnabled) return;
    if (!('speechSynthesis' in window)) return;
    
    // 停止旧朗读，准备播放新内容
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    gameState.isAudioPaused = false;
    updateAudioButtonState();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    const voices = window.speechSynthesis.getVoices();
    const chineseVoice = voices.find(v => v.lang.includes('zh'));
    if (chineseVoice) utterance.voice = chineseVoice;
    
    // 朗读结束时更新按钮状态
    utterance.onend = () => updateAudioButtonState();
    utterance.onerror = () => updateAudioButtonState();
    
    window.speechSynthesis.speak(utterance);
    updateAudioButtonState(); // 立即显示为播放中
}

function showSeedPart(partId) {
    const seed = BIO_DATA.plant.sections['seed-structure'];
    const part = seed.hotspots.find(h => h.id === partId);
    if (!part) return;
    
    const factsHtml = part.facts.map(f => '<li>' + f + '</li>').join('');
    document.getElementById('plantPartFacts').innerHTML = '<h3>' + part.icon + ' ' + part.name + '</h3><ul>' + factsHtml + '</ul>';
    speak(part.name + '：' + part.facts.join('。'));
    recordKnowledgeView('plant', 'seed_' + partId);
}

function showLifecycleStage(index) {
    const stages = BIO_DATA.plant.sections['lifecycle'].stages;
    const stage = stages[index];
    
    document.getElementById('lifecycleTitle').textContent = stage.icon + ' ' + stage.name;
    document.getElementById('lifecycleDesc').textContent = stage.desc;
    
    const stageEl = document.querySelectorAll('.timeline-item')[index];
    if (stageEl) {
        const iconEl = stageEl.querySelector('.stage-icon');
        if (iconEl) {
            iconEl.style.transform = 'scale(1.2)';
            setTimeout(() => { iconEl.style.transform = ''; }, 500);
        }
    }
    
    speak(stage.name + '：' + stage.desc);
    recordKnowledgeView('plant', 'lifecycle_' + index);
}

function showAdaptation(plant) {
    const plants = BIO_DATA.plant.sections['environment-adaptation'].plants;
    const p = plants.find(pl => pl.name === plant || pl.icon.includes(plant));
    if (!p) return;
    
    const factsHtml = p.adaptations.map(a => '<li>' + a + '</li>').join('');
    document.getElementById('plantPartFacts').innerHTML = 
        '<h3>' + p.icon + ' ' + p.name + '</h3>' +
        '<p style="color: var(--accent-orange); margin-bottom: 10px;">' + p.habitat + '</p>' +
        '<ul>' + factsHtml + '</ul>';
    speak(p.name + '适应' + p.habitat + '：' + p.adaptations.join('。'));
    recordKnowledgeView('plant', 'adapt_' + p.name);
}

// ===== 动物王国 =====
function showAnimalSection(section) {
    const sections = ['insect', 'fish', 'silkworm', 'mollusk', 'ecosystem'];
    document.querySelectorAll('#animal .animal-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('#animal .sub-nav-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById('animal-' + section);
    if (target) target.classList.add('active');
    
    const btn = document.querySelector('#animal .sub-nav-btn:nth-child(' + (sections.indexOf(section) + 1) + ')');
    if (btn) btn.classList.add('active');
}

function showInsectPart(partId) {
    const messages = {
        antenna: { name: '触角', facts: ['1对触角，传递气味、交流信息', '不同昆虫触角形状不同', '触角能感知气味和环境信息'] },
        head: { name: '头部', facts: ['有口器负责进食', '眼睛能感知光线', '触角长在头上'] },
        thorax: { name: '胸部', facts: ['唯一长足的部位，共6条腿', '部分昆虫胸部会长翅膀', '是运动的中心'] },
        legs: { name: '六足', facts: ['共6条腿，分布在胸部', '用于行走和跳跃', '三对足，对称分布'] },
        abdomen: { name: '腹部', facts: ['无足，包含消化、生殖器官', '内部有重要器官', '尾部可能有毒刺'] }
    };
    
    const msg = messages[partId];
    if (!msg) return;
    
    const factsHtml = msg.facts.map(f => '<li>' + f + '</li>').join('');
    document.getElementById('insectKnowledge').innerHTML = '<h3>🦋 ' + msg.name + '结构</h3><ul>' + factsHtml + '</ul>';
    speak(msg.facts.join('。'));
    recordKnowledgeView('animal', 'insect_' + partId);
}

function showFishPart(partId) {
    const messages = {
        gill: { name: '鳃', facts: ['呼吸器官，只能在水中提取氧气', '离水会窒息', '鳃丝含有丰富血管'] },
        fin: { name: '鱼鳍', facts: ['胸鳍、背鳍、尾鳍', '控制平衡、游动方向', '不同鱼鳍功能不同'] },
        scale: { name: '鳞片', facts: ['覆盖全身，保护肉体', '减少水中擦伤', '鳞片上有年轮可判断年龄'] }
    };
    
    const msg = messages[partId];
    if (!msg) return;
    
    speak('鱼的' + msg.name + '：' + msg.facts.join('。'));
    recordKnowledgeView('animal', 'fish_' + partId);
}

function showSilkStage(index) {
    const stages = BIO_DATA.animal.sections.silkworm.stages;
    const stage = stages[index];
    
    document.getElementById('silkStageTitle').textContent = stage.icon + ' ' + stage.name;
    document.getElementById('silkStageDetail').textContent = stage.detail;
    
    speak(stage.name + '：' + stage.detail);
    recordKnowledgeView('animal', 'silk_' + index);
}

function showMollusk(type) {
    const details = {
        snail: {
            name: '蜗牛',
            icon: '🐌',
            facts: ['外壳螺旋贝壳，保护柔软身体', '两对触角，长触角顶端有眼睛', '腹足爬行，分泌黏液减少摩擦', '喜爱阴暗潮湿环境']
        },
        earthworm: {
            name: '蚯蚓',
            icon: '🪱',
            facts: ['全身由一圈圈相同体节连接而成', '无明显头、胸、腹划分', '湿润表皮依靠体表完成气体交换', '中间粗大段为环带，负责繁殖']
        }
    };
    
    const d = details[type];
    if (!d) return;
    
    const factsHtml = d.facts.map(f => '<li>' + f + '</li>').join('');
    document.getElementById('molluskDetail').innerHTML = '<h3>' + d.icon + ' ' + d.name + '</h3><ul>' + factsHtml + '</ul>';
    speak(d.name + '：' + d.facts.join('。'));
    recordKnowledgeView('animal', 'mollusk_' + type);
}

function showEcoRole(role) {
    const roles = BIO_DATA.animal.sections.ecosystem.roles;
    const r = roles.find(r => r.role.toLowerCase().includes(role));
    if (!r) return;
    
    const factsHtml = '<li>作用：' + r.function + '</li><li>例子：' + r.examples + '</li><li>' + r.detail + '</li>';
    document.getElementById('ecoKnowledge').innerHTML = '<h3>' + r.icon + ' ' + r.role + '</h3><ul>' + factsHtml + '</ul>';
    speak(r.role + '：' + r.function + '。' + r.detail);
    recordKnowledgeView('animal', 'eco_' + r.role);
}

// ===== 人体奥秘 =====
function showHumanSection(section) {
    const sections = ['five-senses', 'movement', 'digestive', 'respiratory', 'circulatory', 'nervous'];
    document.querySelectorAll('#human .human-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('#human .sub-nav-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById('human-' + section);
    if (target) target.classList.add('active');
    
    const btn = document.querySelector('#human .sub-nav-btn:nth-child(' + (sections.indexOf(section) + 1) + ')');
    if (btn) btn.classList.add('active');
}

function showSense(sense) {
    const senses = BIO_DATA.human.sections['five-senses'].senses;
    const s = senses.find(sen => sen.organ.includes(sense.charAt(0).toUpperCase() + sense.slice(1)));
    if (!s) return;
    
    document.getElementById('senseDetail').innerHTML = 
        '<h3>' + s.icon + ' ' + s.organ + ' — ' + s.sense + '</h3>' +
        '<p style="margin: 10px 0;"><strong>功能：</strong>' + s.function + '</p>' +
        '<p style="color: var(--text-secondary);">' + s.detail + '</p>';
    speak(s.organ + '负责' + s.sense + '，' + s.function + '。' + s.detail);
    recordKnowledgeView('human', 'sense_' + s.organ);
}

function showMovementPart(part) {
    const parts = BIO_DATA.human.sections.movement.components;
    const p = parts.find(c => c.name.toLowerCase().includes(part));
    if (!p) return;
    
    const factsHtml = p.details.map(d => '<li>' + d + '</li>').join('');
    speak(p.name + '：' + p.function + '。' + p.details.join('。'));
    recordKnowledgeView('human', 'move_' + part);
}

function showDigestStep(step) {
    const steps = {
        mouth: { name: '口腔', func: '牙齿切碎食物，唾液初步分解淀粉' },
        esophagus: { name: '食道', func: '输送食物向下进入胃部' },
        stomach: { name: '胃', func: '肌肉蠕动研磨食物，胃液分解蛋白质' },
        intestine: { name: '小肠', func: '人体最主要营养吸收场所，营养进入血液' },
        'large-intestine': { name: '大肠', func: '吸收食物残渣剩余水分，储存粪便' }
    };
    
    const s = steps[step];
    if (!s) return;
    speak(s.name + '：' + s.func);
    recordKnowledgeView('human', 'digest_' + step);
}

function showRespPart(part) {
    const parts = {
        nose: { name: '鼻咽喉', func: '气体进出通道，温润、清洁空气' },
        trachea: { name: '气管', func: '输送空气到肺部，有纤毛清除灰尘' },
        bronchus: { name: '支气管', func: '分左右两支进入肺部' },
        lung: { name: '肺部', func: '气体交换核心器官，肺泡完成氧气和二氧化碳交换' }
    };
    
    const p = parts[part];
    if (!p) return;
    speak(p.func);
    recordKnowledgeView('human', 'resp_' + part);
}

function showCirculatoryPart(part) {
    const parts = {
        heart: { name: '心脏', func: '血液动力泵，持续收缩舒张推动血液流动' },
        artery: { name: '动脉', func: '输送富含氧气的血液到全身各处' },
        vein: { name: '静脉', func: '回收携带废物的血液回到心脏' },
        capillary: { name: '毛细血管', func: '连接动脉和静脉，完成氧气、营养、废物交换' }
    };
    
    const p = parts[part];
    if (!p) return;
    speak(p.name + '：' + p.func);
    recordKnowledgeView('human', 'circ_' + part);
}

function showNervousPart(part) {
    const parts = {
        brain: { name: '大脑', func: '最高级中枢，思维、记忆、运动、语言中枢' },
        spinal: { name: '脊髓', func: '低级中枢，反射中枢，传递信息' },
        nerves: { name: '神经', func: '遍布全身，传递信号' }
    };
    
    const p = parts[part];
    if (!p) return;
    speak(p.name + '：' + p.func);
    recordKnowledgeView('human', 'nervous_' + part);
}

// ===== 细胞探秘 =====
function switchCellType(type) {
    document.querySelectorAll('.cell-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    
    const cellEl = document.getElementById('cell-' + type);
    const btnEl = document.getElementById(type + 'CellBtn');
    
    if (cellEl) cellEl.classList.add('active');
    if (btnEl) btnEl.classList.add('active');
    
    addXP(5, '切换细胞类型');
    recordKnowledgeView('cell', type);
}

function showOrganelle(orgId) {
    const plantOrganelles = BIO_DATA.cell.sections['plant-cell'].organelles;
    const animalOrganelles = BIO_DATA.cell.sections['animal-cell'].organelles;
    
    const allOrgs = [...plantOrganelles, ...animalOrganelles];
    const org = allOrgs.find(o => o.id === orgId || o.name === orgId);
    
    if (org) {
        const factsHtml = org.facts.map(f => '<li>' + f + '</li>').join('');
        speak(org.name + '：' + org.facts.join('。'));
        
        if (!gameState.knowledgeViewed.has('cell_' + orgId)) {
            gameState.knowledgeViewed.add('cell_' + orgId);
            addXP(BIO_DATA.game.xpRewards.readKnowledge, '学习细胞知识');
            recordKnowledgeView('cell', orgId);
            checkBadges();
        }
    }
}

// ===== 生命科学 =====
function showLifeSection(section) {
    const sections = ['heredity', 'evolution', 'biodiversity'];
    document.querySelectorAll('#lifescience .life-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('#lifescience .sub-nav-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById('lifescience-' + section);
    if (target) target.classList.add('active');
    
    const btn = document.querySelector('#lifescience .sub-nav-btn:nth-child(' + (sections.indexOf(section) + 1) + ')');
    if (btn) btn.classList.add('active');
}

function showHV(type) {
    const concepts = BIO_DATA.lifescience.sections['heredity-variation'].concepts;
    const c = concepts.find(con => con.name.toLowerCase() === type);
    if (!c) return;
    
    speak(c.name + '：' + c.meaning + '。' + c.result + '。' + c.purpose);
    recordKnowledgeView('lifescience', 'hv_' + type);
}

// ===== 虚拟实验 =====
function startExperiment(expId) {
    const workspace = document.getElementById('labWorkspace');
    const content = document.getElementById('labContent');
    workspace.style.display = 'block';
    
    let html = '';
    
    switch(expId) {
        case 'seed-germination': html = createSeedGerminationGame(); break;
        case 'organ-match': html = createOrganMatchGame(); break;
        case 'animal-quiz': html = createAnimalQuizGame(); break;
        case 'cell-build': html = createCellBuildGame(); break;
        case 'ecosystem-chain': html = createEcosystemChainGame(); break;
        case 'body-system': html = createBodySystemGame(); break;
        case 'photosynthesis': html = createPhotosynthesisGame(); break;
    }
    
    content.innerHTML = html;
    window.scrollTo({ top: workspace.offsetTop - 100, behavior: 'smooth' });
}

function closeExperiment() {
    document.getElementById('labWorkspace').style.display = 'none';
}

// ===== 种子萌发实验室（入门实验） =====
function createSeedGerminationGame() {
    // 重置条件
    seedConditions = { water: false, temp: false, air: false };
    return `
        <h3>🌱 种子萌发实验室</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">小科学家，请为种子选择萌发需要的三个条件</p>
        <div class="seed-lab">
            <div class="seed-stage" id="seedStage">
                <div class="big-seed">🌰</div>
                <div class="seed-status" id="seedStatus">种子正在睡觉...</div>
            </div>
            <div class="condition-cards">
                <div class="condition-card" id="cond-water" onclick="toggleCondition('water')">
                    <div class="cond-icon">💧</div>
                    <div class="cond-name">水分</div>
                    <div class="cond-state" id="state-water">未添加</div>
                </div>
                <div class="condition-card" id="cond-temp" onclick="toggleCondition('temp')">
                    <div class="cond-icon">🌡️</div>
                    <div class="cond-name">适宜温度</div>
                    <div class="cond-state" id="state-temp">未添加</div>
                </div>
                <div class="condition-card" id="cond-air" onclick="toggleCondition('air')">
                    <div class="cond-icon">💨</div>
                    <div class="cond-name">空气</div>
                    <div class="cond-state" id="state-air">未添加</div>
                </div>
            </div>
            <button class="check-btn" id="germinateBtn" onclick="checkSeedGermination()">🔬 开始萌发</button>
            <div class="germination-result" id="germinationResult"></div>
        </div>
    `;
}

function toggleCondition(type) {
    seedConditions[type] = !seedConditions[type];
    const card = document.getElementById('cond-' + type);
    const state = document.getElementById('state-' + type);
    if (seedConditions[type]) {
        card.classList.add('active');
        state.textContent = '已添加 ✓';
        state.style.color = 'var(--accent-green)';
        playSound('click');
    } else {
        card.classList.remove('active');
        state.textContent = '未添加';
        state.style.color = 'var(--text-secondary)';
    }
}

function checkSeedGermination() {
    const resultEl = document.getElementById('germinationResult');
    const statusEl = document.getElementById('seedStatus');
    const seedEl = document.querySelector('.big-seed');

    const allReady = seedConditions.water && seedConditions.temp && seedConditions.air;
    const missing = [];
    if (!seedConditions.water) missing.push('水分');
    if (!seedConditions.temp) missing.push('适宜温度');
    if (!seedConditions.air) missing.push('空气');

    if (allReady) {
        statusEl.textContent = '种子萌发啦！🌱';
        seedEl.textContent = '🌱';
        seedEl.style.animation = 'seedGrow 0.8s ease forwards';
        resultEl.innerHTML = '<div class="result-success">🎉 太棒了！种子萌发需要：水分 + 适宜温度 + 充足空气</div>';
        showToast('🎉 实验成功！');
        addXP(BIO_DATA.game.xpRewards.completeExperiment, '完成种子萌发实验');
        recordKnowledgeView('experiment', 'seed-germination');
        if (!gameState.experimentsCompleted.includes('seed-germination')) {
            gameState.experimentsCompleted.push('seed-germination');
        }
        checkBadges();
        updateProgressUI();
    } else {
        statusEl.textContent = '条件还不够...';
        seedEl.textContent = '🌰';
        resultEl.innerHTML = '<div class="result-hint">💡 还缺少：' + missing.join('、') + '</div>';
        speak('种子萌发需要水分、适宜的温度和空气，还缺少' + missing.join('、'));
    }
}

function createOrganMatchGame() {
    const items = [
        { term: '把植物固定在土里', answer: '根', icon: '🌿' },
        { term: '运输水分和营养', answer: '茎', icon: '🎋' },
        { term: '吸收阳光制造食物', answer: '叶', icon: '🍃' },
        { term: '吸引昆虫帮助繁殖', answer: '花', icon: '🌺' },
        { term: '保护里面的种子', answer: '果实', icon: '🍎' }
    ];
    
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    
    return `
        <h3>🌿 植物器官识别</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">点击功能，再点击对应器官</p>
        <div class="match-game">
            <div class="match-terms">
                ${items.map((item, i) => `
                    <div class="term-item" onclick="selectTerm(this, '${item.answer}')">
                        <span class="term-icon">${item.icon}</span>
                        <span class="term-text">${item.term}</span>
                    </div>
                `).join('')}
            </div>
            <div class="match-slots">
                ${shuffled.map((item, i) => `
                    <div class="slot-item" data-correct="${item.answer}">
                        <span class="slot-answer">${item.answer}</span>
                        <div class="drop-zone" onclick="selectSlot(this, '${item.answer}')"></div>
                    </div>
                `).join('')}
            </div>
        </div>
        <button class="check-btn" onclick="checkOrganMatch()">检查答案</button>
        <div class="match-result" id="matchResult"></div>
    `;
}

let selectedTerm = null;

function selectTerm(el, answer) {
    document.querySelectorAll('.term-item').forEach(t => t.style.background = '');
    el.style.background = 'var(--accent-green)';
    selectedTerm = answer;
}

function selectSlot(el, answer) {
    if (!selectedTerm) return;
    el.innerHTML = '<span style="color: var(--accent-green); font-weight: bold;">' + selectedTerm + '</span>';
    el.dataset.selected = selectedTerm;
    selectedTerm = null;
}

function checkOrganMatch() {
    let correct = 0;
    document.querySelectorAll('.slot-item').forEach(slot => {
        const correct_ans = slot.dataset.correct;
        const selected = slot.querySelector('.drop-zone').dataset.selected;
        if (selected === correct_ans) {
            correct++;
            slot.style.borderColor = 'var(--accent-green)';
        } else {
            slot.style.borderColor = 'var(--accent-red)';
        }
    });
    
    showToast('🎉 正确 ' + correct + '/5！');
    addXP(BIO_DATA.game.xpRewards.completeExperiment, '完成器官匹配实验');
    recordKnowledgeView('experiment', 'organ-match');
    gameState.experimentsCompleted.push('organ-match');
    checkBadges();
    updateProgressUI();
}

function createAnimalQuizGame() {
    const questions = [
        { q: '蝴蝶有几条腿？', options: ['4条', '6条', '8条', '0条'], answer: 1 },
        { q: '青蛙是卵生还是胎生？', options: ['胎生', '卵生', '都不是'], answer: 1 },
        { q: '以下哪个不是昆虫？', options: ['蚂蚁', '蜜蜂', '蜘蛛', '蝗虫'], answer: 2 },
        { q: '鱼用什么呼吸？', options: ['肺', '鳃', '皮肤', '气管'], answer: 1 },
        { q: '蚯蚓靠什么呼吸？', options: ['肺', '鳃', '湿润体表', '气管'], answer: 2 }
    ];
    
    return `
        <h3>🐛 动物分类挑战</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">共${questions.length}道题，选择正确答案</p>
        ${questions.map((q, i) => `
            <div class="quiz-question">
                <p class="quiz-q"><strong>${i + 1}. ${q.q}</strong></p>
                <div class="quiz-options">
                    ${q.options.map((opt, j) => `
                        <label class="quiz-option">
                            <input type="radio" name="q${i}" value="${j}">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('')}
        <button class="check-btn" onclick="checkAnimalQuiz()">提交答案</button>
        <div class="quiz-result" id="quizResult"></div>
    `;
}

function checkAnimalQuiz() {
    showToast('🎉 实验完成！');
    addXP(BIO_DATA.game.xpRewards.completeExperiment, '完成动物分类实验');
    recordKnowledgeView('experiment', 'animal-quiz');
    gameState.experimentsCompleted.push('animal-quiz');
    checkBadges();
    updateProgressUI();
}

function createCellBuildGame() {
    return `
        <h3>🔬 细胞结构搭建</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">点击认识植物细胞的结构</p>
        <div class="experiment-steps">
            <div class="exp-step" onclick="showExpDetail('cell-wall')">
                <div class="step-num">1</div>
                <div class="step-content">
                    <h4>细胞壁</h4>
                    <p>植物细胞独有，由纤维素组成，支持和保护细胞</p>
                </div>
            </div>
            <div class="exp-step" onclick="showExpDetail('chloroplast')">
                <div class="step-num">2</div>
                <div class="step-content">
                    <h4>叶绿体</h4>
                    <p>植物细胞独有，进行光合作用，制造有机物</p>
                </div>
            </div>
            <div class="exp-step" onclick="showExpDetail('vacuole')">
                <div class="step-num">3</div>
                <div class="step-content">
                    <h4>大液泡</h4>
                    <p>植物细胞独有，占据细胞大部分体积，储存营养</p>
                </div>
            </div>
        </div>
    `;
}

function showExpDetail(type) {
    const details = {
        'cell-wall': '细胞壁由纤维素组成，是植物细胞特有的结构，负责支持和保护细胞。',
        'chloroplast': '叶绿体是植物细胞进行光合作用的场所，能将光能转化为化学能。',
        'vacuole': '大液泡是植物细胞储存水分和营养的场所，还能维持细胞形态。'
    };
    speak(details[type] || '');
    recordKnowledgeView('cell', type);
}

function createEcosystemChainGame() {
    return `
        <h3>🌍 生态链构建</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">了解生态系统的组成</p>
        <div class="experiment-steps">
            <div class="exp-step" onclick="showEcoDetail('producer')">
                <div class="step-num">🌿</div>
                <div class="step-content">
                    <h4>生产者</h4>
                    <p>绿色植物，通过光合作用制造有机物，是生态系统的能量来源</p>
                </div>
            </div>
            <div class="exp-step" onclick="showEcoDetail('consumer')">
                <div class="step-num">🐰</div>
                <div class="step-content">
                    <h4>消费者</h4>
                    <p>动物，直接或间接以植物为食，传递能量</p>
                </div>
            </div>
            <div class="exp-step" onclick="showEcoDetail('decomposer')">
                <div class="step-num">🦠</div>
                <div class="step-content">
                    <h4>分解者</h4>
                    <p>细菌、真菌，分解动植物遗体，回归土壤</p>
                </div>
            </div>
        </div>
    `;
}

function showEcoDetail(type) {
    const details = {
        producer: '生产者主要是绿色植物，它们通过光合作用将太阳能转化为化学能，是生态系统中所有能量的最终来源。',
        consumer: '消费者是动物，它们不能自己制造有机物，需要吃植物或其他动物来获取能量和营养。',
        decomposer: '分解者主要是细菌和真菌，它们分解动植物的遗体和粪便，将有机物分解为无机物，回归土壤。'
    };
    speak(details[type] || '');
    recordKnowledgeView('experiment', 'eco-chain');
}

function createBodySystemGame() {
    return `
        <h3>🧍 人体系统配对</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">了解人体各大系统的协作</p>
        <div class="experiment-steps">
            <div class="exp-step" onclick="showBodySystem('digestive')">
                <div class="step-num">🍽️</div>
                <div class="step-content">
                    <h4>消化系统</h4>
                    <p>口腔、食道、胃、肠等，消化食物吸收营养</p>
                </div>
            </div>
            <div class="exp-step" onclick="showBodySystem('respiratory')">
                <div class="step-num">🫁</div>
                <div class="step-content">
                    <h4>呼吸系统</h4>
                    <p>鼻、喉、气管、肺等，进行气体交换</p>
                </div>
            </div>
            <div class="exp-step" onclick="showBodySystem('circulatory')">
                <div class="step-num">❤️</div>
                <div class="step-content">
                    <h4>循环系统</h4>
                    <p>心脏、血管、血液，运输营养和废物</p>
                </div>
            </div>
        </div>
    `;
}

function showBodySystem(type) {
    const details = {
        digestive: '消化系统负责将食物分解成身体可以吸收的营养物质，包括物理消化和化学消化两个过程。',
        respiratory: '呼吸系统负责气体交换，吸入氧气、排出二氧化碳，维持身体新陈代谢。',
        circulatory: '循环系统由心脏、血管和血液组成，负责运输氧气、营养物质和废物到全身各处。'
    };
    speak(details[type] || '');
    recordKnowledgeView('experiment', 'body-system');
}

function createPhotosynthesisGame() {
    return `
        <h3>☀️ 光合作用实验</h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">点击步骤了解实验过程</p>
        <div class="experiment-steps">
            <div class="exp-step" onclick="showPhotoDetail(1)">
                <div class="step-num">1</div>
                <div class="step-content">
                    <h4>准备实验</h4>
                    <p>准备两株相同的植物</p>
                </div>
            </div>
            <div class="exp-step" onclick="showPhotoDetail(2)">
                <div class="step-num">2</div>
                <div class="step-content">
                    <h4>设置对照</h4>
                    <p>一株放阳光下，一株放黑暗处</p>
                </div>
            </div>
            <div class="exp-step" onclick="showPhotoDetail(3)">
                <div class="step-num">3</div>
                <div class="step-content">
                    <h4>观察结果</h4>
                    <p>阳光下植物叶片绿色，黑暗中发黄</p>
                </div>
            </div>
            <div class="exp-step" onclick="showPhotoDetail(4)">
                <div class="step-num">4</div>
                <div class="step-content">
                    <h4>得出结论</h4>
                    <p>光合作用需要阳光</p>
                </div>
            </div>
        </div>
        <div class="exp-formula">
            <h4>📝 光合作用公式</h4>
            <div class="formula-box">
                二氧化碳 + 水 → 氧气 + 养料<br>
                <span style="font-size: 0.9rem; color: var(--accent-green);">(需要阳光和叶绿体)</span>
            </div>
        </div>
    `;
}

function showPhotoDetail(step) {
    const details = {
        1: '选择两株生长状况相同、大小相近的植物，确保实验变量唯一。',
        2: '形成对照实验，唯一变量是光照条件。',
        3: '几天后观察，阳光下的植物叶片保持绿色，黑暗中的植物叶片变黄。',
        4: '结论：光是光合作用不可缺少的条件。'
    };
    speak('步骤' + step + '：' + details[step]);
    recordKnowledgeView('experiment', 'photo_' + step);
}

// ===== 游戏化系统 =====
function addXP(amount, reason) {
    gameState.xp += amount;
    updateGameUI();
    saveGameState();
    showXPGain(amount);
    checkLevelUp();
}

function showXPGain(amount) {
    const el = document.createElement('div');
    el.className = 'xp-gain';
    el.textContent = '+' + amount + ' XP';
    el.style.cssText = 'position:fixed;left:50%;top:100px;transform:translateX(-50%);background:var(--accent-green);color:white;padding:10px 20px;border-radius:20px;font-weight:bold;z-index:9999;animation:xpFloat 1s ease forwards;';
    document.body.appendChild(el);
    
    const style = document.createElement('style');
    style.textContent = '@keyframes xpFloat{0%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-50px)}}';
    document.head.appendChild(style);
    
    setTimeout(() => el.remove(), 1000);
}

function updateGameUI() {
    const levels = BIO_DATA.game.levels;
    let currentLevel = 0;
    
    for (let i = levels.length - 1; i >= 0; i--) {
        if (gameState.xp >= levels[i].minXP) {
            currentLevel = i;
            break;
        }
    }
    
    const currentLevelData = levels[currentLevel];
    const nextLevelData = levels[currentLevel + 1] || levels[currentLevel];
    
    const xpInLevel = gameState.xp - currentLevelData.minXP;
    const xpNeeded = (nextLevelData?.minXP || currentLevelData.minXP) - currentLevelData.minXP;
    const progress = Math.min(100, (xpInLevel / xpNeeded) * 100);
    
    const xpFill = document.getElementById('xpFill');
    const xpText = document.getElementById('xpText');
    const levelIcon = document.getElementById('levelIcon');
    
    if (xpFill) xpFill.style.width = progress + '%';
    if (xpText) xpText.textContent = gameState.xp + ' XP';
    if (levelIcon) levelIcon.textContent = currentLevelData.icon;
    
    const badgeCount = document.getElementById('badgeCount');
    if (badgeCount) badgeCount.textContent = gameState.badges.length;
    
    const statKnowledge = document.getElementById('statKnowledge');
    const statExperiments = document.getElementById('statExperiments');
    const statBadges = document.getElementById('statBadges');
    const statLevel = document.getElementById('statLevel');
    
    if (statKnowledge) statKnowledge.textContent = gameState.knowledgeViewed.size;
    if (statExperiments) statExperiments.textContent = gameState.experimentsCompleted.length;
    if (statBadges) statBadges.textContent = gameState.badges.length;
    if (statLevel) statLevel.textContent = currentLevelData.name;
    
    gameState.level = currentLevel;
}

function checkLevelUp() {
    const levels = BIO_DATA.game.levels;
    const oldLevel = gameState.level;
    
    for (let i = levels.length - 1; i >= 0; i--) {
        if (gameState.xp >= levels[i].minXP) {
            if (i > oldLevel) {
                showLevelUp(levels[i]);
            }
            break;
        }
    }
}

function showLevelUp(levelData) {
    const modal = document.createElement('div');
    modal.className = 'level-up-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:9999;';
    modal.innerHTML = '<div style="font-size:5rem;margin-bottom:20px;">' + levelData.icon + '</div>' +
        '<h2 style="color:white;font-size:2rem;margin-bottom:10px;">等级提升！</h2>' +
        '<p style="color:white;font-size:1.5rem;">恭喜你升为：' + levelData.name + '</p>' +
        '<button onclick="this.parentElement.remove()" style="margin-top:30px;padding:15px 40px;font-size:1.2rem;background:var(--accent-green);color:white;border:none;border-radius:30px;cursor:pointer;">太棒了！</button>';
    document.body.appendChild(modal);
}

function checkBadges() {
    if (gameState.knowledgeViewed.has('plant_root') && 
        gameState.knowledgeViewed.has('plant_stem') && 
        gameState.knowledgeViewed.has('plant_leaf')) {
        earnBadge('plant-explorer');
    }
    if (gameState.experimentsCompleted.length >= 6) {
        earnBadge('science-champion');
    }
}

function earnBadge(badgeId) {
    if (gameState.badges.includes(badgeId)) return;
    
    const badge = BIO_DATA.game.badges.find(b => b.id === badgeId);
    if (!badge) return;
    
    gameState.badges.push(badgeId);
    saveGameState();
    
    const el = document.getElementById('badgeEarned');
    const earnedIcon = document.getElementById('earnedIcon');
    const earnedName = document.getElementById('earnedName');
    
    if (earnedIcon) earnedIcon.textContent = badge.icon;
    if (earnedName) earnedName.textContent = '获得：' + badge.name;
    if (el) el.style.display = 'block';
    
    setTimeout(() => {
        if (el) el.style.display = 'none';
    }, 3000);
    
    updateGameUI();
}

function toggleBadges() {
    const modal = document.getElementById('badgesModal');
    modal.classList.toggle('show');
    if (modal.classList.contains('show')) {
        renderBadges();
    }
}

function renderBadges() {
    const grid = document.getElementById('badgesGrid');
    const badges = BIO_DATA.game.badges;
    
    grid.innerHTML = badges.map(badge => {
        const earned = gameState.badges.includes(badge.id);
        return '<div class="badge-item ' + (earned ? 'earned' : 'locked') + '">' +
            '<span class="badge-icon">' + badge.icon + '</span>' +
            '<span class="badge-name">' + badge.name + '</span>' +
            '<span class="badge-req">' + (earned ? '已获得' : badge.requirement) + '</span>' +
            '</div>';
    }).join('');
}

function toggleAudio() {
    const isSpeaking = window.speechSynthesis && window.speechSynthesis.speaking;
    
    if (isSpeaking) {
        // 正在朗读，点击则暂停
        window.speechSynthesis.cancel();
        gameState.isAudioPaused = true;
    } else {
        // 未在朗读，切换全局语音开关
        gameState.isAudioPaused = false;
        gameState.audioEnabled = !gameState.audioEnabled;
    }
    
    updateAudioButtonState();
    saveGameState();
}

function updateAudioButtonState() {
    const btn = document.getElementById('audioBtn');
    if (!btn) return;
    
    const isSpeaking = window.speechSynthesis && window.speechSynthesis.speaking;
    
    // 清除旧状态类
    btn.classList.remove('playing', 'paused', 'muted');
    
    if (isSpeaking) {
        btn.textContent = '⏸️';
        btn.title = '点击暂停朗读';
        btn.classList.add('playing');
    } else if (gameState.isAudioPaused) {
        btn.textContent = '▶️';
        btn.title = '已暂停，继续朗读请去点击内容';
        btn.classList.add('paused');
    } else if (!gameState.audioEnabled) {
        btn.textContent = '🔇';
        btn.title = '朗读已关闭';
        btn.classList.add('muted');
    } else {
        btn.textContent = '🔊';
        btn.title = '朗读已开启';
    }
}

function showToast(message, icon) {
    icon = icon || '💡';
    const toast = document.createElement('div');
    toast.className = 'progress-toast';
    toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:var(--bg-card);color:var(--text-primary);padding:12px 24px;border-radius:30px;box-shadow:var(--shadow);z-index:9999;display:flex;align-items:center;gap:10px;animation:toastIn 0.3s ease;';
    toast.innerHTML = '<span>' + icon + '</span><span>' + message + '</span>';
    document.body.appendChild(toast);
    
    const style = document.createElement('style');
    style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}';
    document.head.appendChild(style);
    
    setTimeout(() => {
        toast.style.animation = 'toastIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initVocabulary() {
    document.querySelectorAll('.plant-part, .insect-part, .fish-part, .organelle-item, .sense-card, .movement-card, .digest-step, .resp-part, .vessel, .eco-circle, .hv-card, .silk-stage, .mollusk-card, .timeline-item').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('mouseenter', () => {
            el.style.transform = (el.style.transform || '') + ' scale(1.05)';
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = el.style.transform.replace(' scale(1.05)', '');
        });
    });
}
