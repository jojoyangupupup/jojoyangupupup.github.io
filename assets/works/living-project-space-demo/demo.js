(() => {
  "use strict";

  const projectColors = ["#3b586a", "#5c7083", "#465f70", "#587181", "#3f6574", "#526a79"];
  const resourceColors = {
    doc: "#6f73f4",
    meeting: "#9a72ee",
    card: "#ee7d58",
    code: "#d76ab8",
    link: "#6c83a5"
  };

  const groups = [
    { id: "product", name: "企业内部搜索团队", members: "32 位成员", initials: "企" },
    { id: "knowledge", name: "知识工程团队", members: "18 位成员", initials: "知" },
    { id: "experience", name: "搜索体验优化讨论群", members: "24 位成员", initials: "搜" },
    { id: "platform", name: "研发效能团队", members: "16 位成员", initials: "研" }
  ];

  const baseResources = [
    {
      id: "search-review",
      type: "doc",
      typeLabel: "知识库文档",
      title: "搜索召回策略评审纪要",
      summary: "记录召回链路的阶段结论、风险项与下一轮评测安排。",
      source: "企业内搜索项目群",
      owner: "李可",
      date: "今天 13:40",
      updatedAt: "今天 13:40",
      tags: ["召回", "评审", "策略"],
      content: "本次评审确认先以高频知识查询为主线，分阶段验证语义召回和权限过滤。上线前需要补齐低频场景样本，并完成跨部门权限回归。"
    },
    {
      id: "result-ranking",
      type: "card",
      typeLabel: "iCafe 卡片",
      title: "搜索结果排序优化",
      summary: "围绕点击率、首条命中率和满意度优化结果排序。",
      source: "iCafe · 一期需求池",
      owner: "王言",
      date: "今天 11:20",
      updatedAt: "今天 11:20",
      tags: ["排序", "体验", "一期"],
      content: "排序策略将融合文本相关性、内容时效性和团队使用反馈。首轮仅对内部试点用户开放，并保留原排序作为对照组。"
    },
    {
      id: "search-script",
      type: "code",
      typeLabel: "代码库",
      title: "搜索服务验收脚本",
      summary: "覆盖权限、召回稳定性与核心查询集的自动化验收。",
      source: "GitLab · search-service",
      owner: "陈一",
      date: "昨天 18:30",
      updatedAt: "昨天 18:30",
      tags: ["验收", "自动化", "服务"],
      content: "脚本包含 126 条稳定查询、48 条权限边界查询和 20 条异常输入。每次候选版本发布前自动执行，失败项会同步到项目群。"
    },
    {
      id: "permission-meeting",
      type: "meeting",
      typeLabel: "会议",
      title: "权限边界确认会",
      summary: "明确跨空间检索、继承权限与离职交接的处理规则。",
      source: "搜索体验优化讨论群",
      owner: "赵六",
      date: "昨天 16:05",
      updatedAt: "昨天 16:05",
      tags: ["权限", "会议", "边界"],
      content: "会议确认检索结果严格继承原内容权限。对于已离职成员创建的资料，由原团队管理员完成归档或转交。"
    },
    {
      id: "quality-metrics",
      type: "doc",
      typeLabel: "知识库文档",
      title: "搜索质量评估指标.xlsx",
      summary: "整理离线评测口径、权重和每周跟踪结果。",
      source: "知识空间",
      owner: "陈七",
      date: "6 月 29 日 11:12",
      updatedAt: "6 月 29 日 11:12",
      tags: ["指标", "评测", "质量"],
      content: "评估指标包括首条命中率、Top 5 覆盖率、无结果率和用户满意度。项目周会统一查看趋势，不单独以某项指标判断版本效果。"
    },
    {
      id: "metric-caliber",
      type: "card",
      typeLabel: "iCafe 卡片",
      title: "搜索埋点与指标口径统一",
      summary: "统一查询、点击、停留和人工反馈的事件定义。",
      source: "iCafe · 一期需求池",
      owner: "赵九",
      date: "6 月 28 日 15:12",
      updatedAt: "6 月 28 日 15:12",
      tags: ["埋点", "指标", "数据"],
      content: "所有端统一使用 query_id 串联一次完整检索，避免重复曝光和跨端跳转造成统计偏差。"
    }
  ];

  const defaultProjects = [
    {
      id: "enterprise-search",
      icon: "Q",
      color: projectColors[0],
      title: "企业内搜索升级项目",
      description: "把群聊、知识库、会议、iCafe 卡片与代码库中的搜索策略和关键决策汇聚成可追溯的项目知识。",
      tags: ["搜索体验", "一期上线"],
      groupIds: ["product", "experience"],
      status: "同步正常",
      people: 3,
      resources: baseResources,
      updated: "10 分钟前",
      focus: {
        title: "不只是搜索升级，而是让企业知识真正被找到。",
        copy: "项目聚焦搜索召回、排序策略、权限继承与资料同步四条主线，持续把分散在群聊、知识库、会议、iCafe 卡片与代码库里的关键决策沉淀成可追溯、可复用的团队知识。",
        tags: ["搜索体验", "权限系统", "知识沉淀", "一期上线"],
        pinned: ["search-review", "permission-meeting", "search-script", "result-ranking"]
      }
    },
    {
      id: "knowledge-migration",
      icon: "M",
      color: projectColors[1],
      title: "智能知识库迁移计划",
      description: "统一知识空间的目录、权限和同步规范，让历史资料迁移后依旧可被发现。",
      tags: ["知识治理", "迁移"],
      groupIds: ["knowledge"],
      status: "同步正常",
      people: 5,
      resources: baseResources.slice(0, 4),
      updated: "25 分钟前"
    },
    {
      id: "agent-governance",
      icon: "A",
      color: projectColors[2],
      title: "智能助手知识治理",
      description: "建设可引用、可审计、可持续更新的 Agent 知识供给与质量机制。",
      tags: ["Agent", "质量治理"],
      groupIds: ["knowledge", "product"],
      status: "同步正常",
      people: 4,
      resources: baseResources.slice(1, 6),
      updated: "1 小时前"
    },
    {
      id: "search-lab",
      icon: "L",
      color: projectColors[3],
      title: "搜索体验增长实验",
      description: "用实验与用户反馈验证搜索结果解释、改写推荐和无结果引导的增长机会。",
      tags: ["增长实验", "用户反馈"],
      groupIds: ["experience"],
      status: "同步正常",
      people: 2,
      resources: baseResources.slice(0, 3),
      updated: "昨天"
    },
    {
      id: "support-ops",
      icon: "S",
      color: projectColors[4],
      title: "客户支持运营优化",
      description: "将服务群、FAQ、问题工单和复盘资料整理为可复用的服务运营知识。",
      tags: ["服务运营", "FAQ"],
      groupIds: ["product"],
      status: "同步正常",
      people: 6,
      resources: baseResources.slice(2, 6),
      updated: "2 天前"
    },
    {
      id: "efficiency-dashboard",
      icon: "D",
      color: projectColors[5],
      title: "研发效能数据看板",
      description: "沉淀研发目标、迭代节奏、质量指标与组织协作方式的历史记录。",
      tags: ["效能", "已归档"],
      groupIds: ["platform"],
      status: "自动同步已暂停",
      people: 2,
      resources: baseResources.slice(1, 4),
      updated: "6 月 18 日"
    }
  ];

  const icons = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>',
    dots: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"></path></svg>',
    edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M10 14l9-9"></path><path d="M19 13v6H5V5h6"></path></svg>',
    people: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6M8 13h8M8 17h5"></path></svg>'
  };

  const els = {
    projects: document.querySelector("#projects-view"),
    detail: document.querySelector("#detail-view"),
    modal: document.querySelector("#modal-root"),
    drawer: document.querySelector("#drawer-root"),
    toasts: document.querySelector("#toast-region"),
    app: document.querySelector("#app")
  };

  const state = {
    projects: loadProjects(),
    view: "projects",
    currentProjectId: null,
    detailTab: "overview",
    projectSearch: "",
    resourceSearch: "",
    resourceType: "all",
    resourceSort: "newest",
    statRange: "all",
    menuOpen: false,
    modal: null,
    drawerResourceId: null,
    lastFocused: null,
    create: {
      step: 1,
      title: "",
      description: "",
      tags: "",
      icon: "P",
      color: projectColors[0],
      groupIds: []
    }
  };

  function loadProjects() {
    try {
      const saved = window.localStorage.getItem("project-space-demo-projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (_) {
      // The demo remains fully usable when storage is unavailable.
    }
    return structuredClone(defaultProjects);
  }

  function persistProjects() {
    try {
      window.localStorage.setItem("project-space-demo-projects", JSON.stringify(state.projects));
    } catch (_) {
      // Persistence is a convenience, not a prerequisite for the prototype.
    }
  }

  function escapeHtml(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function slugify(value) {
    const normalized = value.trim().toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-").replace(/^-|-$/g, "");
    return normalized || `project-${Date.now()}`;
  }

  function currentProject() {
    return state.projects.find((project) => project.id === state.currentProjectId) || null;
  }

  function projectGroupNames(project) {
    return project.groupIds.map((id) => groups.find((group) => group.id === id)?.name).filter(Boolean);
  }

  function resourceTypeShort(type) {
    return { doc: "文", meeting: "会", card: "卡", code: "码", link: "链" }[type] || "资";
  }

  function render() {
    renderTopNav();
    if (state.view === "detail" && currentProject()) {
      els.projects.hidden = true;
      els.detail.hidden = false;
      renderDetail();
    } else {
      state.view = "projects";
      els.projects.hidden = false;
      els.detail.hidden = true;
      renderProjects();
    }
    renderModal();
    renderDrawer();
  }

  function renderTopNav() {
    document.querySelectorAll(".topnav-item").forEach((item) => {
      const active = item.dataset.action === "show-projects" ? state.view === "projects" : false;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
  }

  function renderProjects() {
    const query = state.projectSearch.trim().toLowerCase();
    const filtered = state.projects.filter((project) => {
      const content = [project.title, project.description, ...project.tags, ...projectGroupNames(project)].join(" ").toLowerCase();
      return !query || content.includes(query);
    });

    els.projects.innerHTML = `
      <div class="page-heading">
        <div>
          <h1 id="projects-title">全部项目</h1>
          <p>仅展示你当前有权限访问的项目空间，按创建时间从新到旧排列</p>
        </div>
        <label class="search-field">
          <span class="sr-only">搜索项目</span>
          ${icons.search}
          <input id="project-search" type="search" placeholder="搜索项目名称、负责人或团队…" value="${escapeHtml(state.projectSearch)}" autocomplete="off">
        </label>
      </div>
      <div class="access-banner">
        <span>你可以访问 <strong>${state.projects.length} 个项目</strong>，每一个项目都有自己的资料脉络与同步节奏</span>
        <span>权限范围内可见</span>
      </div>
      ${filtered.length ? `<div class="project-grid">${filtered.map(projectCard).join("")}</div>` : `
        <div class="empty-state">
          <h2>没有找到匹配项目</h2>
          <p>换一个关键词，或新建一个项目空间。</p>
        </div>
      `}
    `;
  }

  function projectCard(project) {
    const groupName = projectGroupNames(project)[0] || "未分配团队";
    const syncing = project.status.includes("暂停");
    return `
      <article class="project-card" data-action="open-project" data-project-id="${escapeHtml(project.id)}" role="link" tabindex="0" aria-label="进入项目：${escapeHtml(project.title)}">
        <span class="mini-control project-card-open" aria-hidden="true">
          ${icons.arrow}
        </span>
        <span class="project-icon" style="background:${escapeHtml(project.color)}" aria-hidden="true">${escapeHtml(project.icon)}</span>
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.description)}</p>
        <div class="tag-row">${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="card-footer">
          <span>${icons.people}${escapeHtml(groupName)}</span>
          <span>${icons.file}${project.resources.length} 份资料</span>
        </div>
        <div class="card-footer">
          <span class="status${syncing ? " is-syncing" : ""}">${escapeHtml(project.status)}</span>
          <span>${escapeHtml(project.updated)}</span>
        </div>
      </article>
    `;
  }

  function renderDetail() {
    const project = currentProject();
    const groupNames = projectGroupNames(project);
    const tabContent = state.detailTab === "resources" ? renderResources(project) : renderOverview(project);
    els.detail.innerHTML = `
      <div class="detail-utility">
        <button class="button button-quiet back-button" type="button" data-action="show-projects">${icons.back}返回全部项目</button>
        <span class="breadcrumb">项目空间 / ${escapeHtml(project.title)}</span>
      </div>
      <section class="detail-hero" aria-labelledby="detail-title">
        <div>
          <div class="detail-title-row">
            <span class="project-icon" style="background:${escapeHtml(project.color)}" aria-hidden="true">${escapeHtml(project.icon)}</span>
            <div class="detail-title">
              <p class="eyebrow">PROJECT SPACE</p>
              <h1 id="detail-title">${escapeHtml(project.title)}</h1>
              <p>${escapeHtml(project.description)}</p>
            </div>
          </div>
          <div class="detail-meta">
            <span class="meta-pill"><strong>${project.resources.length}</strong> 份资料</span>
            <span class="meta-pill"><strong>${project.people}</strong> 位负责人</span>
            <span class="meta-pill">${escapeHtml(groupNames.join("、") || "未分配团队")}</span>
            <span class="status${project.status.includes("暂停") ? " is-syncing" : ""}">${escapeHtml(project.status)}</span>
          </div>
        </div>
        <div class="detail-actions">
          <button class="button button-primary" type="button" data-action="open-add-resource">${icons.plus}添加资料</button>
          <button class="icon-button" type="button" data-action="toggle-project-menu" aria-label="项目操作" aria-expanded="${state.menuOpen}">${icons.dots}</button>
          ${state.menuOpen ? `
            <div class="action-menu" role="menu">
              <button type="button" role="menuitem" data-action="open-edit-project">编辑项目信息</button>
              <button type="button" role="menuitem" data-action="open-manage-groups">管理项目群组</button>
              <button type="button" role="menuitem" data-action="duplicate-project">复制项目</button>
            </div>
          ` : ""}
        </div>
      </section>
      <div class="detail-tabs" role="tablist" aria-label="项目内容">
        <button class="detail-tab${state.detailTab === "overview" ? " is-active" : ""}" type="button" role="tab" data-action="set-detail-tab" data-tab="overview" aria-selected="${state.detailTab === "overview"}">概览</button>
        <button class="detail-tab${state.detailTab === "resources" ? " is-active" : ""}" type="button" role="tab" data-action="set-detail-tab" data-tab="resources" aria-selected="${state.detailTab === "resources"}">资料 <span class="count-badge">${project.resources.length}</span></button>
      </div>
      ${tabContent}
    `;
  }

  function renderOverview(project) {
    const focus = project.focus || {
      title: `围绕“${project.title}”持续沉淀关键资料。`,
      copy: project.description,
      tags: project.tags,
      pinned: project.resources.slice(0, 4).map((resource) => resource.id)
    };
    const pinned = focus.pinned.map((id) => project.resources.find((resource) => resource.id === id)).filter(Boolean);
    const ranges = {
      all: [46, 28, 18, 12, 84, project.resources.length * 31 + 2],
      week: [12, 8, 6, 3, 26, 55],
      month: [31, 20, 14, 9, 63, 137],
      created: [46, 28, 18, 12, 84, project.resources.length * 31 + 2]
    };
    const values = ranges[state.statRange] || ranges.all;
    const statItems = [
      ["知识库文档", values[0], "+ 12 本期新增", resourceColors.doc],
      ["会议", values[1], "+ 5 本期新增", resourceColors.meeting],
      ["iCafe 卡片", values[2], "+ 4 本期新增", resourceColors.card],
      ["代码库", values[3], "+ 3 本期新增", resourceColors.code],
      ["附件与链接", values[4], "+ 10 本期新增", resourceColors.link],
      ["总资料量", values[5], "+ 34 本期新增", "#6578ff"]
    ];

    return `
      <div class="detail-layout">
        <div class="detail-main">
          <section class="panel" aria-labelledby="stats-title">
            <div class="section-heading">
              <div>
                <h2 id="stats-title">项目资料概览</h2>
                <p>仅统计你当前有权限访问的项目资料</p>
              </div>
              <div class="range-control" aria-label="统计时间范围">
                ${[["all", "全部"], ["week", "最近 7 天"], ["month", "最近 30 天"], ["created", "自项目创建以来"]].map(([id, label]) => `<button class="range-button${state.statRange === id ? " is-active" : ""}" type="button" data-action="set-stat-range" data-range="${id}">${label}</button>`).join("")}
              </div>
            </div>
            <div class="stats-grid">
              ${statItems.map(([label, value, change, color]) => `
                <div class="stat-card" style="--stat-color:${color}">
                  <span class="stat-label">${label}</span>
                  <strong class="stat-value">${value}</strong>
                  <span class="stat-change">${change}</span>
                </div>
              `).join("")}
            </div>
          </section>
          <section class="panel" aria-labelledby="focus-title">
            <div class="focus-heading">
              <div>
                <p class="focus-kicker">PROJECT FOCUS · 01 <span class="tag">项目负责人维护</span></p>
                <h2 class="focus-title" id="focus-title">${escapeHtml(focus.title)}</h2>
              </div>
              <button class="button" type="button" data-action="open-edit-focus">${icons.edit}编辑</button>
            </div>
            <p class="focus-copy">${escapeHtml(focus.copy)}</p>
            <div class="tag-row">${focus.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
            ${pinned.length ? `<div class="pinned-list">${pinned.map((resource) => `
              <button class="pinned-item" type="button" data-action="open-resource" data-resource-id="${escapeHtml(resource.id)}">
                <span class="resource-icon" style="--resource-color:${resourceColors[resource.type]}">${resourceTypeShort(resource.type)}</span>
                <span>${escapeHtml(resource.title)}</span>
              </button>
            `).join("")}</div>` : ""}
          </section>
        </div>
        <aside class="detail-side">
          <section class="panel" aria-labelledby="timeline-title">
            <div class="section-heading">
              <div>
                <h2 id="timeline-title">最近沉淀与更新</h2>
                <p>最近 7 天 · 按最近同步时间倒序</p>
              </div>
              <button class="button button-quiet" type="button" data-action="set-detail-tab" data-tab="resources">查看全部 ${icons.arrow}</button>
            </div>
            <div class="timeline">
              ${project.resources.slice(0, 6).map((resource) => `
                <div class="timeline-item" style="--event-color:${resourceColors[resource.type]}">
                  <span class="timeline-dot" aria-hidden="true"></span>
                  <div class="timeline-card">
                    <button type="button" data-action="open-resource" data-resource-id="${escapeHtml(resource.id)}">
                      <strong>${escapeHtml(resource.title)}</strong>
                      <small>${escapeHtml(resource.source)} · ${escapeHtml(resource.updatedAt)}</small>
                    </button>
                  </div>
                </div>
              `).join("")}
            </div>
          </section>
        </aside>
      </div>
    `;
  }

  function renderResources(project) {
    const query = state.resourceSearch.trim().toLowerCase();
    let resources = project.resources.filter((resource) => {
      const matchesQuery = !query || [resource.title, resource.summary, resource.source, ...resource.tags].join(" ").toLowerCase().includes(query);
      return matchesQuery && (state.resourceType === "all" || resource.type === state.resourceType);
    });
    resources = [...resources].sort((a, b) => state.resourceSort === "title" ? a.title.localeCompare(b.title, "zh-CN") : project.resources.indexOf(a) - project.resources.indexOf(b));

    return `
      <section class="panel" aria-labelledby="resources-title">
        <div class="section-heading">
          <div>
            <h2 id="resources-title">项目资料</h2>
            <p>集中查看从知识库、会议、iCafe 和代码库沉淀的原始内容</p>
          </div>
          <span class="tag">${resources.length} 条结果</span>
        </div>
        <div class="materials-toolbar">
          <label class="search-field">
            <span class="sr-only">搜索资料</span>
            ${icons.search}
            <input id="resource-search" type="search" placeholder="搜索标题、标签或来源…" value="${escapeHtml(state.resourceSearch)}" autocomplete="off">
          </label>
          <label class="field">
            <span class="sr-only">资料类型</span>
            <select id="resource-type" aria-label="资料类型">
              ${[["all", "全部类型"], ["doc", "知识库文档"], ["meeting", "会议"], ["card", "iCafe 卡片"], ["code", "代码库"]].map(([value, label]) => `<option value="${value}"${state.resourceType === value ? " selected" : ""}>${label}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span class="sr-only">资料排序</span>
            <select id="resource-sort" aria-label="资料排序">
              <option value="newest"${state.resourceSort === "newest" ? " selected" : ""}>最近更新</option>
              <option value="title"${state.resourceSort === "title" ? " selected" : ""}>按标题</option>
            </select>
          </label>
        </div>
        ${resources.length ? `<div class="materials-list">${resources.map(resourceRow).join("")}</div>` : `
          <div class="empty-state"><h2>没有匹配资料</h2><p>调整搜索词或资料类型后再试。</p></div>
        `}
      </section>
    `;
  }

  function resourceRow(resource) {
    return `
      <button class="resource-row" type="button" data-action="open-resource" data-resource-id="${escapeHtml(resource.id)}">
        <span class="resource-icon" style="--resource-color:${resourceColors[resource.type]}">${resourceTypeShort(resource.type)}</span>
        <span class="resource-main">
          <strong>${escapeHtml(resource.title)}</strong>
          <p>${escapeHtml(resource.summary)}</p>
          <span class="resource-meta">
            <span>${escapeHtml(resource.typeLabel)}</span><span>${escapeHtml(resource.source)}</span><span>${escapeHtml(resource.owner)} · ${escapeHtml(resource.updatedAt)}</span>
          </span>
        </span>
        <span class="resource-arrow">${icons.arrow}</span>
      </button>
    `;
  }

  function renderModal() {
    if (!state.modal) {
      els.modal.innerHTML = "";
      updateInertState();
      return;
    }
    let content = "";
    if (state.modal === "create") content = createModal();
    if (state.modal === "edit-project") content = editProjectModal();
    if (state.modal === "groups") content = groupsModal();
    if (state.modal === "add-resource") content = addResourceModal();
    if (state.modal === "focus") content = focusModal();
    els.modal.innerHTML = content;
    updateInertState();
    requestAnimationFrame(() => focusDialog(els.modal));
  }

  function modalShell({ title, subtitle, icon = "P", body, footer, narrow = false }) {
    return `
      <div class="modal-overlay" data-action="close-modal" role="presentation">
        <section class="modal${narrow ? " is-narrow" : ""}" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-dialog>
          <header class="modal-header">
            <div class="modal-title">
              <span class="modal-icon" aria-hidden="true">${escapeHtml(icon)}</span>
              <div><h2 id="modal-title">${escapeHtml(title)}</h2><p>${escapeHtml(subtitle)}</p></div>
            </div>
            <button class="icon-button" type="button" data-action="close-modal" aria-label="关闭">${icons.close}</button>
          </header>
          <div class="modal-body">${body}</div>
          <footer class="modal-footer">${footer}</footer>
        </section>
      </div>
    `;
  }

  function createModal() {
    const step = state.create.step;
    let body = `
      <div class="steps" aria-label="新建项目步骤">
        ${["填写项目信息", "选择项目群", "确认创建"].map((label, index) => `<div class="step${step === index + 1 ? " is-active" : ""}${step > index + 1 ? " is-done" : ""}"><span class="step-number">${index + 1}</span><span>${label}</span></div>`).join("")}
      </div>
    `;
    if (step === 1) body += createStepOne();
    if (step === 2) body += createStepTwo();
    if (step === 3) body += createStepThree();
    const footer = `
      <span class="field-hint">第 ${step} / 3 步</span>
      <div class="modal-footer-actions">
        ${step > 1 ? '<button class="button" type="button" data-action="create-prev">上一步</button>' : '<button class="button" type="button" data-action="close-modal">取消</button>'}
        <button class="button button-primary" type="button" data-action="${step === 3 ? "create-submit" : "create-next"}">${step === 3 ? "创建项目" : `下一步 ${icons.arrow}`}</button>
      </div>
    `;
    return modalShell({ title: "新建项目空间", subtitle: "把分散的项目资料沉淀为可追溯的团队知识。", icon: state.create.icon, body, footer });
  }

  function createStepOne() {
    const data = state.create;
    return `
      <div class="create-layout">
        <section class="form-section">
          <h3>项目标识</h3><p class="section-copy">先设置项目的基本信息，后续可以随时修改。</p>
          <div class="field"><label for="create-title">项目名称 <span class="required">*</span></label><input id="create-title" data-create-field="title" maxlength="30" value="${escapeHtml(data.title)}" placeholder="例如：客户洞察研究计划"></div>
          <div class="field"><label for="create-description">项目说明 <span class="required">*</span></label><textarea id="create-description" data-create-field="description" maxlength="160" placeholder="说明项目目标、范围和沉淀重点">${escapeHtml(data.description)}</textarea><span class="field-hint">${data.description.length} / 160</span></div>
          <div class="field"><label for="create-tags">标签</label><input id="create-tags" data-create-field="tags" value="${escapeHtml(data.tags)}" placeholder="用中文逗号分隔，最多 4 个"></div>
          <div class="field"><label>项目图标</label><div class="icon-picker">${["P", "Q", "M", "A"].map((icon, index) => `<button class="icon-choice${data.icon === icon ? " is-active" : ""}" type="button" data-action="select-create-icon" data-icon="${icon}" data-color="${projectColors[index]}">${icon}</button>`).join("")}</div></div>
        </section>
        <aside class="preview-section">
          <h3>项目预览</h3><p class="section-copy">创建完成后，项目卡片会以这种方式出现。</p>
          <div class="project-preview">
            <span class="project-icon" style="background:${escapeHtml(data.color)}">${escapeHtml(data.icon)}</span>
            <h4 data-create-preview="title">${escapeHtml(data.title || "未命名项目")}</h4>
            <p data-create-preview="description">${escapeHtml(data.description || "项目说明会显示在这里。")}</p>
            <div class="tag-row" data-create-preview="tags">${createTags(data.tags).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("") || '<span class="tag">项目标签</span>'}</div>
          </div>
        </aside>
      </div>
    `;
  }

  function createStepTwo() {
    return `
      <section class="form-section">
        <h3>选择项目群</h3><p class="section-copy">项目群成员将根据各自的原始内容权限访问同步资料。</p>
        <div class="group-list">
          ${groups.map((group) => `
            <label class="group-option" data-action="toggle-create-group" data-group-id="${group.id}">
              <input type="checkbox" data-create-group="${group.id}"${state.create.groupIds.includes(group.id) ? " checked" : ""}>
              <span class="group-avatar">${group.initials}</span>
              <span><strong>${group.name}</strong><small>${group.members} · 权限随原内容同步</small></span>
            </label>
          `).join("")}
        </div>
        <div class="notice">项目空间不会扩大原内容的可见范围。成员仍需拥有原文档、会议或代码库权限才能查看详情。</div>
      </section>
    `;
  }

  function createStepThree() {
    const selectedGroups = state.create.groupIds.map((id) => groups.find((group) => group.id === id)?.name).filter(Boolean);
    return `
      <section class="confirm-summary">
        <h3>确认项目信息</h3><p class="section-copy">创建后将立即生成项目空间，并开始准备资料同步。</p>
        <div class="confirm-grid">
          <div class="confirm-item"><small>项目名称</small><strong>${escapeHtml(state.create.title)}</strong></div>
          <div class="confirm-item"><small>项目群</small><strong>${escapeHtml(selectedGroups.join("、"))}</strong></div>
          <div class="confirm-item"><small>标签</small><strong>${escapeHtml(createTags(state.create.tags).join("、") || "暂无")}</strong></div>
          <div class="confirm-item"><small>初始状态</small><strong>准备同步</strong></div>
        </div>
        <div class="notice">创建后，你可以从项目操作菜单继续添加资料、调整项目群或编辑 Project Focus。</div>
      </section>
    `;
  }

  function editProjectModal() {
    const project = currentProject();
    const body = `
      <form id="edit-project-form">
        <div class="field"><label for="edit-title">项目名称</label><input id="edit-title" name="title" required maxlength="30" value="${escapeHtml(project.title)}"></div>
        <div class="field"><label for="edit-description">项目说明</label><textarea id="edit-description" name="description" required maxlength="160">${escapeHtml(project.description)}</textarea></div>
        <div class="field"><label for="edit-tags">标签</label><input id="edit-tags" name="tags" value="${escapeHtml(project.tags.join("，"))}"></div>
      </form>
    `;
    const footer = `<span class="field-hint">项目 ID：${escapeHtml(project.id)}</span><div class="modal-footer-actions"><button class="button" type="button" data-action="close-modal">取消</button><button class="button button-primary" type="submit" form="edit-project-form">保存更改</button></div>`;
    return modalShell({ title: "编辑项目信息", subtitle: "调整名称、说明和用于检索的标签。", icon: project.icon, body, footer, narrow: true });
  }

  function groupsModal() {
    const project = currentProject();
    const body = `<form id="groups-form"><div class="group-list">${groups.map((group) => `
      <label class="group-option"><input type="checkbox" name="group" value="${group.id}"${project.groupIds.includes(group.id) ? " checked" : ""}><span class="group-avatar">${group.initials}</span><span><strong>${group.name}</strong><small>${group.members}</small></span></label>
    `).join("")}</div><div class="notice">取消项目群不会删除已经沉淀的资料，但成员可能因原内容权限变化而无法继续查看。</div></form>`;
    const footer = `<span class="field-hint">已选择 ${project.groupIds.length} 个项目群</span><div class="modal-footer-actions"><button class="button" type="button" data-action="close-modal">取消</button><button class="button button-primary" type="submit" form="groups-form">保存群组</button></div>`;
    return modalShell({ title: "管理项目群组", subtitle: "设置参与项目资料沉淀的团队与讨论群。", icon: "群", body, footer, narrow: true });
  }

  function addResourceModal() {
    const body = `
      <form id="add-resource-form">
        <div class="field-grid">
          <div class="field"><label for="resource-title-input">资料标题 <span class="required">*</span></label><input id="resource-title-input" name="title" required maxlength="50" placeholder="输入资料标题"></div>
          <div class="field"><label for="resource-type-input">资料类型</label><select id="resource-type-input" name="type"><option value="doc">知识库文档</option><option value="meeting">会议</option><option value="card">iCafe 卡片</option><option value="code">代码库</option><option value="link">外部链接</option></select></div>
        </div>
        <div class="field"><label for="resource-summary-input">资料摘要</label><textarea id="resource-summary-input" name="summary" required maxlength="180" placeholder="说明这份资料包含什么信息"></textarea></div>
        <div class="field-grid">
          <div class="field"><label for="resource-source-input">来源</label><input id="resource-source-input" name="source" required placeholder="例如：知识空间"></div>
          <div class="field"><label for="resource-owner-input">负责人</label><input id="resource-owner-input" name="owner" required placeholder="负责人姓名"></div>
        </div>
        <div class="field"><label for="resource-tags-input">标签</label><input id="resource-tags-input" name="tags" placeholder="用中文逗号分隔"></div>
      </form>
    `;
    const footer = `<span class="field-hint">演示资料会保存在当前浏览器中</span><div class="modal-footer-actions"><button class="button" type="button" data-action="close-modal">取消</button><button class="button button-primary" type="submit" form="add-resource-form">添加资料</button></div>`;
    return modalShell({ title: "添加项目资料", subtitle: "将一份资料关联到当前项目空间。", icon: "+", body, footer, narrow: true });
  }

  function focusModal() {
    const project = currentProject();
    const focus = project.focus || { title: "", copy: "", tags: [], pinned: [] };
    const body = `
      <form id="focus-form">
        <div class="field"><label for="focus-title-input">标题</label><input id="focus-title-input" name="title" required maxlength="60" value="${escapeHtml(focus.title)}"></div>
        <div class="field"><label for="focus-copy-input">说明</label><textarea id="focus-copy-input" name="copy" required maxlength="300">${escapeHtml(focus.copy)}</textarea></div>
        <div class="field"><label for="focus-tags-input">标签</label><input id="focus-tags-input" name="tags" value="${escapeHtml(focus.tags.join("，"))}"><span class="field-hint">最多展示 8 个标签。</span></div>
        <section class="form-section"><h3>置顶文件</h3><p class="section-copy">选择最值得优先查看的资料，最多 5 条。</p><div class="check-list">${project.resources.map((resource) => `
          <label class="check-option"><input type="checkbox" name="pinned" value="${resource.id}"${focus.pinned.includes(resource.id) ? " checked" : ""}><span><strong>${escapeHtml(resource.title)}</strong><small>${escapeHtml(resource.typeLabel)} · ${escapeHtml(resource.source)}</small></span></label>
        `).join("")}</div></section>
      </form>
    `;
    const footer = `<span class="field-hint">由项目负责人维护</span><div class="modal-footer-actions"><button class="button" type="button" data-action="close-modal">取消</button><button class="button button-primary" type="submit" form="focus-form">保存更改</button></div>`;
    return modalShell({ title: "编辑 Project Focus", subtitle: "帮助成员快速掌握项目关键信息。", icon: "✦", body, footer });
  }

  function renderDrawer() {
    const project = currentProject();
    const resource = project?.resources.find((item) => item.id === state.drawerResourceId);
    if (!resource) {
      els.drawer.innerHTML = "";
      updateInertState();
      return;
    }
    els.drawer.innerHTML = `
      <div class="drawer-overlay" data-action="close-drawer" role="presentation">
        <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" data-dialog>
          <header class="drawer-header">
            <div class="drawer-title">
              <span class="resource-icon" style="--resource-color:${resourceColors[resource.type]}">${resourceTypeShort(resource.type)}</span>
              <div><h2 id="drawer-title">${escapeHtml(resource.title)}</h2><p>${escapeHtml(resource.typeLabel)} · ${escapeHtml(resource.source)}</p></div>
            </div>
            <button class="icon-button" type="button" data-action="close-drawer" aria-label="关闭资料详情">${icons.close}</button>
          </header>
          <div class="drawer-body">
            <button class="button button-primary" type="button" data-action="open-original">${icons.external}查看原始内容</button>
            <div class="drawer-intro">${escapeHtml(resource.content)}</div>
            <section class="drawer-section"><h3>资料信息</h3><div class="drawer-info-grid"><div><small>负责人</small><strong>${escapeHtml(resource.owner)}</strong></div><div><small>最近更新</small><strong>${escapeHtml(resource.updatedAt)}</strong></div><div><small>资料类型</small><strong>${escapeHtml(resource.typeLabel)}</strong></div><div><small>来源空间</small><strong>${escapeHtml(resource.source)}</strong></div></div></section>
            <section class="drawer-section"><h3>内容标签</h3><div class="tag-row">${resource.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div></section>
            <section class="drawer-section"><h3>项目关联</h3><p class="focus-copy">该资料已关联到“${escapeHtml(project.title)}”，项目成员的查看权限仍以原始内容为准。</p></section>
          </div>
        </aside>
      </div>
    `;
    updateInertState();
    requestAnimationFrame(() => focusDialog(els.drawer));
  }

  function createTags(value) {
    return String(value).split(/[，,]/).map((tag) => tag.trim()).filter(Boolean).slice(0, 4);
  }

  function openProject(id) {
    if (!state.projects.some((project) => project.id === id)) return;
    state.currentProjectId = id;
    state.view = "detail";
    state.detailTab = "overview";
    state.resourceSearch = "";
    state.menuOpen = false;
    history.pushState({ projectId: id }, "", `#project/${encodeURIComponent(id)}`);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showProjects(push = true) {
    state.view = "projects";
    state.currentProjectId = null;
    state.menuOpen = false;
    state.modal = null;
    state.drawerResourceId = null;
    if (push) history.pushState({}, "", "#projects");
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openModal(name) {
    state.lastFocused = document.activeElement;
    state.modal = name;
    state.menuOpen = false;
    render();
  }

  function closeModal() {
    state.modal = null;
    render();
    restoreFocus();
  }

  function openDrawer(resourceId) {
    state.lastFocused = document.activeElement;
    state.drawerResourceId = resourceId;
    renderDrawer();
  }

  function closeDrawer() {
    state.drawerResourceId = null;
    renderDrawer();
    restoreFocus();
  }

  function focusDialog(root) {
    const dialog = root.querySelector("[data-dialog]");
    if (!dialog) return;
    const focusable = dialog.querySelector("button, input, textarea, select, [href]");
    focusable?.focus({ preventScroll: true });
  }

  function restoreFocus() {
    if (state.lastFocused instanceof HTMLElement && document.contains(state.lastFocused)) {
      state.lastFocused.focus({ preventScroll: true });
    }
    state.lastFocused = null;
  }

  function updateInertState() {
    const overlayOpen = Boolean(state.modal || state.drawerResourceId);
    if ("inert" in els.app) els.app.inert = overlayOpen;
    else els.app.setAttribute("aria-hidden", overlayOpen ? "true" : "false");
    document.body.style.overflow = overlayOpen ? "hidden" : "";
  }

  function toast(message) {
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    els.toasts.append(item);
    window.setTimeout(() => item.remove(), 2600);
  }

  function resetCreateState() {
    state.create = { step: 1, title: "", description: "", tags: "", icon: "P", color: projectColors[0], groupIds: [] };
  }

  function validateCreateStep() {
    if (state.create.step === 1 && (!state.create.title.trim() || !state.create.description.trim())) {
      toast("请填写项目名称和项目说明");
      return false;
    }
    if (state.create.step === 2 && !state.create.groupIds.length) {
      toast("请至少选择一个项目群");
      return false;
    }
    return true;
  }

  function submitCreateProject() {
    if (!validateCreateStep()) return;
    let id = slugify(state.create.title);
    if (state.projects.some((project) => project.id === id)) id = `${id}-${Date.now()}`;
    const project = {
      id,
      icon: state.create.icon,
      color: state.create.color,
      title: state.create.title.trim(),
      description: state.create.description.trim(),
      tags: createTags(state.create.tags),
      groupIds: [...state.create.groupIds],
      status: "准备同步",
      people: state.create.groupIds.length,
      resources: [],
      updated: "刚刚"
    };
    state.projects.unshift(project);
    persistProjects();
    state.modal = null;
    resetCreateState();
    state.currentProjectId = project.id;
    state.view = "detail";
    history.pushState({ projectId: project.id }, "", `#project/${encodeURIComponent(project.id)}`);
    render();
    toast("项目空间已创建");
  }

  function handleClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) {
      if (state.menuOpen && !event.target.closest(".detail-actions")) {
        state.menuOpen = false;
        renderDetail();
      }
      return;
    }
    event.preventDefault();
    const action = button.dataset.action;
    if ((action === "close-modal" || action === "close-drawer") && event.target.closest("[data-dialog]") && button.classList.contains("modal-overlay")) return;

    const actions = {
      "show-projects": () => showProjects(),
      "open-project": () => openProject(button.dataset.projectId),
      "open-create": () => { resetCreateState(); openModal("create"); },
      "open-search": () => {
        if (state.view !== "projects") showProjects();
        requestAnimationFrame(() => document.querySelector("#project-search")?.focus());
      },
      "open-recent": () => {
        const first = state.currentProjectId || state.projects[0]?.id;
        if (first) openProject(first);
        requestAnimationFrame(() => document.querySelector("#timeline-title")?.scrollIntoView({ behavior: "smooth", block: "start" }));
      },
      "toggle-project-menu": () => { state.menuOpen = !state.menuOpen; renderDetail(); },
      "open-edit-project": () => openModal("edit-project"),
      "open-manage-groups": () => openModal("groups"),
      "open-add-resource": () => openModal("add-resource"),
      "open-edit-focus": () => openModal("focus"),
      "close-modal": closeModal,
      "close-drawer": closeDrawer,
      "create-next": () => { if (validateCreateStep()) { state.create.step += 1; renderModal(); } },
      "create-prev": () => { state.create.step -= 1; renderModal(); },
      "create-submit": submitCreateProject,
      "toggle-create-group": () => {
        const id = button.dataset.groupId;
        state.create.groupIds = state.create.groupIds.includes(id)
          ? state.create.groupIds.filter((groupId) => groupId !== id)
          : [...state.create.groupIds, id];
        renderModal();
      },
      "select-create-icon": () => { state.create.icon = button.dataset.icon; state.create.color = button.dataset.color; renderModal(); },
      "set-detail-tab": () => { state.detailTab = button.dataset.tab; state.menuOpen = false; renderDetail(); },
      "set-stat-range": () => { state.statRange = button.dataset.range; renderDetail(); },
      "open-resource": () => openDrawer(button.dataset.resourceId),
      "open-original": () => toast("这是离线复现 Demo，原始业务系统链接未接入"),
      "duplicate-project": () => {
        const source = currentProject();
        const copy = structuredClone(source);
        copy.id = `${source.id}-copy-${Date.now()}`;
        copy.title = `${source.title}（副本）`;
        copy.updated = "刚刚";
        state.projects.unshift(copy);
        persistProjects();
        state.currentProjectId = copy.id;
        state.menuOpen = false;
        history.pushState({ projectId: copy.id }, "", `#project/${encodeURIComponent(copy.id)}`);
        render();
        toast("项目副本已创建");
      }
    };
    actions[action]?.();
  }

  function handleInput(event) {
    const target = event.target;
    if (target.id === "project-search") {
      state.projectSearch = target.value;
      const position = target.selectionStart;
      renderProjects();
      const next = document.querySelector("#project-search");
      next?.focus({ preventScroll: true });
      next?.setSelectionRange(position, position);
    }
    if (target.id === "resource-search") {
      state.resourceSearch = target.value;
      const position = target.selectionStart;
      renderDetail();
      const next = document.querySelector("#resource-search");
      next?.focus({ preventScroll: true });
      next?.setSelectionRange(position, position);
    }
    if (target.matches("[data-create-field]")) {
      state.create[target.dataset.createField] = target.value;
      const previewTitle = els.modal.querySelector('[data-create-preview="title"]');
      const previewDescription = els.modal.querySelector('[data-create-preview="description"]');
      const previewTags = els.modal.querySelector('[data-create-preview="tags"]');
      if (previewTitle) previewTitle.textContent = state.create.title || "未命名项目";
      if (previewDescription) previewDescription.textContent = state.create.description || "项目说明会显示在这里。";
      if (previewTags) previewTags.innerHTML = createTags(state.create.tags).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("") || '<span class="tag">项目标签</span>';
      const hint = target.closest(".field")?.querySelector(".field-hint");
      if (hint && target.dataset.createField === "description") hint.textContent = `${target.value.length} / 160`;
    }
  }

  function handleChange(event) {
    const target = event.target;
    if (target.matches("[data-create-group]")) {
      const id = target.dataset.createGroup;
      if (target.checked && !state.create.groupIds.includes(id)) state.create.groupIds.push(id);
      if (!target.checked) state.create.groupIds = state.create.groupIds.filter((groupId) => groupId !== id);
    }
    if (target.id === "resource-type") {
      state.resourceType = target.value;
      renderDetail();
    }
    if (target.id === "resource-sort") {
      state.resourceSort = target.value;
      renderDetail();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const project = currentProject();
    if (form.id === "edit-project-form") {
      project.title = String(data.get("title")).trim();
      project.description = String(data.get("description")).trim();
      project.tags = createTags(data.get("tags"));
      project.updated = "刚刚";
      persistProjects();
      closeModal();
      toast("项目信息已更新");
    }
    if (form.id === "groups-form") {
      project.groupIds = data.getAll("group");
      persistProjects();
      closeModal();
      toast("项目群组已更新");
    }
    if (form.id === "add-resource-form") {
      const type = String(data.get("type"));
      const resource = {
        id: `${slugify(data.get("title"))}-${Date.now()}`,
        type,
        typeLabel: { doc: "知识库文档", meeting: "会议", card: "iCafe 卡片", code: "代码库", link: "外部链接" }[type],
        title: String(data.get("title")).trim(),
        summary: String(data.get("summary")).trim(),
        source: String(data.get("source")).trim(),
        owner: String(data.get("owner")).trim(),
        date: "刚刚",
        updatedAt: "刚刚",
        tags: createTags(data.get("tags")),
        content: String(data.get("summary")).trim()
      };
      project.resources.unshift(resource);
      project.updated = "刚刚";
      if (project.focus) project.focus.pinned = [resource.id, ...project.focus.pinned].slice(0, 5);
      persistProjects();
      closeModal();
      state.detailTab = "resources";
      renderDetail();
      toast("资料已添加到项目空间");
    }
    if (form.id === "focus-form") {
      project.focus = {
        title: String(data.get("title")).trim(),
        copy: String(data.get("copy")).trim(),
        tags: String(data.get("tags")).split(/[，,]/).map((tag) => tag.trim()).filter(Boolean).slice(0, 8),
        pinned: data.getAll("pinned").slice(0, 5)
      };
      persistProjects();
      closeModal();
      toast("Project Focus 已更新");
    }
  }

  function handleKeydown(event) {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".project-card[data-project-id]")) {
      event.preventDefault();
      openProject(event.target.dataset.projectId);
      return;
    }
    if (event.key === "Escape") {
      if (state.drawerResourceId) closeDrawer();
      else if (state.modal) closeModal();
      else if (state.menuOpen) { state.menuOpen = false; renderDetail(); }
    }
    if (event.key === "Tab" && (state.modal || state.drawerResourceId)) {
      const root = state.modal ? els.modal : els.drawer;
      const focusable = [...root.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [href]')].filter((item) => item.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  function syncFromHash() {
    const match = location.hash.match(/^#project\/(.+)$/);
    const id = match ? decodeURIComponent(match[1]) : null;
    if (id && state.projects.some((project) => project.id === id)) {
      state.currentProjectId = id;
      state.view = "detail";
    } else {
      state.currentProjectId = null;
      state.view = "projects";
    }
    state.modal = null;
    state.drawerResourceId = null;
    render();
  }

  document.addEventListener("click", handleClick);
  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleChange);
  document.addEventListener("submit", handleSubmit);
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("popstate", syncFromHash);

  syncFromHash();
})();
