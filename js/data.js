// ===== 生物知识可视化平台 - 完整知识点数据库 =====
// 基于教科版小学科学1-6年级生物全知识点知识库

const BIO_DATA = {
    // ====== 植物世界 ======
    plant: {
        title: "🌱 植物世界",
        subtitle: "探索植物的奥秘",
        sections: {
            "whole-plant": {
                name: "完整开花植株",
                icon: "🌸",
                intro: "植物由根、茎、叶、花、果实五大器官组成，每个部分都有独特的功能。",
                hotspots: [
                    {
                        id: "root",
                        name: "根",
                        icon: "🌿",
                        x: 50, y: 75,
                        facts: [
                            "【固定作用】固定整株植物，防止倒伏",
                            "【吸收作用】吸收土壤中的水分、矿物质养料",
                            "【向地性】根会往地下生长",
                            "【向水性】根会朝着有水的方向生长",
                            "【直根】一根粗壮主根，侧根细小，例：桃树",
                            "【须根】无粗主根，大量细根丛生，例：水稻、小麦"
                        ],
                        grades: {
                            low: "根长在泥土里，给植物输送水分",
                            mid: "区分直根与须根，掌握根的两大功能",
                            high: "设计对比实验验证根的向水、向地特性"
                        }
                    },
                    {
                        id: "stem",
                        name: "茎",
                        icon: "🎋",
                        x: 50, y: 55,
                        facts: [
                            "【支撑作用】托起叶片、花朵、果实",
                            "【运输通道】向上输送根部吸收的水，向下输送叶片制造的营养",
                            "【直立茎】笔直向上生长，例：向日葵",
                            "【缠绕茎】缠绕其他物体生长，例：牵牛花",
                            "【匍匐茎】贴着地面蔓延，例：红薯",
                            "【变态储存茎】膨大储存养分，例：土豆"
                        ],
                        grades: {
                            low: "茎连接根和叶子，支撑植株",
                            mid: "分清不同茎的外形，熟记运输功能",
                            high: "对比不同环境植物茎的形态差异"
                        }
                    },
                    {
                        id: "leaf",
                        name: "叶片",
                        icon: "🍃",
                        x: 25, y: 40,
                        facts: [
                            "【叶片结构】叶片主体、叶柄、叶脉",
                            "【叶脉】负责输送水分营养，支撑叶片",
                            "【光合作用】二氧化碳+水 → 养料+氧气（需要阳光）",
                            "【蒸腾作用】排出多余水分，调节温度",
                            "【生长变化】嫩叶→成熟绿叶→秋季变黄→脱落腐烂",
                            "【向光性】植物会朝向光源生长"
                        ],
                        grades: {
                            low: "叶子是绿色的，能吸收阳光",
                            mid: "掌握叶片结构、光合作用、蒸腾作用",
                            high: "设计光照对比实验，观察叶片生长变化"
                        }
                    },
                    {
                        id: "flower",
                        name: "花",
                        icon: "🌺",
                        x: 75, y: 35,
                        facts: [
                            "【萼片】花苞外层，保护未开放的花朵",
                            "【花瓣】鲜艳色彩吸引昆虫前来传粉",
                            "【雄蕊】产生花粉",
                            "【雌蕊】底部子房，受精后发育成果实",
                            "【自花传粉】同一朵花内部完成授粉",
                            "【异花传粉】依靠昆虫、风力传递花粉到另一朵花",
                            "【关键】没有完成受精，花朵无法长出果实"
                        ],
                        grades: {
                            low: "花有美丽的颜色，吸引昆虫",
                            mid: "认识花四大部分，了解传粉方式",
                            high: "观察并记录花的受精过程"
                        }
                    },
                    {
                        id: "fruit",
                        name: "果实与种子",
                        icon: "🍎",
                        x: 70, y: 65,
                        facts: [
                            "【果实作用】保护内部种子，为种子成熟提供营养",
                            "【弹力传播】果实成熟炸裂弹出种子，例：凤仙花、油菜",
                            "【动物传播】苍耳带刺粘皮毛，果肉吸引动物吞食后排种",
                            "【风力传播】蒲公英带绒毛，随风远距离飘散",
                            "【水力传播】莲蓬、椰子，外壳防水，随水流漂流"
                        ],
                        grades: {
                            low: "果实里面有种子",
                            mid: "认识四种种子传播方式",
                            high: "观察并收集不同植物的种子传播方式"
                        }
                    }
                ]
            },
            "seed-structure": {
                name: "种子结构剖面",
                icon: "🌰",
                intro: "种子虽小，却包含了未来植物的完整蓝图",
                hotspots: [
                    { id: "seed-coat", name: "种皮", icon: "🟤", facts: ["外层保护层", "防止内部胚受损"], x: 50, y: 15 },
                    { id: "cotyledon", name: "子叶", icon: "🥜", facts: ["储存种子发芽所需全部营养", "切除子叶会阻碍发芽"], x: 30, y: 50 },
                    { id: "plumule", name: "胚芽", icon: "🌱", facts: ["发育成植株的茎和叶片"], x: 50, y: 35 },
                    { id: "radicle", name: "胚根", icon: "📍", facts: ["种子萌发后最先长出", "发育为植物的根"], x: 50, y: 75 }
                ],
                germination: "种子萌发三要素：适宜温度 + 适量水分 + 充足空气（发芽阶段不需要阳光）"
            },
            "plant-classification": {
                name: "植物分类对比",
                icon: "🔍",
                comparisons: [
                    {
                        title: "直根 vs 须根",
                        items: [
                            { label: "直根", desc: "一根粗壮主根，侧根细小", examples: "凤仙花、桃树、萝卜" },
                            { label: "须根", desc: "无粗主根，大量细根丛生", examples: "水稻、小麦、葱" }
                        ]
                    },
                    {
                        title: "木本 vs 草本",
                        items: [
                            { label: "木本植物", desc: "茎坚硬木质化，多年生", examples: "樟树、梧桐、杨树" },
                            { label: "草本植物", desc: "茎柔软无木质，生命周期短", examples: "狗尾草、三叶草、水稻" }
                        ]
                    },
                    {
                        title: "陆生 vs 水生",
                        items: [
                            { label: "陆生植物", desc: "生长在泥土、石缝", examples: "杨树、蒲公英" },
                            { label: "浮水植物", desc: "水葫芦，叶柄膨大形成气囊漂浮", examples: "睡莲、荷叶" },
                            { label: "沉水植物", desc: "整株浸泡水下，根系退化", examples: "金鱼藻、苦草" }
                        ]
                    }
                ]
            },
            "lifecycle": {
                name: "植物生命周期",
                icon: "🔄",
                stages: [
                    { name: "播种", icon: "🌱", desc: "将种子埋入土壤" },
                    { name: "发芽", icon: "🌿", desc: "胚根突破种皮，向下生长" },
                    { name: "长高长叶", icon: "🌲", desc: "胚芽向上生长，抽出叶片" },
                    { name: "开花", icon: "🌸", desc: "花蕾绽放，吸引传粉" },
                    { name: "结果", icon: "🍎", desc: "花粉受精，子房发育成果实" },
                    { name: "产生新种子", icon: "🌰", desc: "果实成熟，种子散播" }
                ],
                seasons: "春季发芽 → 夏季繁茂 → 秋季落叶 → 冬季多数草本枯死"
            },
            "environment-adaptation": {
                name: "植物环境适应",
                icon: "🏜️",
                plants: [
                    {
                        name: "仙人掌",
                        habitat: "沙漠环境",
                        icon: "🌵",
                        adaptations: [
                            "叶片退化成尖刺，减少水分蒸发",
                            "肉质茎储存大量水分",
                            "根系发达，吸收深层地下水"
                        ]
                    },
                    {
                        name: "浮萍",
                        habitat: "浅水环境",
                        icon: "🌿",
                        adaptations: [
                            "叶片宽大，利于光合作用",
                            "根系短小，不需要深扎泥土",
                            "漂浮水面，获取充足阳光"
                        ]
                    },
                    {
                        name: "松树",
                        habitat: "寒冷山地",
                        icon: "🌲",
                        adaptations: [
                            "针状叶片，耐寒能力强",
                            "减少水分蒸腾",
                            "常绿，一年四季可光合作用"
                        ]
                    }
                ]
            },
            "flowering-plants": {
                name: "开花与不开花植物",
                icon: "⚘",
                categories: [
                    {
                        title: "开花植物",
                        desc: "依靠种子繁殖",
                        examples: "桃树、向日葵、水稻、菊花"
                    },
                    {
                        title: "不开花植物",
                        desc: "无花、无种子，依靠孢子繁殖",
                        examples: "苔藓、蕨类、藻类"
                    }
                ],
                note: "同种植物外形大体相似（遗传），花朵、叶片存在细微差别（变异），变异形成植物多样性"
            }
        }
    },

    // ====== 动物王国 ======
    animal: {
        title: "🐛 动物王国",
        subtitle: "探索动物的奇妙世界",
        sections: {
            "insect": {
                name: "昆虫结构图",
                icon: "🦋",
                intro: "昆虫是地球上种类最多的动物，它们有共同的特征",
                hotspots: [
                    { id: "insect-head", name: "头部", icon: "🤯", facts: ["1对触角，传递气味、交流信息", "有口器负责进食"], x: 50, y: 12 },
                    { id: "insect-thorax", name: "胸部", icon: "💪", facts: ["唯一长足的部位，共6条腿", "部分昆虫胸部会长翅膀"], x: 50, y: 40 },
                    { id: "insect-abdomen", name: "腹部", icon: "🍽️", facts: ["无足，包含消化、生殖器官"], x: 50, y: 75 },
                    { id: "insect-antenna", name: "触角", icon: "📡", facts: ["感知气味和环境信息", "不同昆虫触角形状不同"], x: 20, y: 15 },
                    { id: "insect-leg", name: "六足", icon: "🦵", facts: ["共6条腿，分布在胸部", "用于行走和跳跃"], x: 30, y: 55 }
                ],
                keyPoint: "【关键判定】同时满足「三段身体 + 六条腿」才是昆虫！",
                confusion: "【易错】蚯蚓、蜗牛身体不分头胸腹，不属于昆虫",
                examples: "蝴蝶、蜜蜂、蚂蚁、蝗虫、蜻蜓"
            },
            "fish": {
                name: "鱼类结构图",
                icon: "🐟",
                intro: "鱼类是水生动物的代表，它们终生生活在水里",
                hotspots: [
                    { id: "fish-gill", name: "鳃", icon: "💨", facts: ["呼吸器官，只能在水中提取氧气", "离水会窒息"], x: 60, y: 35 },
                    { id: "fish-fin", name: "鱼鳍", icon: "🔱", facts: ["胸鳍、背鳍、尾鳍", "控制平衡、游动方向"], x: 40, y: 50 },
                    { id: "fish-scale", name: "鳞片", icon: "🐟", facts: ["覆盖全身，保护肉体", "减少水中擦伤"], x: 50, y: 55 }
                ],
                features: [
                    "终生生活在水里",
                    "依靠鳃呼吸水中氧气",
                    "鱼鳍控制游动方向",
                    "全身鳞片保护身体",
                    "流线型身体减少水中阻力"
                ],
                survival: "卵生，无四肢，无肺"
            },
            "silkworm": {
                name: "蚕的一生",
                icon: "🐛",
                intro: "蚕是完全变态发育的典型代表",
                stages: [
                    {
                        name: "卵",
                        icon: "🥚",
                        desc: "蚕卵在适宜温度孵化",
                        detail: "蚕卵很小，颜色会随时间变化"
                    },
                    {
                        name: "幼虫",
                        icon: "🐛",
                        desc: "主食桑叶，多次蜕皮",
                        detail: "幼虫不断吃桑叶，身体逐渐长大，外皮无法跟随变大所以需要蜕皮"
                    },
                    {
                        name: "蛹",
                        icon: "🫧",
                        desc: "吐丝结茧，茧内转化",
                        detail: "幼虫成熟后吐丝结茧，茧内身体逐渐转化为蛹，蛹静止但内部器官重组"
                    },
                    {
                        name: "成虫",
                        icon: "🦋",
                        desc: "羽化为蚕蛾",
                        detail: "蛹羽化变为蚕蛾（成虫），成虫不吃食物，仅完成交配、产卵"
                    }
                ],
                concept: "【完全变态发育】卵、幼虫、蛹、成虫四阶段形态完全不同",
                term: "变态发育 = 形态发生巨大变化的发展过程"
            },
            "oviporous": {
                name: "卵生与胎生",
                icon: "🥚",
                intro: "动物繁殖方式的两大类型",
                categories: [
                    {
                        type: "卵生动物",
                        icon: "🥚",
                        examples: "蚕、鸡、鱼、青蛙、乌龟",
                        desc: "依靠卵孵化出新生命",
                        details: [
                            "卵壳保护胚胎",
                            "卵黄提供生长营养",
                            "受精卵在体外或体内发育成胚胎"
                        ]
                    },
                    {
                        type: "胎生动物",
                        icon: "🐱",
                        examples: "猫、狗、人类、牛、羊",
                        desc: "母体直接产下幼崽",
                        details: [
                            "依靠母乳哺育后代",
                            "胚胎在母体内发育",
                            "获得更好的保护和营养"
                        ]
                    }
                ]
            },
            "snail": {
                name: "蜗牛结构",
                icon: "🐌",
                intro: "蜗牛是软体动物的代表",
                hotspots: [
                    { id: "snail-shell", name: "外壳", icon: "🦪", facts: ["坚硬螺旋贝壳", "遇到危险完全缩进壳内", "保护柔软身体"], x: 50, y: 35 },
                    { id: "snail-antenna-long", name: "长触角", icon: "👆", facts: ["顶端有眼睛", "可以伸缩"], x: 35, y: 15 },
                    { id: "snail-antenna-short", name: "短触角", icon: "👃", facts: ["感知气味", "探路功能"], x: 55, y: 20 },
                    { id: "snail-foot", name: "腹足", icon: "🦶", facts: ["唯一运动器官", "爬行分泌黏液", "减少摩擦、防止受伤"], x: 50, y: 75 }
                ],
                features: [
                    "软体动物，外壳保护柔软身体",
                    "依靠腹足爬行，爬行留下黏液",
                    "喜爱阴暗潮湿环境",
                    "干燥时缩进壳休眠",
                    "主食菜叶"
                ],
                note: "【区分】身体不分头胸腹，无骨骼、无四肢、无鳃，不属于昆虫、鱼类"
            },
            "earthworm": {
                name: "蚯蚓结构",
                icon: "🪱",
                intro: "蚯蚓是环节动物的代表",
                structure: [
                    {
                        part: "身体结构",
                        icon: "🔗",
                        facts: ["全身由一圈圈相同体节连接而成", "无明显头、胸、腹划分"]
                    },
                    {
                        part: "体表呼吸",
                        icon: "💨",
                        facts: ["湿润表皮", "依靠体表完成气体交换", "干燥会无法呼吸死亡"]
                    },
                    {
                        part: "环带",
                        icon: "⭕",
                        facts: ["身体中间粗大段", "负责繁殖"]
                    }
                ],
                note: "【区分】没有足、触角、外壳、鳞片、鳃，和昆虫、鱼、蜗牛全部区分开",
                habitat: "生活在泥土，以腐烂落叶为食物，惧怕强光、干燥环境"
            },
            "ecosystem": {
                name: "生态群落",
                icon: "🌍",
                intro: "生态系统由生产者、消费者和分解者组成",
                roles: [
                    {
                        role: "生产者",
                        icon: "🌿",
                        color: "#22c55e",
                        examples: "全部绿色植物",
                        function: "光合作用制造养料、氧气",
                        detail: "植物是生态系统的能量来源，它们自己制造食物"
                    },
                    {
                        role: "消费者",
                        icon: "🦔",
                        color: "#f59e0b",
                        examples: "所有动物（兔子、狐狸、人等）",
                        function: "直接或间接食用植物获取能量",
                        detail: "动物不能自己制造食物，需要吃其他生物获取能量"
                    },
                    {
                        role: "分解者",
                        icon: "🦠",
                        color: "#8b5cf6",
                        examples: "细菌、真菌",
                        function: "分解动植物尸体，把养分归还土壤",
                        detail: "分解者将复杂有机物分解为简单无机物，循环利用"
                    }
                ],
                flow: "能量流动：太阳 → 植物 → 动物 → 分解者 → 土壤养分 → 植物"
            }
        }
    },

    // ====== 人体奥秘 ======
    human: {
        title: "🧍 人体奥秘",
        subtitle: "了解我们自己的身体",
        sections: {
            "five-senses": {
                name: "五官感知",
                icon: "👀",
                intro: "我们的五官帮助我们感知丰富多彩的世界",
                senses: [
                    {
                        organ: "眼睛",
                        icon: "👁️",
                        sense: "视觉",
                        function: "分辨物体形状、色彩、远近",
                        detail: "眼睛像一台精密的相机，捕捉光线，形成图像"
                    },
                    {
                        organ: "耳朵",
                        icon: "👂",
                        sense: "听觉",
                        function: "识别声音高低、大小、方向",
                        detail: "耳朵分为外耳、中耳、内耳，能捕捉声波并转化为神经信号"
                    },
                    {
                        organ: "鼻子",
                        icon: "👃",
                        sense: "嗅觉",
                        function: "分辨各类气味",
                        detail: "鼻腔内有嗅觉感受器，能识别数千种不同气味"
                    },
                    {
                        organ: "舌头",
                        icon: "👅",
                        sense: "味觉",
                        function: "分辨酸、甜、苦、咸",
                        detail: "舌头表面有味蕾，不同区域对不同味道敏感度不同"
                    },
                    {
                        organ: "皮肤",
                        icon: "✋",
                        sense: "触觉",
                        function: "感知冷热、软硬、疼痛、压力",
                        detail: "皮肤是人体最大的器官，也是重要的感觉器官"
                    }
                ]
            },
            "movement": {
                name: "运动系统",
                icon: "🏃",
                intro: "骨骼、关节和肌肉共同协作，让我们能够运动",
                components: [
                    {
                        name: "骨骼",
                        icon: "🦴",
                        function: "全身骨架，支撑整个身体",
                        details: [
                            "头骨保护大脑",
                            "胸廓保护心肺内脏",
                            "脊柱支撑身体直立"
                        ]
                    },
                    {
                        name: "关节",
                        icon: "🔗",
                        function: "骨骼连接部位，实现肢体弯曲活动",
                        details: [
                            "手肘、膝盖、手腕都是关节",
                            "关节内有滑液，减少摩擦",
                            "关节软骨缓冲震动"
                        ]
                    },
                    {
                        name: "肌肉",
                        icon: "💪",
                        function: "附着骨骼外侧，收缩变短拉动骨骼",
                        details: [
                            "肌肉收缩变短产生拉力",
                            "拉力拉动骨骼完成动作",
                            "跑、跳、抬手都靠肌肉"
                        ]
                    }
                ],
                process: "大脑发出指令 → 神经传递信号 → 肌肉收缩 → 拉动骨骼 → 完成动作"
            },
            "digestive": {
                name: "消化系统",
                icon: "🍽️",
                intro: "消化系统将食物转化为身体需要的营养",
                organs: [
                    { name: "口腔", icon: "👄", function: "牙齿切碎食物，唾液初步分解淀粉", x: 50, y: 10 },
                    { name: "食道", icon: "📍", function: "输送食物向下进入胃部", x: 50, y: 25 },
                    { name: "胃", icon: "👝", function: "肌肉蠕动研磨食物，胃液分解蛋白质", x: 50, y: 40 },
                    { name: "小肠", icon: "🔄", function: "人体最主要营养吸收场所，营养进入血液", x: 50, y: 60 },
                    { name: "大肠", icon: "🟤", function: "吸收食物残渣剩余水分，储存粪便", x: 50, y: 78 },
                    { name: "肛门", icon: "⚫", function: "排出食物残渣粪便", x: 50, y: 92 }
                ],
                key: "小肠是消化和吸收的主要场所"
            },
            "respiratory": {
                name: "呼吸系统",
                icon: "🫁",
                intro: "呼吸系统获取氧气，排出二氧化碳",
                organs: [
                    { name: "鼻咽喉", icon: "👃", function: "气体进出通道，温润、清洁空气" },
                    { name: "气管", icon: "📯", function: "输送空气到肺部，有纤毛清除灰尘" },
                    { name: "支气管", icon: "🌳", function: "分左右两支进入肺部" },
                    { name: "肺部", icon: "🎈", function: "气体交换核心器官，肺泡完成氧气和二氧化碳交换" }
                ],
                process: "吸气：外界空气 → 鼻 → 咽喉 → 气管 → 支气管 → 肺（氧气进入血液）",
                exhale: "呼气：体内二氧化碳 → 肺 → 支气管 → 气管 → 咽喉 → 鼻 → 外界"
            },
            "circulatory": {
                name: "循环系统",
                icon: "❤️",
                intro: "循环系统运输氧气和营养物质到全身",
                components: [
                    { name: "心脏", icon: "💓", function: "血液动力泵，持续收缩舒张推动血液流动" },
                    { name: "动脉", icon: "🔴", function: "输送富含氧气的血液到全身各处" },
                    { name: "静脉", icon: "🔵", function: "回收携带废物的血液回到心脏" },
                    { name: "毛细血管", icon: "🕸️", function: "连接动脉和静脉，完成氧气、营养、废物交换" }
                ],
                circulation: [
                    { name: "体循环", path: "左心室 → 主动脉 → 全身 → 上下腔静脉 → 右心房", result: "氧气输送至全身" },
                    { name: "肺循环", path: "右心室 → 肺动脉 → 肺部 → 肺静脉 → 左心房", result: "完成气体交换" }
                ]
            },
            "urinary": {
                name: "泌尿系统",
                icon: "💧",
                intro: "泌尿系统过滤血液，排出废物",
                organs: [
                    { name: "肾脏", icon: "🫘", function: "过滤血液多余水分、尿素，形成尿液" },
                    { name: "输尿管", icon: "📍", function: "输送尿液从肾脏到膀胱" },
                    { name: "膀胱", icon: "🎈", function: "临时储存尿液" },
                    { name: "尿道", icon: "🚿", function: "排出尿液到体外" }
                ],
                process: "肾脏产生尿液 → 输尿管输送 → 膀胱储存 → 尿道排出"
            },
            "nervous": {
                name: "神经系统",
                icon: "🧠",
                intro: "神经系统控制身体的一切活动",
                components: [
                    { name: "大脑", icon: "🧠", function: "最高级中枢，思维、记忆、运动、语言中枢" },
                    { name: "脊髓", icon: "📊", function: "低级中枢，反射中枢，传递信息" },
                    { name: "神经", icon: "⚡", function: "遍布全身，传递信号" }
                ],
                process: "五官接收信号 → 神经传递至大脑 → 大脑分析判断 → 下发指令 → 控制肌肉行动",
                zones: "大脑分区管控：视觉区、听觉区、记忆区、运动区、思考区"
            },
            "chemical-changes": {
                name: "生命化学变化",
                icon: "⚗️",
                intro: "人体内不断发生着各种化学变化",
                examples: [
                    { name: "食物消化", icon: "🍔", desc: "大分子食物被分解成小分子营养物" },
                    { name: "呼吸作用", icon: "💨", desc: "氧气和有机物反应，释放能量" },
                    { name: "身体生长", icon: "📈", desc: "细胞分裂合成新物质" },
                    { name: "伤口愈合", icon: "🩹", desc: "血小板凝固，白细胞杀菌，新细胞生成" }
                ],
                energy: "呼吸时氧气和体内有机物发生反应，释放人体运动、生长所需的能量"
            }
        }
    },

    // ====== 细胞探秘 ======
    cell: {
        title: "🔬 细胞探秘",
        subtitle: "生命的最小单位",
        sections: {
            "plant-cell": {
                name: "植物细胞模型",
                icon: "🌿",
                intro: "植物细胞有独特的结构",
                organelles: [
                    { id: "cell-wall", name: "细胞壁", icon: "🧱", color: "#a3e635", facts: ["位置：细胞最外层", "成分：纤维素", "功能：支撑细胞，固定方形外形", "独有：仅植物细胞拥有"] },
                    { id: "cell-membrane", name: "细胞膜", icon: "🥚", color: "#60a5fa", facts: ["位置：紧贴细胞壁内侧", "功能：控制物质进出细胞", "共有：动植物细胞都存在"] },
                    { id: "nucleus", name: "细胞核", icon: "🎯", color: "#f472b6", facts: ["位置：细胞中央", "内含：遗传物质DNA", "功能：细胞控制中心", "共有：动植物真核细胞都具备"] },
                    { id: "cytoplasm", name: "细胞质", icon: "🥣", color: "#fbbf24", facts: ["位置：细胞膜以内、细胞核以外", "功能：容纳所有细胞器", "共有：动植物均有"] },
                    { id: "chloroplast", name: "叶绿体", icon: "🟢", color: "#22c55e", facts: ["内含：叶绿素", "功能：光合作用场所", "独有：只在绿色部分细胞存在", "注意：根细胞无叶绿体"] },
                    { id: "vacuole", name: "液泡", icon: "💧", color: "#818cf8", facts: ["位置：成熟细胞中部大型泡状结构", "内含：细胞液（糖分、色素、水分）", "功能：储存水分、维持细胞坚挺", "区分：动物细胞只有极小液泡"] },
                    { id: "mitochondria", name: "线粒体", icon: "⚡", color: "#f97316", facts: ["外形：短棒状细胞器", "功能：呼吸作用场所", "共有：动植物细胞全部含有"] }
                ]
            },
            "animal-cell": {
                name: "动物细胞模型",
                icon: "🐾",
                intro: "动物细胞结构相对简单",
                organelles: [
                    { id: "cell-membrane-a", name: "细胞膜", icon: "🥚", color: "#60a5fa", facts: ["功能：控制物质进出细胞"] },
                    { id: "nucleus-a", name: "细胞核", icon: "🎯", color: "#f472b6", facts: ["内含：遗传物质DNA"] },
                    { id: "cytoplasm-a", name: "细胞质", icon: "🥣", color: "#fbbf24", facts: ["功能：容纳所有细胞器"] },
                    { id: "mitochondria-a", name: "线粒体", icon: "⚡", color: "#f97316", facts: ["功能：呼吸作用场所"] }
                ],
                note: "动物细胞无：细胞壁、叶绿体、大型中央液泡"
            },
            "comparison": {
                name: "植物vs动物细胞对比",
                icon: "⚖️",
                plantOnly: [
                    { structure: "细胞壁", reason: "支撑和保护植物细胞" },
                    { structure: "叶绿体", reason: "进行光合作用制造养料" },
                    { structure: "大型中央液泡", reason: "储存水分和营养" }
                ],
                common: [
                    { structure: "细胞膜", reason: "控制物质进出" },
                    { structure: "细胞核", reason: "控制细胞活动，含DNA" },
                    { structure: "细胞质", reason: "细胞器工作的场所" },
                    { structure: "线粒体", reason: "提供细胞能量" }
                ],
                mistakes: "【易错】植物根部细胞不见光，不含叶绿体"
            },
            "cell-basics": {
                name: "细胞通用知识",
                icon: "💡",
                definition: "细胞是植物、动物、人体最小结构和功能单位，所有生命体都由细胞构成",
                growth: "细胞持续分裂，数量不断增多，生物体型随之变大",
                types: [
                    { type: "植物细胞", icon: "🌿", features: "有细胞壁、叶绿体、大液泡" },
                    { type: "动物细胞", icon: "🐾", features: "无细胞壁，形状可变" },
                    { type: "细菌", icon: "🦠", features: "无细胞核（原核）" }
                ]
            }
        }
    },

    // ====== 生命科学 ======
    lifescience: {
        title: "🌏 生命科学",
        subtitle: "探索生命的奥秘",
        sections: {
            "heredity-variation": {
                name: "遗传与变异",
                icon: "👨‍👩‍👧",
                intro: "遗传和变异是生物多样性的基础",
                concepts: [
                    {
                        name: "遗传",
                        icon: "📋",
                        meaning: "亲代外形特征传递给后代",
                        result: "子代和亲代长相、特征相近",
                        purpose: "保证物种稳定延续",
                        examples: "子女像父母、双胞胎相似"
                    },
                    {
                        name: "变异",
                        icon: "🎨",
                        meaning: "同一物种内部个体存在差异",
                        result: "大小、颜色、花纹各有不同",
                        purpose: "造就生物多样性",
                        examples: "同种苹果大小颜色不同"
                    }
                ],
                evolution: "遗传保留物种基础特征，变异产生新特征，二者共同推动生物演化"
            },
            "evolution": {
                name: "生物进化",
                icon: "🦕",
                intro: "生物在漫长岁月中不断进化",
                fossil: {
                    name: "化石证据",
                    icon: "🪨",
                    formation: "远古生物遗体、痕迹被泥沙掩埋，千万年地质作用石化",
                    significance: "化石是生物进化的直接证据",
                    reveal: "通过化石可以了解古代生物的样子"
                },
                patterns: [
                    "结构：简单 → 复杂",
                    "环境：水生 → 陆生",
                    "等级：低等 → 高等"
                ],
                naturalSelection: {
                    name: "自然选择（适者生存）",
                    icon: "🏆",
                    process: "环境改变 → 拥有适配特征的生物存活繁衍 → 无法适应的生物逐渐灭绝",
                    examples: [
                        "长颈鹿长脖子取食高处树叶",
                        "桦尺蛾体色伪装躲避鸟类",
                        "猎豹速度快追捕瞪羚"
                    ]
                }
            },
            "biodiversity": {
                name: "生物多样性",
                icon: "🌈",
                intro: "地球上有无数种生物，它们生活在不同的环境中",
                meanings: [
                    { meaning: "物种多样", icon: "🐟", desc: "地球上有数百万种不同的生物" },
                    { meaning: "个体多样", icon: "🐟🐠🐡", desc: "同种生物的每个个体都不完全相同" },
                    { meaning: "环境多样", icon: "🌍", desc: "生物生活在各种不同的环境中" }
                ],
                value: [
                    "植物制造氧气",
                    "动植物提供食物、药材",
                    "调节水土气候",
                    "维持生态平衡"
                ],
                protection: [
                    { action: "建立自然保护区", icon: "🏞️" },
                    { action: "禁止乱砍滥伐", icon: "🚫🪓" },
                    { action: "禁止捕杀野生动物", icon: "🚫🔫" }
                ]
            }
        }
    },

    // ====== 虚拟实验 ======
    experiments: {
        title: "🧪 虚拟实验室",
        subtitle: "动手做实验，学习更有趣",
        labs: [
            {
                id: "plant-explorer",
                name: "植物器官识别",
                icon: "🌿",
                desc: "将植物器官拖到正确位置",
                difficulty: "⭐",
                type: "drag-match",
                items: [
                    { term: "固定植物", answer: "根", hint: "埋在土里的部分" },
                    { term: "运输通道", answer: "茎", hint: "连接根和叶" },
                    { term: "光合作用", answer: "叶", hint: "绿色的部分" },
                    { term: "繁殖器官", answer: "花", hint: "美丽的部分" },
                    { term: "保护种子", answer: "果实", hint: "里面有种子" }
                ]
            },
            {
                id: "animal-classifier",
                name: "动物分类挑战",
                icon: "🐛",
                desc: "判断动物属于哪一类",
                difficulty: "⭐⭐",
                type: "quiz-sort",
                questions: [
                    { q: "蝴蝶有几条腿？", options: ["4条", "6条", "8条", "0条"], answer: 1, category: "insect" },
                    { q: "青蛙是卵生还是胎生？", options: ["胎生", "卵生", "都不是"], answer: 1, category: "amphibian" },
                    { q: "以下哪个不是昆虫？", options: ["蚂蚁", "蜜蜂", "蜘蛛", "蝗虫"], answer: 2, category: "insect" },
                    { q: "鱼用什么呼吸？", options: ["肺", "鳃", "皮肤", "气管"], answer: 1, category: "fish" },
                    { q: "蚯蚓靠什么呼吸？", options: ["肺", "鳃", "湿润体表", "气管"], answer: 2, category: "annelid" }
                ]
            },
            {
                id: "cell-builder",
                name: "细胞结构搭建",
                icon: "🔬",
                desc: "为植物细胞和动物细胞添加正确的结构",
                difficulty: "⭐⭐",
                type: "drag-build",
                plantStructures: [
                    { name: "细胞壁", required: true },
                    { name: "叶绿体", required: true },
                    { name: "大液泡", required: true },
                    { name: "线粒体", required: true }
                ],
                animalStructures: [
                    { name: "线粒体", required: true },
                    { name: "细胞膜", required: true }
                ],
                common: ["细胞核", "细胞质"]
            },
            {
                id: "ecosystem-builder",
                name: "生态链构建",
                icon: "🌍",
                desc: "排列生态系统中不同生物的位置",
                difficulty: "⭐⭐⭐",
                type: "sequence",
                sequence: [
                    { name: "绿色植物", role: "生产者", icon: "🌿", hint: "自己制造食物" },
                    { name: "兔子", role: "初级消费者", icon: "🐰", hint: "吃植物" },
                    { name: "狐狸", role: "次级消费者", icon: "🦊", hint: "吃兔子" },
                    { name: "细菌", role: "分解者", icon: "🦠", hint: "分解废物" }
                ],
                foodChain: "太阳 → 植物 → 兔子 → 狐狸 → 分解者"
            },
            {
                id: "body-system-match",
                name: "人体系统配对",
                icon: "🧍",
                desc: "将器官与对应的系统匹配",
                difficulty: "⭐⭐",
                type: "match",
                pairs: [
                    { organ: "心脏", system: "循环系统" },
                    { organ: "肺", system: "呼吸系统" },
                    { organ: "胃", system: "消化系统" },
                    { organ: "大脑", system: "神经系统" },
                    { organ: "肾脏", system: "泌尿系统" }
                ]
            },
            {
                id: "photosynthesis-lab",
                name: "光合作用实验",
                icon: "☀️",
                desc: "探究光合作用的条件",
                difficulty: "⭐⭐⭐",
                type: "experiment",
                steps: [
                    {
                        step: 1,
                        action: "准备两株相同的植物",
                        setup: "一株放在阳光下，一株放在黑暗处"
                    },
                    {
                        step: 2,
                        action: "几天后观察",
                        result: "阳光下的植物叶片绿色，黑暗中的植物叶片发黄"
                    },
                    {
                        step: 3,
                        action: "得出结论",
                        conclusion: "光合作用需要阳光，阳光下植物产生叶绿素"
                    }
                ],
                formula: "二氧化碳 + 水 → 氧气 + 养料（需要阳光和叶绿体）"
            }
        ]
    },

    // ====== 游戏数据 ======
    game: {
        badges: [
            { id: "plant-explorer", name: "植物探索家", icon: "🌱", requirement: "学习完植物世界全部内容", color: "#22c55e" },
            { id: "animal-expert", name: "动物专家", icon: "🐾", requirement: "学习完动物王国全部内容", color: "#f59e0b" },
            { id: "body-master", name: "人体大师", icon: "🧠", requirement: "学习完人体奥秘全部内容", color: "#ef4444" },
            { id: "cell-scientist", name: "细胞科学家", icon: "🔬", requirement: "完成细胞探秘学习", color: "#8b5cf6" },
            { id: "ecology-guardian", name: "生态守护者", icon: "🌍", requirement: "学习完生命科学内容", color: "#06b6d4" },
            { id: "science-champion", name: "科学冠军", icon: "🏆", requirement: "完成所有实验", color: "#eab308" },
            { id: "quick-learner", name: "速学达人", icon: "⚡", requirement: "10分钟内完成5个知识点", color: "#ec4899" },
            { id: "perfect-score", name: "满分达人", icon: "💯", requirement: "在quiz中获得满分", color: "#14b8a6" }
        ],
        levels: [
            { name: "生物学徒", minXP: 0, icon: "🌱" },
            { name: "植物新手", minXP: 100, icon: "🌿" },
            { name: "动物学徒", minXP: 300, icon: "🐛" },
            { name: "人体学徒", minXP: 600, icon: "🧍" },
            { name: "细胞学徒", minXP: 1000, icon: "🔬" },
            { name: "科学小达人", minXP: 1500, icon: "⭐" },
            { name: "生物学霸", minXP: 2200, icon: "🌟" },
            { name: "科学小博士", minXP: 3000, icon: "🎓" },
            { name: "科学大师", minXP: 4000, icon: "👑" }
        ],
        xpRewards: {
            readKnowledge: 10,
            completeExperiment: 30,
            quizCorrect: 5,
            quizPerfect: 50,
            exploreAll: 20
        }
    }
};
