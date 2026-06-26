// ===== 生物知识可视化平台 - 游戏系统 =====

// ===== 游戏数据 (内嵌) ====="
// 使用 data.js 中的 BIO_DATA

// ===== 经验值与等级系统 =====

// 等级定义
const LEVELS = [
    { name: '生物学徒', minXP: 0, icon: '🌱' },
    { name: '知识探索者', minXP: 50, icon: '📚' },
    { name: '科学小达人', minXP: 150, icon: '🔬' },
    { name: '生物研究员', minXP: 300, icon: '🧪' },
    { name: '自然观察家', minXP: 500, icon: '🦋' },
    { name: '科学探险家', minXP: 800, icon: '🌍' },
    { name: '生物学霸', minXP: 1200, icon: '🏆' },
    { name: '科学大师', minXP: 1800, icon: '👑' }
];

// 徽章定义
const BADGES = [
    { id: 'first-explore', name: '初探者', icon: '🔍', requirement: '探索任意板块' },
    { id: 'plant-explorer', name: '植物探索家', icon: '🌿', requirement: '学习根茎叶知识' },
    { id: 'animal-friend', name: '动物之友', icon: '🐾', requirement: '学习昆虫和鱼类' },
    { id: 'body-explorer', name: '人体探险家', icon: '🧬', requirement: '探索五大感官' },
    { id: 'cell-scientist', name: '细胞科学家', icon: '🔬', requirement: '对比动植物细胞' },
    { id: 'eco-guardian', name: '生态守护者', icon: '🌍', requirement: '了解生态系统' },
    { id: 'science-champion', name: '科学冠军', icon: '🏆', requirement: '完成所有实验' },
    { id: 'science-master', name: '科学大师', icon: '👑', requirement: '达到最高等级' }
];

// XP奖励
const XP_REWARDS = {
    exploreSection: 5,
    readKnowledge: 10,
    completeExperiment: 20,
    quizCorrect: 5,
    watchVideo: 15,
    dailyLogin: 5
};

// ===== 拖拽排序功能 =====

// 拖拽开始
function handleDragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.innerHTML);
    e.dataTransfer.setData('text/html', e.target.outerHTML);
}

// 拖拽结束
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

// 放置区域进入
function handleDragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

// 放置区域离开
function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

// 放置
function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const dragging = document.querySelector('.dragging');
    if (dragging && e.target.classList.contains('drop-zone')) {
        // 清空drop zone并放入内容
        e.target.innerHTML = dragging.innerHTML;
        e.target.classList.add('filled');
        
        // 播放成功音效
        playSound('drop');
    }
}

// 初始化拖拽
function initDragAndDrop() {
    const draggables = document.querySelectorAll('[draggable="true"]');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    draggables.forEach(el => {
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragend', handleDragEnd);
    });
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

// ===== 音效系统 (可选) =====

const SOUNDS = {
    correct: '🔔',
    wrong: '❌',
    click: '👆',
    drop: '💫',
    levelup: '🎉',
    badge: '🏅'
};

function playSound(type) {
    // 简单的视觉反馈替代音效
    const el = document.createElement('div');
    el.textContent = SOUNDS[type] || '👆';
    el.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        font-size: 3rem;
        pointer-events: none;
        animation: soundPop 0.5s ease forwards;
        z-index: 9999;
    `;
    document.body.appendChild(el);
    
    setTimeout(() => el.remove(), 500);
}

// ===== 游戏统计追踪 =====

function trackProgress(category, action, label) {
    // 可扩展为发送到分析服务
    console.log(`[Progress] ${category} - ${action}: ${label}`);
    
    // 更新本地统计
    updateLocalStats(category, action);
}

function updateLocalStats(category, action) {
    const stats = JSON.parse(localStorage.getItem('bioLearnStats') || '{}');
    
    if (!stats[category]) stats[category] = {};
    stats[category][action] = (stats[category][action] || 0) + 1;
    
    localStorage.setItem('bioLearnStats', JSON.stringify(stats));
}

// ===== 每日任务系统 =====

function getDailyQuests() {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('bioLearnLastLogin');
    
    if (lastLogin !== today) {
        // 新的一天，重置任务
        localStorage.setItem('bioLearnLastLogin', today);
        localStorage.setItem('bioLearnDailyQuests', JSON.stringify({
            quests: [
                { id: 'explore-3', desc: '探索3个不同板块', target: 3, progress: 0, reward: 20 },
                { id: 'complete-exp', desc: '完成1个实验', target: 1, progress: 0, reward: 30 },
                { id: 'learn-5', desc: '学习5个知识点', target: 5, progress: 0, reward: 25 }
            ],
            date: today
        }));
    }
    
    return JSON.parse(localStorage.getItem('bioLearnDailyQuests') || '{}');
}

function updateDailyQuest(questId) {
    const dailyData = getDailyQuests();
    const quest = dailyData.quests?.find(q => q.id === questId);
    
    if (quest && quest.progress < quest.target) {
        quest.progress++;
        localStorage.setItem('bioLearnDailyQuests', JSON.stringify(dailyData));
        
        if (quest.progress >= quest.target) {
            addXP(quest.reward, `完成每日任务：${quest.desc}`);
            showToast(`🎉 每日任务完成！获得${quest.reward}XP`);
        }
    }
}

// ===== 游戏模式切换 =====

let gameMode = 'normal'; // normal | challenge | relax

function setGameMode(mode) {
    gameMode = mode;
    
    switch(mode) {
        case 'challenge':
            document.body.classList.add('challenge-mode');
            document.body.classList.remove('relax-mode');
            break;
        case 'relax':
            document.body.classList.add('relax-mode');
            document.body.classList.remove('challenge-mode');
            break;
        default:
            document.body.classList.remove('challenge-mode', 'relax-mode');
    }
    
    localStorage.setItem('bioLearnGameMode', mode);
}

// ===== 书签与收藏 =====

function bookmarkKnowledge(knowledgeId) {
    const bookmarks = JSON.parse(localStorage.getItem('bioLearnBookmarks') || '[]');
    
    if (!bookmarks.includes(knowledgeId)) {
        bookmarks.push(knowledgeId);
        localStorage.setItem('bioLearnBookmarks', JSON.stringify(bookmarks));
        showToast('已添加到收藏夹 📌');
    } else {
        showToast('已经在收藏夹中了');
    }
}

// ===== 学习路径追踪 =====

function recordLearningPath(section, subsection, item) {
    const path = JSON.parse(localStorage.getItem('bioLearnPath') || '[]');
    
    path.push({
        section,
        subsection,
        item,
        timestamp: Date.now()
    });
    
    // 保持最近100条记录
    if (path.length > 100) {
        path.shift();
    }
    
    localStorage.setItem('bioLearnPath', JSON.stringify(path));
}

// ===== 成就通知 =====

function showAchievementNotification(title, desc, icon = '🏆') {
    const notification = document.createElement('div');
    notification.className = 'ingame-achievement';
    notification.innerHTML = `
        <span class="ach-badge">${icon}</span>
        <div class="ach-info">
            <h4>${title}</h4>
            <p>${desc}</p>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'dropDown 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// ===== 键盘快捷键 =====

document.addEventListener('keydown', (e) => {
    // Alt + 数字 快速切换板块
    if (e.altKey && e.key >= '1' && e.key <= '6') {
        const sections = ['home', 'plant', 'animal', 'human', 'cell', 'lifescience'];
        const index = parseInt(e.key) - 1;
        if (sections[index]) {
            switchSection(sections[index]);
        }
    }
    
    // Alt + E 快速进入实验
    if (e.altKey && e.key.toLowerCase() === 'e') {
        switchSection('experiment');
    }
    
    // Space 停止/开始朗读
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
        } else if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    }
});

// ===== 初始化 =====

document.addEventListener('DOMContentLoaded', () => {
    // 初始化拖拽
    initDragAndDrop();
    
    // 加载游戏模式
    const savedMode = localStorage.getItem('bioLearnGameMode');
    if (savedMode) {
        setGameMode(savedMode);
    }
    
    // 显示欢迎提示
    setTimeout(() => {
        if (!localStorage.getItem('bioLearnWelcomed')) {
            showToast('👋 欢迎来到生物知识可视化平台！');
            localStorage.setItem('bioLearnWelcomed', 'true');
        }
    }, 1000);
});

// ===== CSS动画补充 =====

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes soundPop {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    .dragging {
        opacity: 0.5;
        transform: scale(0.9);
    }
    
    .drag-over {
        background: rgba(34, 197, 94, 0.2);
        border: 2px dashed var(--accent-green);
    }
    
    .filled {
        background: rgba(34, 197, 94, 0.3);
        border: 2px solid var(--accent-green);
    }
    
    /* 游戏模式样式 */
    body.challenge-mode {
        --accent-green: #ef4444;
    }
    
    body.relax-mode {
        filter: saturate(0.8);
    }
    
    /* 匹配游戏样式 */
    .match-game {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin: 20px 0;
    }
    
    .match-terms, .match-slots {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .term-item, .slot-item {
        background: var(--bg-hover);
        padding: 15px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .term-item:hover, .slot-item:hover {
        background: rgba(34, 197, 94, 0.2);
    }
    
    .term-icon {
        font-size: 1.5rem;
    }
    
    .drop-zone {
        flex: 1;
        min-height: 40px;
        border: 2px dashed var(--border-color);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
    }
    
    .check-btn {
        background: linear-gradient(135deg, var(--accent-green), #16a34a);
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
        margin-top: 20px;
        transition: all 0.3s;
    }
    
    .check-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 5px 20px rgba(34, 197, 94, 0.4);
    }
    
    /* 测验样式 */
    .quiz-question {
        background: var(--bg-card);
        padding: 20px;
        border-radius: 12px;
        margin-bottom: 15px;
    }
    
    .quiz-q {
        margin-bottom: 15px;
    }
    
    .quiz-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 10px;
    }
    
    .quiz-option {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--bg-hover);
        padding: 10px 15px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .quiz-option:hover {
        background: rgba(34, 197, 94, 0.2);
    }
    
    .quiz-option input {
        accent-color: var(--accent-green);
    }
    
    /* 实验步骤样式 */
    .experiment-steps {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin-bottom: 20px;
    }
    
    .exp-step {
        display: flex;
        gap: 15px;
        align-items: center;
        background: var(--bg-hover);
        padding: 15px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .exp-step:hover {
        background: rgba(34, 197, 94, 0.2);
    }
    
    .step-num {
        width: 40px;
        height: 40px;
        background: var(--accent-green);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }
    
    .step-content h4 {
        margin-bottom: 5px;
    }
    
    .step-content p {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .exp-formula {
        background: var(--bg-card);
        padding: 20px;
        border-radius: 12px;
    }
    
    .formula-box {
        background: var(--bg-hover);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        margin-top: 10px;
        font-size: 1.1rem;
    }
    
    /* 细胞搭建区域 */
    .cell-build-area {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin: 20px 0;
    }
    
    .cell-target {
        background: var(--bg-hover);
        padding: 30px;
        border-radius: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .target-cell {
        width: 200px;
        height: 200px;
    }
    
    .structure-bank {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .struct-item {
        background: var(--accent-green);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        cursor: grab;
        transition: all 0.3s;
    }
    
    .struct-item:hover {
        transform: scale(1.1);
    }
    
    /* 生态链构建 */
    .chain-builder {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin: 20px 0;
    }
    
    .chain-slots {
        display: flex;
        gap: 15px;
        justify-content: center;
    }
    
    .chain-slot {
        width: 100px;
        height: 80px;
        background: var(--bg-hover);
        border: 2px dashed var(--border-color);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    
    .slot-num {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--accent-cyan);
        color: white;
        padding: 2px 10px;
        border-radius: 10px;
        font-size: 0.8rem;
    }
    
    .chain-items {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .chain-item {
        background: var(--bg-card);
        padding: 15px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: grab;
        border: 2px solid var(--border-color);
        transition: all 0.3s;
    }
    
    .chain-item:hover {
        border-color: var(--accent-green);
    }
    
    .chain-icon {
        font-size: 1.5rem;
    }
    
    /* 人体系统配对 */
    .system-match {
        display: grid;
        grid-template-columns: 1fr 50px 1fr;
        gap: 20px;
        margin: 20px 0;
    }
    
    .match-column {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .match-item {
        background: var(--bg-hover);
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .match-item:hover {
        background: rgba(34, 197, 94, 0.2);
    }
    
    .match-lines {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    
    .match-line {
        height: 60px;
        border-left: 2px dashed var(--border-color);
    }
    
    /* 结果区域 */
    .match-result, .quiz-result, .build-result, .chain-result, .system-result {
        margin-top: 20px;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
    }
    
    @media (max-width: 768px) {
        .match-game {
            grid-template-columns: 1fr;
        }
        
        .cell-build-area {
            grid-template-columns: 1fr;
        }
        
        .system-match {
            grid-template-columns: 1fr;
        }
        
        .match-lines {
            display: none;
        }
    }
`;
document.head.appendChild(styleSheet);

// ===== 导出游戏状态（用于调试）=====
window.BioGame = {
    getState: () => ({ ...gameState }),
    reset: () => {
        localStorage.clear();
        location.reload();
    },
    addXP: addXP,
    speak: speak
};
