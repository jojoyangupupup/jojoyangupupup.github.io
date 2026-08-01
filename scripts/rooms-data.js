export const OVERVIEW_IMAGE = "/assets/rooms/home-overview-fresh-original.png";
export const OVERVIEW_SIZE = { width: 1487, height: 1058 };
export const SHOW_HOTSPOTS = false;

export const OVERVIEW_MOTION_OBJECTS = [
  { id: "cloud-left", width: 90, height: 80, x: 4, y: 7, size: 5.5, motion: "cloud", duration: 8.6, delay: -1.8, mobile: true },
  { id: "tape-left", width: 120, height: 105, x: 9, y: 19, size: 6, motion: "drift", duration: 12.2, delay: -5.4 },
  { id: "cat-white", width: 80, height: 100, x: 21, y: 7, size: 4.5, motion: "bob", duration: 8.8, delay: -3.2, mobile: true },
  { id: "flower-pink", width: 75, height: 75, x: 31, y: 4, size: 3.2, motion: "bob", duration: 6.8, delay: -2.1 },
  { id: "flower-yellow", width: 75, height: 80, x: 56, y: 3, size: 3.2, motion: "bob", duration: 7.4, delay: -4.7, mobile: true },
  { id: "cloud-right", width: 115, height: 85, x: 82, y: 6, size: 6.2, motion: "cloud", duration: 9.1, delay: -5.2, mobile: true },
  { id: "stars", width: 130, height: 95, x: 67, y: 12, size: 6.8, motion: "sparkle", duration: 7.8, delay: -2.4 },
  { id: "plane-top", width: 115, height: 100, x: 76, y: 19, size: 6, motion: "plane", duration: 8.5, delay: -6.1, mobile: true },
  { id: "heart-top", width: 70, height: 80, x: 94, y: 12, size: 3.4, motion: "bob", duration: 7.1, delay: -2.8 },
  { id: "daisy-left", width: 95, height: 90, x: 7, y: 30, size: 4.8, motion: "drift", duration: 11.2, delay: -6.2 },
  { id: "book-left", width: 90, height: 90, x: 2, y: 40, size: 4.8, motion: "drift", duration: 13.1, delay: -4.1 },
  { id: "pencil-left", width: 75, height: 80, x: 22, y: 31, size: 3.6, motion: "drift", duration: 10.8, delay: -7.2 },
  { id: "glasses-left", width: 90, height: 80, x: 15, y: 43, size: 4.4, motion: "drift", duration: 12.4, delay: -3.5 },
  { id: "camera-left", width: 85, height: 80, x: 4, y: 54, size: 4.5, motion: "drift", duration: 13.7, delay: -8.4, mobile: true },
  { id: "flower-line", width: 80, height: 125, x: 2, y: 65, size: 4.2, motion: "drift", duration: 14.2, delay: -4.9 },
  { id: "swatches-right", width: 140, height: 155, x: 84, y: 30, size: 7.2, motion: "drift", duration: 14.8, delay: -7.3 },
  { id: "cup-right", width: 85, height: 85, x: 77, y: 42, size: 4.2, motion: "drift", duration: 11.8, delay: -5.1 },
  { id: "sticky-right", width: 105, height: 115, x: 93, y: 52, size: 5.1, motion: "drift", duration: 13.4, delay: -9.2 },
  { id: "plane-bottom", width: 100, height: 100, x: 84, y: 65, size: 5.4, motion: "plane", duration: 9.4, delay: -3.3, mobile: true },
  { id: "hydrangea", width: 90, height: 105, x: 8, y: 74, size: 4.6, motion: "bob", duration: 9.8, delay: -6.4 },
  { id: "scissors", width: 90, height: 105, x: 17, y: 82, size: 4.6, motion: "drift", duration: 13.2, delay: -2.7 },
  { id: "orange-cat", width: 115, height: 150, x: 4, y: 86, size: 5.7, motion: "bob", duration: 10.6, delay: -7.7, mobile: true },
  { id: "cat-pair", width: 120, height: 145, x: 25, y: 85, size: 6, motion: "bob", duration: 11.3, delay: -5.8 },
  { id: "tableware", width: 160, height: 115, x: 66, y: 80, size: 8.2, motion: "drift", duration: 14.4, delay: -8.1 },
  { id: "black-cat", width: 210, height: 193, x: 82, y: 82, size: 10.2, motion: "bob", duration: 11.9, delay: -4.4, mobile: true },
  { id: "hearts-bottom", width: 112, height: 150, x: 94, y: 85, size: 4.2, motion: "sparkle", duration: 8.9, delay: -6.7 },
  { id: "star-bottom", width: 80, height: 105, x: 57, y: 91, size: 3.2, motion: "sparkle", duration: 8.2, delay: -3.9 },
];

export const PORTFOLIO = {
  authorName: "杨昕乔",
  indexLabel: "Project Index",
  indexDescription: "Work grouped by spatial categories",
  edition: "Portfolio / 2026",
};

// Hotspots use the overview image's 1487 x 1058 coordinate space so they stay
// aligned at every rendered size. The same paths also drive the focus clipPath.
export const ROOMS = [
  {
    id: "garden",
    number: "01",
    title: "Garden",
    path: "/rooms/garden",
    image: "/assets/rooms/garden-cutout.png",
    alt: "Isometric garden terrace with plants, wicker seating, and a bicycle",
    description: "A category for experimental image-making and visual studies.",
    projects: [
      { id: "project-01", title: "Project placeholder 01", type: "Visual study", year: "2026" },
      { id: "project-02", title: "Project placeholder 02", type: "Image making", year: "2025" },
    ],
    hotspotPath: "M478 360 L512 391 L744 498 L540 617 L540 789 L309 613 L309 596 L337 580 L337 523 L360 510 L371 474 L411 466 L430 438 L461 421 Z",
    hotspotCenter: { x: 480, y: 585 },
    transition: {
      sourceFinal: { x: 3.2, y: -1.5, scale: 1.17, blur: 6 },
      detailInitial: { x: -22.5, y: 1.5, scale: 0.58, blur: 6 },
    },
  },
  {
    id: "kitchen",
    number: "02",
    title: "Kitchen",
    path: "/rooms/kitchen",
    image: "/assets/rooms/kitchen-cutout.png",
    alt: "Isometric kitchen and dining room with timber cabinetry and a dining table",
    description: "A category for systems, identity, and structured design practice.",
    projects: [
      { id: "project-01", title: "Project placeholder 01", type: "Design system", year: "2026" },
      { id: "project-02", title: "Project placeholder 02", type: "Visual identity", year: "2025" },
    ],
    documents: [
      {
        id: "heartprint-marketing",
        title: "心相印营销策划",
        columnLabel: "策划案",
        format: "PDF",
        pages: 33,
        file: "/assets/works/kitchen-heartprint-campaign/heartprint-marketing.pdf",
        renderedPages: {
          basePath: "/assets/works/kitchen-heartprint-campaign/pages",
          extension: "jpg",
          width: 1560,
          height: 1080,
        },
      },
      {
        id: "heartprint-introduction",
        title: "心相印「这张纸巾记得」作品介绍",
        columnLabel: "作品介绍",
        contentType: "text",
        textSections: [
          {
            heading: "作品概述",
            paragraphs: [
              "参赛学院奖，针对恒安心相印云感柔肤系列纸巾打造的完整整合情感营销全案，以友情为核心情感切口，提炼主传播主题「这张纸巾记得」。方案跳出生活用纸行业同质化功能宣传的内卷，把纸巾从单纯清洁日用品，转化为承载青春回忆、见证挚友悲欢的情感载体，依托内容营销 5A 模型搭建四阶段传播链路，联动线上线下明星合作、UGC 话题、线下快闪与公益长线运营，为品牌构建差异化情感记忆点，最终实现年轻群体情感共鸣、品牌好感度与产品转化同步提升。",
            ],
          },
          {
            heading: "核心亮点",
            paragraphs: [
              "区别于常规日用品只做功能卖点的策划思路，跳出产品本身，抓住“纸巾见证友情”这一极易共情的微小生活场景，把快消品赋予浓厚人文情感；同时完整打通“预热 - 爆火 - 体验 - 长效”全周期营销链路，兼顾流量热度、用户参与、产品带货与品牌社会责任，策略完整、物料体系丰富，兼具创意感染力与商业落地可行性。",
            ],
          },
          {
            heading: "选题策划思路",
            paragraphs: [
              "前期梳理纸巾行业市场现状时我发现，维达、洁柔、清风等竞品全部聚焦柔韧、吸水、平价等物理卖点，几乎没有品牌深耕大众日常用纸背后的情绪场景；同时心相印自身“用心关爱身边每一个人”的品牌理念传播浅层，缺少能让年轻人记住的专属故事与情感符号。",
              "结合 Z 世代大学生、年轻上班族的用户洞察：当下年轻人社交压力大，极度渴求真挚友情带来的情绪慰藉，纸巾又是友情场景里高频出现的道具 - 难过时递纸巾、大笑擦眼泪、分享小纸条，无数细碎温暖瞬间都和纸巾绑定。基于这个生活化的共情切入点，我敲定以“友情见证者”为品牌新定位，确立“这张纸巾记得”核心主题，把产品柔软亲肤的使用感受，和朋友之间温柔治愈的陪伴感做绑定，让产品功能与情感价值双向契合，打造区别于竞品的独家品牌叙事。",
            ],
          },
          {
            heading: "完整落地工作",
            subsections: [
              {
                heading: "一、市场与用户调研（行业 / 竞品 / 消费者三维分析）",
                items: [
                  { title: "行业宏观分析", text: "完成 PEST 政策、经济、社会、技术四维拆解，梳理低碳环保政策、消费升级、短视频渠道崛起等行业机遇与挑战，明确生活用纸高端化、情感化是未来营销核心趋势。" },
                  { title: "品牌 SWOT 诊断", text: "梳理心相印自身品牌优势、传播短板、市场机会与同质化竞争威胁，精准定位品牌核心痛点 - 缺少深入人心的情感记忆，无法和年轻用户建立深度情感联结。" },
                  { title: "竞品对标分析", text: "横向拆解维达、洁柔、清风三大头部品牌传播逻辑，总结行业共性问题：重功能、轻故事，无专属情感标签，为本方案差异化策略提供依据。" },
                  { title: "目标用户深度调研", text: "设计 25 题定量消费者问卷，覆盖 18-35 岁 Z 世代群体，从消费习惯、社交偏好、情感需求、广告接受形式多维度收集数据，提炼三类典型用户画像（大学生、甜品师、职场程序员），确认年轻人愿意为品牌情绪价值买单、热衷短视频 UGC、对综艺好友向内容好感度高，以此确定后续明星合作、短视频、线下活动的落地方向。" },
                ],
              },
              {
                heading: "二、整体策略规划",
                paragraphs: ["以内容营销 5A 模型为底层逻辑，划分四大递进营销阶段，完整搭建传播节奏："],
                items: [
                  { title: "心相遇・曝光预热（Aware）", text: "国际友谊日上线温情 TVC，用高中、大学、异地多年好友的成长故事，铺垫“纸巾见证友情”的核心概念，完成品牌情感基调预埋。" },
                  { title: "心相识・爆点破圈（Attract）", text: "联动高国民度友情向综艺团体十个勤天，定制品牌主题曲《你是我的心朋友》，同步上线粉丝混剪短视频、一二线城市地铁大屏户外投放，借助明星流量快速破圈，制造全网话题热度。" },
                  { title: "心相知・体验转化（Ask & Act）", text: "抖音双话题挑战赛引导用户自主分享友情旧照、暖心瞬间，产出海量 UGC 内容；落地商场线下快闪店，设置好友默契互动游戏、产品试用、故事分享墙，打通线上流量到线下体验、线下打卡反哺线上传播的闭环，同步推出联名款纸巾周边，带动产品销售转化。" },
                  { title: "心相伴・长效维护（Advocate）", text: "联动温情生活类 KOL 打造公益短片，发起 #交个“心”朋友# 山区书信公益活动，把短期营销热度转化为长期品牌口碑，通过公益叙事强化品牌人文温度，沉淀忠实用户。" },
                ],
                paragraphsAfter: ["同时完整测算全案 377 万预算，拆分视频制作、明星合作、线上投流、线下场地、公益物料等细分开支，制作分阶段媒介排期表，精准规划 7-9 月全渠道投放节奏，兼顾传播效果与成本可控性。"],
              },
              {
                heading: "三、全套视觉创意设计（品牌传播物料产出）",
                paragraphs: ["围绕“温柔、青春、治愈”视觉调性，完成整套营销视觉物料设计，统一品牌视觉语言："],
                items: [
                  { title: "主视觉物料", text: "TVC 广告封面、品牌主题曲宣传海报、地铁大屏户外海报，融合山野、校园、好友同框等生活化场景，搭配手写体温情文案，呼应“一起哭过笑过的日子”主题。" },
                  { title: "线下空间视觉", text: "购物中心快闪店爱心主装置、活动打卡墙、人流区导视展板，统一心相印品牌绿色主色调，融入云感柔肤产品元素，打造沉浸式友情氛围打卡场景。" },
                  { title: "产品衍生视觉", text: "十个勤天联名纸巾包装、公益定制款纸巾、书信信封 / 信纸周边，把主题标语、友情插画融入产品包装，实现产品本身成为传播载体。" },
                  { title: "社交平台配图", text: "微博、抖音活动宣发长图、公益公关海报，适配短视频、信息流、朋友圈多渠道尺寸，兼顾线上传播轻量化、氛围感。" },
                ],
              },
            ],
          },
          {
            heading: "参与复盘",
            paragraphs: ["整套方案从 0 到 1，完整覆盖市场调研、用户洞察、策略建模、整合传播策划、预算排期、视觉创意统筹全流程工作："],
            items: [
              { title: "系统化市场分析", text: "熟练运用 PEST、SWOT、竞品对标、问卷调研等专业工具，能精准挖掘行业空白与用户真实情绪需求，不局限于产品功能，从情感维度打造差异化营销切口。" },
              { title: "内容营销 5A 模型", text: "可搭建线上线下联动、短期爆点 + 长期口碑并行的整合传播链路，兼顾流量破圈、用户互动、产品转化、品牌长效价值多重营销目标。" },
              { title: "全品类视觉统筹", text: "能根据传播渠道、活动阶段匹配对应视觉风格，实现广告、线下场景、产品周边视觉统一，让创意主题落地可感知。" },
              { title: "商业策划思维", text: "可独立完成项目预算拆分、媒介投放排期规划，平衡创意效果与落地成本，方案兼顾比赛创意性与真实市场可执行性。" },
              { title: "年轻群体传播洞察", text: "擅长把握 Z 世代年轻群体传播逻辑，融合明星跨界、短视频 UGC、线下快闪、公益营销等当下主流营销玩法，懂得用生活化、共情化故事替代硬广推销，贴合当代年轻人接收广告的偏好。" },
            ],
          },
        ],
        file: "/assets/works/kitchen-heartprint-introduction/heartprint-introduction.pdf",
      },
    ],
    objectHotspots: [
      {
        id: "kitchen-book",
        number: "01",
        label: "心相印营销策划",
        documentIds: ["heartprint-marketing", "heartprint-introduction"],
        path: "M 1078.8 1292.0 1027.6 1299.3 1008.9 1312.9 987.9 1313.4 957.0 1327.4 943.2 1327.9 946.4 1332.8 922.5 1341.5 912.0 1351.7 949.2 1408.5 978.9 1445.9 1164.9 1372.1 1091.5 1295.9 1080.4 1292.0 Z",
        glowImage: {
          file: "/assets/rooms/objects/kitchen-book.png",
          x: 909.81,
          y: 1289.82,
          width: 257.38,
          height: 158.37,
        },
      },
    ],
    hotspotPath: "M744 498 L946 615 L946 790 L744 907 L540 790 L540 617 Z",
    hotspotCenter: { x: 744, y: 700 },
    transition: {
      sourceFinal: { x: 0.2, y: -3.4, scale: 1.16, blur: 5 },
      detailInitial: { x: 0.5, y: 12.5, scale: 0.56, blur: 6 },
    },
  },
  {
    id: "living",
    number: "03",
    title: "Living Room",
    path: "/rooms/living",
    image: "/assets/rooms/living-cutout.png",
    alt: "Isometric living room with green sofa, media console, and a round coffee table",
    description: "A category for selected visual narratives and interactive work.",
    projects: [
      { id: "project-01", title: "Project placeholder 01", type: "Interactive design", year: "2026" },
      { id: "project-02", title: "Project placeholder 02", type: "Visual narrative", year: "2025" },
    ],
    documents: [
      {
        id: "living-project-space-demo",
        title: "项目空间 Demo",
        format: "Interactive HTML",
        contentType: "embed",
        embedUrl: "/assets/works/living-project-space-demo/",
      },
    ],
    objectHotspots: [
      {
        id: "living-tv",
        number: "01",
        label: "项目空间 Demo",
        documentId: "living-project-space-demo",
        path: "M 1398 784 L 1410 777 L 1745 977 L 1745 1226 L 1732 1243 L 1398 1045 Z M 1463 1127 L 1492 1121 L 1621 1215 L 1629 1237 L 1619 1244 L 1605 1243 L 1570 1218 L 1463 1141 Z",
        glowImage: {
          file: "/assets/rooms/objects/living-tv.png",
          x: 1390,
          y: 768,
          width: 361,
          height: 478,
        },
      },
    ],
    hotspotPath: "M980 327 L1175 451 L1175 616 L946 711 L946 614 L744 498 L802 456 L871 396 Z",
    hotspotCenter: { x: 970, y: 515 },
    transition: {
      sourceFinal: { x: -3.2, y: 0.5, scale: 1.16, blur: 6 },
      detailInitial: { x: 22.5, y: -3.5, scale: 0.58, blur: 7 },
    },
  },
  {
    id: "study",
    number: "04",
    title: "Study",
    path: "/rooms/study",
    image: "/assets/rooms/study-cutout.png",
    alt: "Isometric study with dark timber bookshelves, floral seating, and an easel",
    description: "A category for research-led, editorial, and reflective projects.",
    projects: [
      { id: "project-01", title: "Project placeholder 01", type: "Editorial design", year: "2026" },
      { id: "project-02", title: "Project placeholder 02", type: "Research project", year: "2025" },
    ],
    documents: [
      {
        id: "model-experience-4",
        title: "模型体验台细节优化 4.0",
        format: "PDF",
        pages: 1,
        file: "/assets/works/study-model-experience/model-experience-4.0.pdf",
        renderedPages: {
          basePath: "/assets/works/study-model-experience/pages",
          extension: "jpg",
          width: 1190,
          height: 15274,
        },
      },
      {
        id: "model-experience-usage-analysis",
        title: "模型体验台使用情况分析报告",
        format: "PDF",
        pages: 25,
        transparentPages: true,
        renderedPages: {
          basePath: "/assets/works/study-model-usage-analysis/transparent-pages",
          extension: "webp",
          version: "20260731-4",
          width: 1190,
          height: 1684,
          pageHeights: [1285, 1166, 1532, 1103, 1444, 1489, 1247, 1568, 1676, 1553, 953, 1649, 1212, 1435, 1535, 1505, 1525, 908, 1535, 1408, 1507, 1248, 1270, 1506, 1833],
        },
        links: [
          {
            id: "interview-materials",
            page: 1,
            label: "访谈材料：",
            ariaLabel: "打开访谈分析报告",
            targetDocumentId: "study-interview-analysis",
            x: 86,
            y: 328,
            width: 104,
            height: 49,
          },
          {
            id: "navigation-how",
            page: 1,
            label: "怎么用",
            displayLabel: "「怎么用」",
            ariaLabel: "跳转到怎么用，第 5 页",
            targetPage: 5,
            repaintLabel: true,
            surface: "tinted",
            x: 104,
            y: 492,
            width: 92,
            height: 26,
            cover: {
              x: 536,
              y: 484,
              width: 122,
              height: 42,
            },
          },
          {
            id: "navigation-what",
            page: 1,
            label: "做什么",
            displayLabel: "「做什么」",
            ariaLabel: "跳转到做什么，第 7 页",
            targetPage: 7,
            repaintLabel: true,
            x: 104,
            y: 542,
            width: 90,
            height: 26,
          },
          {
            id: "navigation-why",
            page: 1,
            label: "为什么选",
            displayLabel: "「为什么选」",
            ariaLabel: "跳转到为什么选，第 10 页",
            targetPage: 10,
            repaintLabel: true,
            x: 104,
            y: 591,
            width: 108,
            height: 26,
          },
          {
            id: "navigation-who",
            page: 1,
            label: "是什么人",
            displayLabel: "「是什么人」",
            ariaLabel: "跳转到是什么人，第 12 页",
            targetPage: 12,
            repaintLabel: true,
            x: 104,
            y: 641,
            width: 108,
            height: 26,
          },
          {
            id: "navigation-opportunity",
            page: 1,
            label: "新机会",
            displayLabel: "「新机会」",
            ariaLabel: "跳转到新机会，第 14 页",
            targetPage: 14,
            repaintLabel: true,
            x: 104,
            y: 690,
            width: 90,
            height: 26,
          },
        ],
      },
      {
        id: "study-interview-analysis",
        title: "访谈分析报告",
        format: "PDF",
        pages: 8,
        transparentPages: true,
        renderedPages: {
          basePath: "/assets/works/study-interview-analysis/transparent-pages",
          extension: "webp",
          version: "20260731-1",
          width: 1190,
          height: 1684,
          pageHeights: [1488, 1546, 1001, 1558, 1539, 1528, 1559, 957],
        },
      },
    ],
    objectHotspots: [
      {
        id: "study-book",
        number: "01",
        label: "模型体验台细节优化 4.0",
        documentId: "model-experience-4",
        path: "M941 1255 L964 1228 L987 1202 L1010 1175 L1033 1162 L1056 1167 L1079 1169 L1103 1171 L1126 1179 L1149 1189 L1172 1190 L1195 1200 L1218 1211 L1241 1219 L1264 1239 L1241 1266 L1218 1294 L1195 1322 L1172 1320 L1149 1313 L1126 1307 L1103 1300 L1079 1293 L1056 1289 L1033 1281 L1010 1274 L987 1268 L964 1263 L941 1256 Z",
        glowImage: {
          file: "/assets/rooms/objects/study-book.png",
          x: 940,
          y: 1160,
          width: 325.45,
          height: 167.44,
        },
      },
      {
        id: "study-lamp",
        number: "02",
        label: "模型体验台使用情况分析报告",
        documentId: "model-experience-usage-analysis",
        path: "M1060 589 C1060 575 1072 573 1088 573 C1105 573 1116 578 1116 590 C1116 602 1107 608 1089 610 C1072 608 1061 601 1060 589 Z M1086 608 L1090 608 L1090 753 L1086 753 Z M1088 754 C1110 754 1135 761 1147 774 L1179 867 C1183 885 1170 899 1148 908 C1129 916 1107 920 1087 921 C1064 920 1040 916 1017 908 C997 900 990 885 995 868 L1027 773 C1042 761 1065 754 1088 754 Z",
        glowImage: {
          file: "/assets/rooms/objects/study-lamp.png",
          x: 992.5,
          y: 572.7,
          width: 190,
          height: 349.6,
        },
      },
    ],
    hotspotPath: "M744 151 L980 327 L871 396 L802 456 L744 490 L499 382 L499 322 Z",
    hotspotCenter: { x: 744, y: 330 },
    transition: {
      sourceFinal: { x: 0.5, y: 3.4, scale: 1.18, blur: 5 },
      detailInitial: { x: 0, y: -24, scale: 0.54, blur: 6 },
    },
  },
];

// Top tabs and Previous/Next arrows share this single cyclic page order.
export const PAGE_NAVIGATION = [
  { id: "overview", label: "首页", accessibleLabel: "Overview", path: "/", type: "overview" },
  { id: "living", label: "客厅", accessibleLabel: "Living Room", path: "/rooms/living", type: "room", roomId: "living" },
  { id: "study", label: "书房", accessibleLabel: "Study", path: "/rooms/study", type: "room", roomId: "study" },
  { id: "kitchen", label: "厨房", accessibleLabel: "Kitchen", path: "/rooms/kitchen", type: "room", roomId: "kitchen" },
  { id: "garden", label: "花园", accessibleLabel: "Garden", path: "/rooms/garden", type: "room", roomId: "garden" },
];

export function roomFromPath(pathname) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  return ROOMS.find((room) => room.path === normalized) || null;
}

export function adjacentPages(pageId) {
  const index = PAGE_NAVIGATION.findIndex((item) => item.id === pageId);
  return {
    previous: PAGE_NAVIGATION[(index - 1 + PAGE_NAVIGATION.length) % PAGE_NAVIGATION.length],
    next: PAGE_NAVIGATION[(index + 1) % PAGE_NAVIGATION.length],
  };
}
