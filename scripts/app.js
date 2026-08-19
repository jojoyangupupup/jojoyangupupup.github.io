import {
  OVERVIEW_IMAGE,
  OVERVIEW_SIZE,
  PAGE_NAVIGATION,
  PORTFOLIO,
  ROOMS,
  SHOW_HOTSPOTS,
  adjacentPages,
  roomFromPath,
} from "/scripts/rooms-data.js?v=85";

const FOCUS_TIMING = {
  expandStart: 80,
  crossfadeStart: 300,
  detailStart: 700,
  total: 950,
};
const REDUCED_FOCUS_TIMING = { crossfadeStart: 30, detailStart: 110, total: 200 };
const ROOM_SWITCH_MS = 300;
const DISCOVERY_STORAGE_KEY = "portfolio-discovered-items-v1";
const DOORSTEP_PROFILE = {
  displayName: "JoJo",
  email: "15945158337@163.com",
  wechat: "ledwechat15945158337",
  bilibiliUrl: "https://space.bilibili.com/702930217",
  resumeUrl: "/assets/resume.pdf",
  portraitUrl: "/assets/rooms/doorstep-personal.jpg",
};
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const showHotspots = SHOW_HOTSPOTS || new URLSearchParams(window.location.search).has("debug-hotspots");

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="portfolio-shell">
    <header class="site-header" data-locked="false">
      <a class="site-wordmark" href="/" aria-label="${PORTFOLIO.authorName}，返回首页">
        <span class="wordmark-mark" aria-hidden="true"></span>
        <span>${PORTFOLIO.authorName}</span>
      </a>
      <nav class="top-navigation" aria-label="主要导航">
        <ul class="top-navigation-list">
          ${PAGE_NAVIGATION.map((item) => `
              <li>
                <a class="top-navigation-link" href="${item.path}" data-page-id="${item.id}"${item.roomId ? ` data-room-id="${item.roomId}"` : ""}>
                  ${item.label}
                </a>
              </li>
            `).join("")}
        </ul>
      </nav>
    </header>

    <main class="portfolio-main" data-page="overview">
      <section class="visual-column" aria-label="Room visual">
        <div class="visual-frame">
          <div class="visual-stage${showHotspots ? " show-hotspots" : ""}" data-view="overview" data-show-hotspots="${showHotspots}">
            <img class="visual-layer visual-layer-current" width="${OVERVIEW_SIZE.width}" height="${OVERVIEW_SIZE.height}" src="${OVERVIEW_IMAGE}" alt="Isometric overview of four portfolio categories: garden, kitchen, living room, and study" fetchpriority="high">
            <svg class="focus-room-layer" viewBox="0 0 ${OVERVIEW_SIZE.width} ${OVERVIEW_SIZE.height}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <clipPath id="selected-room-clip">
                  <path class="focus-clip-path"></path>
                </clipPath>
              </defs>
              <image href="${OVERVIEW_IMAGE}" width="${OVERVIEW_SIZE.width}" height="${OVERVIEW_SIZE.height}" preserveAspectRatio="xMidYMid meet" clip-path="url(#selected-room-clip)"></image>
            </svg>
            <img class="visual-layer visual-layer-incoming" width="${OVERVIEW_SIZE.width}" height="${OVERVIEW_SIZE.height}" src="${OVERVIEW_IMAGE}" alt="" aria-hidden="true">
            <svg class="hotspot-map" viewBox="0 0 ${OVERVIEW_SIZE.width} ${OVERVIEW_SIZE.height}" preserveAspectRatio="xMidYMid meet" aria-label="Clickable portfolio category areas">
              ${ROOMS.map((room, index) => `
                <path class="hotspot hotspot-${index + 1}" tabindex="0" role="link" data-room-id="${room.id}" aria-label="Enter ${room.title} portfolio category" d="${room.hotspotPath}"></path>
                <circle class="hotspot-center hotspot-center-${index + 1}" cx="${room.hotspotCenter.x}" cy="${room.hotspotCenter.y}" r="16" aria-hidden="true"></circle>
              `).join("")}
            </svg>
            <svg class="room-object-map" viewBox="0 0 2048 2048" preserveAspectRatio="xMidYMid meet" aria-label="Clickable room objects">
              <defs>
                <filter id="room-object-edge-glow" x="-30%" y="-45%" width="160%" height="190%" color-interpolation-filters="sRGB">
                  <feMorphology in="SourceAlpha" operator="dilate" radius="10" result="outer-edge"></feMorphology>
                  <feMorphology in="SourceAlpha" operator="erode" radius="2" result="inner-edge"></feMorphology>
                  <feComposite in="outer-edge" in2="inner-edge" operator="out" result="edge"></feComposite>
                  <feGaussianBlur in="edge" stdDeviation="10" result="soft-edge"></feGaussianBlur>
                  <feFlood flood-color="#efb45f" flood-opacity="0.82" result="soft-color"></feFlood>
                  <feComposite in="soft-color" in2="soft-edge" operator="in" result="soft-glow"></feComposite>
                  <feFlood flood-color="#fff7df" flood-opacity="0.96" result="line-color"></feFlood>
                  <feComposite in="line-color" in2="edge" operator="in" result="line-glow"></feComposite>
                  <feMerge>
                    <feMergeNode in="soft-glow"></feMergeNode>
                    <feMergeNode in="line-glow"></feMergeNode>
                  </feMerge>
                </filter>
                <filter id="room-object-edge-glow-tight" x="-20%" y="-25%" width="140%" height="150%" color-interpolation-filters="sRGB">
                  <feMorphology in="SourceAlpha" operator="dilate" radius="8" result="outer-edge"></feMorphology>
                  <feMorphology in="SourceAlpha" operator="erode" radius="1" result="inner-edge"></feMorphology>
                  <feComposite in="outer-edge" in2="inner-edge" operator="out" result="edge"></feComposite>
                  <feGaussianBlur in="edge" stdDeviation="5" result="soft-edge"></feGaussianBlur>
                  <feFlood flood-color="#efb45f" flood-opacity="0.66" result="soft-color"></feFlood>
                  <feComposite in="soft-color" in2="soft-edge" operator="in" result="soft-glow"></feComposite>
                  <feFlood flood-color="#fff7df" flood-opacity="0.94" result="line-color"></feFlood>
                  <feComposite in="line-color" in2="edge" operator="in" result="line-glow"></feComposite>
                  <feMerge>
                    <feMergeNode in="soft-glow"></feMergeNode>
                    <feMergeNode in="line-glow"></feMergeNode>
                  </feMerge>
                </filter>
              </defs>
              ${ROOMS.flatMap((room) => (room.objectHotspots || []).map((object) => `
                <g class="room-object-group" data-room-id="${room.id}">
                  <path
                    class="room-object-hotspot"
                    tabindex="0"
                    role="button"
                    data-room-id="${room.id}"
                    data-object-id="${object.id}"
                    aria-label="${object.ariaLabel || `Open ${object.label}${object.documentIds?.length > 1 ? " and related documents" : " document"}`}"
                    d="${object.path}"
                  ></path>
                  ${object.glowPath ? `
                    <path
                      class="room-object-glow"
                      data-room-id="${room.id}"
                      data-object-id="${object.id}"
                      d="${object.glowPath}"
                      fill="#ffffff"
                      aria-hidden="true"
                    ></path>
                  ` : object.glowImage ? `
                    <image
                      class="room-object-glow"
                      data-room-id="${room.id}"
                      data-object-id="${object.id}"
                      href="${object.glowImage.file}"
                      x="${object.glowImage.x}"
                      y="${object.glowImage.y}"
                      width="${object.glowImage.width}"
                      height="${object.glowImage.height}"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    ></image>
                  ` : ""}
                </g>
              `)).join("")}
            </svg>
            <div class="doorstep-hotspot-layer" aria-label="门廊联系方式">
              <a class="doorstep-hotspot is-bilibili" href="${DOORSTEP_PROFILE.bilibiliUrl}" target="_blank" rel="noopener noreferrer" aria-label="打开 JoJo 的 B 站主页，新窗口打开">
                <span role="tooltip">打开 B 站主页</span>
              </a>
              <button class="doorstep-hotspot is-resume" type="button" data-download-resume aria-label="下载简历 PDF">
                <span role="tooltip">下载简历</span>
              </button>
              <button class="doorstep-hotspot is-wechat" type="button" data-copy-wechat aria-label="复制微信号 ${DOORSTEP_PROFILE.wechat}">
                <span role="tooltip">复制微信号</span>
              </button>
              <button class="doorstep-hotspot is-email" type="button" data-copy-email aria-label="复制邮箱 ${DOORSTEP_PROFILE.email}">
                <span role="tooltip">复制邮箱</span>
              </button>
            </div>
          </div>

        </div>

          <nav class="room-switch-controls" aria-label="Adjacent portfolio pages" hidden>
            <button class="room-switch-button room-switch-previous" type="button" data-direction="previous">
              <svg class="room-switch-icon" viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
                <path d="M22 14H6M12 8l-6 6 6 6"></path>
              </svg>
            </button>
            <button class="room-switch-button room-switch-next" type="button" data-direction="next">
              <svg class="room-switch-icon" viewBox="0 0 28 28" width="28" height="28" aria-hidden="true">
                <path d="M6 14h16M16 8l6 6-6 6"></path>
              </svg>
            </button>
          </nav>
      </section>

      <aside class="room-detail" aria-live="polite" aria-label="Portfolio category details"></aside>
    </main>

    <div class="document-modal" hidden aria-hidden="true">
      <div class="document-modal-backdrop" data-document-close aria-hidden="true"></div>
      <section class="document-modal-dialog" role="dialog" aria-modal="true" aria-label="Document">
        <button class="document-modal-close" type="button" data-document-close aria-label="Close document">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19"></path>
          </svg>
        </button>
        <div class="document-modal-scroll" tabindex="0">
          <div class="document-pages" role="document"></div>
        </div>
      </section>
    </div>
  </div>
`;

const header = document.querySelector(".site-header");
const wordmark = document.querySelector(".site-wordmark");
const wordmarkName = document.querySelector(".site-wordmark > span:last-child");
const portfolioMain = document.querySelector(".portfolio-main");
const stage = document.querySelector(".visual-stage");
const currentImage = document.querySelector(".visual-layer-current");
const incomingImage = document.querySelector(".visual-layer-incoming");
const focusClipPath = document.querySelector(".focus-clip-path");
const detail = document.querySelector(".room-detail");
const roomSwitchControls = document.querySelector(".room-switch-controls");
const previousButton = document.querySelector(".room-switch-previous");
const nextButton = document.querySelector(".room-switch-next");
const navLinks = [...document.querySelectorAll(".top-navigation-link")];
const hotspots = [...document.querySelectorAll(".hotspot")];
const roomObjectHotspots = [...document.querySelectorAll(".room-object-hotspot")];
const visualControlButtons = [previousButton, nextButton];
const documentModal = document.querySelector(".document-modal");
const documentModalDialog = document.querySelector(".document-modal-dialog");
const documentModalScroll = document.querySelector(".document-modal-scroll");
const documentPages = document.querySelector(".document-pages");
const documentModalClose = document.querySelector(".document-modal-close");

const initialRoom = roomFromPath(window.location.pathname);
let currentPageId = "overview";
let transitioning = false;
let historySyncPending = false;
let documentReturnFocus = null;
let activeModalDocuments = [];
let documentModalHistory = [];
let workIntroObserver = null;
let workIntroSetupFrame = 0;
let discoveredItems = loadDiscoveredItems();

function syncBranding() {
  if (wordmarkName.textContent !== PORTFOLIO.authorName) wordmarkName.textContent = PORTFOLIO.authorName;
  wordmark.setAttribute("aria-label", `${PORTFOLIO.authorName}，返回首页`);
}

syncBranding();
new MutationObserver(syncBranding).observe(wordmarkName, { childList: true, characterData: true, subtree: true });

function wait(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function preloadImage(src) {
  if (!preloadImage.cache.has(src)) preloadImage.cache.set(src, new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  }));
  return preloadImage.cache.get(src);
}
preloadImage.cache = new Map();

function warmRoomImage(id) {
  const room = ROOMS.find((item) => item.id === id);
  if (room) preloadImage(room.image);
}

function warmRoomDocuments(id) {
  const room = ROOMS.find((item) => item.id === id);
  (room?.documents || []).forEach((documentEntry) => {
    if (documentEntry.renderedPages) preloadImage(renderedDocumentPage(documentEntry, 1));
    if (documentEntry.workIntro?.coverImage) preloadImage(documentEntry.workIntro.coverImage);
  });
}

function directoryRooms() {
  return PAGE_NAVIGATION
    .filter((page) => page.type === "room")
    .map((page) => ({ page, room: ROOMS.find((room) => room.id === page.roomId) }))
    .filter(({ room }) => room);
}

function discoveryKey(roomId, objectId) {
  return `${roomId}:${objectId}`;
}

function configuredDiscoveryKeys() {
  return new Set(directoryRooms().flatMap(({ room }) =>
    (room.objectHotspots || []).map((object) => discoveryKey(room.id, object.id))));
}

function loadDiscoveredItems() {
  try {
    const configured = configuredDiscoveryKeys();
    const stored = JSON.parse(window.localStorage.getItem(DISCOVERY_STORAGE_KEY) || "[]");
    return new Set(Array.isArray(stored) ? stored.filter((key) => configured.has(key)) : []);
  } catch {
    return new Set();
  }
}

function saveDiscoveredItems() {
  try {
    window.localStorage.setItem(DISCOVERY_STORAGE_KEY, JSON.stringify([...discoveredItems]));
  } catch {
    // Discovery still works for the current page when storage is unavailable.
  }
}

function roomProgress(room) {
  const objects = room.objectHotspots || [];
  return {
    total: objects.length,
    viewed: objects.filter((object) => discoveredItems.has(discoveryKey(room.id, object.id))).length,
  };
}

function directoryThumbnail(item, size = "room") {
  const image = item.directoryImage;
  return `
    <span class="directory-thumb directory-thumb-${size}" aria-hidden="true">
      ${image ? `<img src="${image}" alt="" loading="lazy" decoding="async">` : ""}
    </span>
  `;
}

function roomProgressLabel(viewed, total) {
  if (total > 0 && viewed === total) return "COMPLETE";
  return `${String(viewed).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
}

function bindDirectoryInteractions() {
  detail.querySelectorAll("[data-directory-room]").forEach((row) => {
    const roomId = row.dataset.roomId;
    const activate = () => {
      setDirectoryRoomHighlight(roomId, true);
      warmRoomImage(roomId);
    };
    const deactivate = () => {
      if (document.activeElement !== row) setDirectoryRoomHighlight(roomId, false);
    };
    row.addEventListener("pointerenter", activate);
    row.addEventListener("pointerleave", deactivate);
    row.addEventListener("focus", activate);
    row.addEventListener("blur", () => setDirectoryRoomHighlight(roomId, false));
    row.addEventListener("click", () => navigateToRoom(roomId, undefined, "overview-directory"));
  });

  detail.querySelectorAll("[data-directory-object]").forEach((row) => {
    const { roomId, objectId } = row.dataset;
    const activate = () => {
      setDirectoryObjectHighlight(roomId, objectId, true);
      warmRoomObjectDocuments(roomId, objectId);
    };
    const deactivate = () => {
      if (document.activeElement !== row) setDirectoryObjectHighlight(roomId, objectId, false);
    };
    row.addEventListener("pointerenter", activate);
    row.addEventListener("pointerleave", deactivate);
    row.addEventListener("focus", activate);
    row.addEventListener("blur", () => setDirectoryObjectHighlight(roomId, objectId, false));
    row.addEventListener("click", () => openRoomObject(roomId, objectId, row));
  });
}

function renderOverviewDirectory({ entering = false } = {}) {
  const rooms = directoryRooms();
  const total = rooms.reduce((sum, { room }) => sum + roomProgress(room).total, 0);
  const viewed = rooms.reduce((sum, { room }) => sum + roomProgress(room).viewed, 0);

  detail.dataset.directoryLevel = "overview";
  detail.classList.toggle("is-level-entering", entering);
  detail.innerHTML = `
    <section class="exploration-directory overview-directory" aria-labelledby="archive-heading">
      <header class="exploration-header">
        <p class="exploration-kicker">House Archive</p>
        <h1 class="exploration-title" id="archive-heading" tabindex="-1">小屋作品档案</h1>
        <p class="exploration-intro">这间小屋收藏了 <strong data-directory-total>${total}</strong> 件作品。<br>它们没有挂在墙上，而是藏进了日常物件里。</p>
        <p class="exploration-prompt">选择一间房，开始寻找。</p>
      </header>
      <ol class="directory-list room-directory-list">
        ${rooms.map(({ page, room }, index) => {
          const progress = roomProgress(room);
          const status = roomProgressLabel(progress.viewed, progress.total);
          return `
            <li>
              <button
                class="directory-row room-directory-row${status === "COMPLETE" ? " is-complete" : ""}"
                type="button"
                data-directory-room
                data-room-id="${room.id}"
                aria-label="${page.label}，已查看 ${progress.viewed} / ${progress.total}"
              >
                ${directoryThumbnail(room)}
                <span class="directory-copy">
                  <span class="directory-name-line">
                    <span class="directory-number">${String(index + 1).padStart(2, "0")}</span>
                    <span class="directory-name">${page.label}</span>
                  </span>
                  <span class="directory-meta">${page.accessibleLabel}</span>
                </span>
                <span class="directory-progress" data-room-progress>${status}</span>
              </button>
            </li>
          `;
        }).join("")}
      </ol>
      <footer class="directory-total" aria-label="总探索进度">
        <span>Discovered</span>
        <strong data-discovered-total>${String(viewed).padStart(2, "0")} / ${String(total).padStart(2, "0")}</strong>
      </footer>
    </section>
  `;
  bindDirectoryInteractions();
}

let doorstepToastTimer = 0;

function showDoorstepToast(message) {
  let toast = document.querySelector("[data-doorstep-toast]");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "doorstep-toast";
    toast.dataset.doorstepToast = "true";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }
  window.clearTimeout(doorstepToastTimer);
  toast.textContent = message;
  toast.classList.remove("is-visible");
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  doorstepToastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2000);
}

async function copyDoorstepValue(value, successMessage) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(value);
    else {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    showDoorstepToast(successMessage);
  } catch {
    showDoorstepToast("复制失败，请稍后重试");
  }
}

function bindDoorstepInteractions() {
  const bindOnce = (selector, handler) => {
    const control = document.querySelector(selector);
    if (!control || control.dataset.doorstepBound) return;
    control.dataset.doorstepBound = "true";
    control.addEventListener("click", handler);
  };
  bindOnce("[data-copy-email]", () => copyDoorstepValue(DOORSTEP_PROFILE.email, "邮箱已复制"));
  bindOnce("[data-copy-wechat]", () => copyDoorstepValue(DOORSTEP_PROFILE.wechat, "微信号已复制"));
  bindOnce("[data-download-resume]", async () => {
    try {
      const response = await fetch(DOORSTEP_PROFILE.resumeUrl, { method: "HEAD", cache: "no-store" });
      if (!response.ok) throw new Error("missing");
      const link = document.createElement("a");
      link.href = DOORSTEP_PROFILE.resumeUrl;
      link.download = "杨昕乔-简历.pdf";
      document.body.append(link);
      link.click();
      link.remove();
    } catch {
      showDoorstepToast("简历文件暂未上传");
    }
  });
}

function renderDetail(room, { entering = false } = {}) {
  document.body.classList.toggle("is-doorstep-image", Boolean(room.isDoorstep));
  if (room.isDoorstep) {
    detail.dataset.directoryLevel = "doorstep";
    detail.classList.remove("is-level-entering");
    detail.innerHTML = `
      <section class="doorstep-page" aria-labelledby="doorstep-note-title">
        <figure class="doorstep-polaroid">
          <div class="doorstep-tape" aria-hidden="true"></div>
          <img src="${DOORSTEP_PROFILE.portraitUrl}" alt="JoJo 在城市暮色中拿着手机的背影照片" width="5712" height="4284">
          <figcaption>somewhere under the evening sky</figcaption>
        </figure>
        <div class="doorstep-note" id="doorstep-note-title">
          <section class="doorstep-note-block doorstep-intro-block">
            <h1>你好，我是 JoJo</h1>
            <p class="doorstep-name">杨昕乔</p>
            <p class="doorstep-meta">东北师大 · 新传硕 24 级</p>
          </section>
          <section class="doorstep-note-block doorstep-home-block">
            <p>这间小屋是我在互联网上的家，也是我尝试过的所有事。</p>
            <p>逛到这里，说明你也愿意看到最后。<br>很高兴认识你。</p>
          </section>
          <section class="doorstep-note-block doorstep-goodbye-block">
            <p class="doorstep-thanks">谢谢你逛完这间小屋。</p>
            <p>14 件作品都在这里了——<br>客厅是兴趣、书房是学业，<br>厨房是搬运、花园是杂学。</p>
            <p class="doorstep-interest">如果你也感兴趣—— <span aria-hidden="true">⌁</span></p>
            <p class="doorstep-signoff">小屋还会继续盖，<br>欢迎回来坐坐。</p>
          </section>
        </div>
      </section>
    `;
    return;
  }
  const rooms = directoryRooms();
  const roomIndex = rooms.findIndex(({ room: item }) => item.id === room.id);
  const page = rooms[roomIndex]?.page;
  const objects = room.objectHotspots || [];
  const progress = roomProgress(room);

  detail.dataset.directoryLevel = "room";
  detail.classList.toggle("is-level-entering", entering);
  detail.innerHTML = `
    <section class="exploration-directory object-directory" aria-labelledby="room-directory-heading">
      <header class="exploration-header room-directory-header">
        <p class="exploration-kicker">${String(roomIndex + 1).padStart(2, "0")} / ${(page?.accessibleLabel || room.title).toUpperCase()}</p>
        <h1 class="detail-title exploration-title" id="room-directory-heading" tabindex="-1">${page?.label || room.title}</h1>
        <div class="room-directory-summary" aria-label="房间探索进度">
          <span>${String(progress.total).padStart(2, "0")} ITEMS</span>
          <strong data-room-viewed>${String(progress.viewed).padStart(2, "0")} VIEWED</strong>
        </div>
      </header>
      ${objects.length ? `
        <ol class="directory-list object-directory-list">
          ${objects.map((object, index) => {
            const viewed = discoveredItems.has(discoveryKey(room.id, object.id));
            return `
              <li>
                <button
                  class="directory-row object-directory-row${viewed ? " is-viewed" : ""}"
                  type="button"
                  data-directory-object
                  data-room-id="${room.id}"
                  data-object-id="${object.id}"
                  aria-label="${object.label}，${viewed ? "已查看" : "待发现"}"
                >
                  ${directoryThumbnail(object, "object")}
                  <span class="directory-copy">
                    <span class="directory-name-line">
                      <span class="directory-number">${object.number || String(index + 1).padStart(2, "0")}</span>
                      <span class="directory-name">${object.label}</span>
                    </span>
                  </span>
                  <span class="directory-item-status" data-object-status>${viewed ? "VIEWED / 已查看" : "TO FIND / 待发现"}</span>
                </button>
              </li>
            `;
          }).join("")}
        </ol>
      ` : `<p class="directory-empty">尚无作品</p>`}
      <a class="room-exit-link" href="/rooms/doorstep/">走出这间房 →</a>
    </section>
  `;
  bindDirectoryInteractions();
}

function syncDirectoryProgress() {
  const rooms = directoryRooms();
  let total = 0;
  let viewed = 0;

  rooms.forEach(({ page, room }) => {
    const progress = roomProgress(room);
    total += progress.total;
    viewed += progress.viewed;
    const roomRow = detail.querySelector(`[data-directory-room][data-room-id="${room.id}"]`);
    if (roomRow) {
      const status = roomProgressLabel(progress.viewed, progress.total);
      roomRow.querySelector("[data-room-progress]").textContent = status;
      roomRow.classList.toggle("is-complete", status === "COMPLETE");
      roomRow.setAttribute("aria-label", `${page.label}，已查看 ${progress.viewed} / ${progress.total}`);
    }
  });

  const totalProgress = detail.querySelector("[data-discovered-total]");
  if (totalProgress) totalProgress.textContent = `${String(viewed).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  const currentRoom = ROOMS.find((room) => room.id === currentPageId);
  if (!currentRoom) return;
  const currentProgress = roomProgress(currentRoom);
  const roomViewed = detail.querySelector("[data-room-viewed]");
  if (roomViewed) roomViewed.textContent = `${String(currentProgress.viewed).padStart(2, "0")} VIEWED`;
  detail.querySelectorAll("[data-directory-object]").forEach((row) => {
    const isViewed = discoveredItems.has(discoveryKey(row.dataset.roomId, row.dataset.objectId));
    row.classList.toggle("is-viewed", isViewed);
    row.querySelector("[data-object-status]").textContent = isViewed ? "VIEWED / 已查看" : "TO FIND / 待发现";
    const object = currentRoom.objectHotspots?.find((item) => item.id === row.dataset.objectId);
    if (object) row.setAttribute("aria-label", `${object.label}，${isViewed ? "已查看" : "待发现"}`);
  });
}

function markObjectDiscovered(roomId, objectId) {
  const key = discoveryKey(roomId, objectId);
  if (discoveredItems.has(key)) return;
  discoveredItems.add(key);
  saveDiscoveredItems();
  syncDirectoryProgress();
}

function getRoomObject(roomId, objectId) {
  const room = ROOMS.find((item) => item.id === roomId);
  const object = room?.objectHotspots?.find((item) => item.id === objectId);
  const documentIds = object?.documentIds || (object?.documentId ? [object.documentId] : []);
  const documents = documentIds
    .map((id) => room?.documents?.find((item) => item.id === id))
    .filter(Boolean);
  return { room, object, documents, documentEntry: documents[0] };
}

function renderedDocumentPage(documentEntry, pageNumber) {
  const { basePath, extension, version } = documentEntry.renderedPages;
  const cacheVersion = version ? `?v=${encodeURIComponent(version)}` : "";
  return `${basePath}/page-${String(pageNumber).padStart(2, "0")}.${extension}${cacheVersion}`;
}

function renderDocumentText(documentEntry) {
  const renderItems = (items) => items?.length
    ? `<ol class="document-text-list">${items.map((item) => `
        <li><strong>${item.title}</strong><span>${item.text}</span></li>
      `).join("")}</ol>`
    : "";
  const renderSection = (section, nested = false) => `
    <section class="document-text-section${nested ? " document-text-subsection" : ""}">
      <h3>${section.heading}</h3>
      ${(section.paragraphs || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
      ${section.plainItems && section.items?.length
        ? `<div class="document-text-list document-text-list-plain">${section.items.map((item) => `<div><strong>${item.title}</strong><span>${item.text}</span></div>`).join("")}</div>`
        : renderItems(section.items)}
      ${(section.paragraphsAfter || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
      ${(section.subsections || []).map((subsection) => renderSection(subsection, true)).join("")}
      ${section.note ? `<p class="document-text-note">${section.note}</p>` : ""}
    </section>
  `;
  return (documentEntry.textSections || []).map((section) => renderSection(section)).join("");
}

function renderBilibiliExperience() {
  const directions = ["烹饪 / 美食|★★", "烘焙|★★", "生活 / Vlog|★★★", "学习|★★★★", "时尚 / 穿搭|★★★", "室内设计 / 装修|★★", "收纳整理|★★", "咖啡 / 茶饮|★★", "植物 / 园艺|★★", "读书 / 文具|★★★"];
  const languages = [["英语", 60, "主力来源"], ["日语", 22, "稳定补充"], ["韩语", 10, "场景扩展"], ["其他", 8, "少量测试"]];
  const steps = ["YouTube 拿链接", "引力去水印下载", "必剪语音转文字", "B站双版本发布", "命名 + 标签 + 发布", "评论区翻译热评"];
  return `<article class="bilibili-experience" aria-labelledby="bilibili-title">
    <header class="bili-profile-card"><p class="bili-kicker">B 站 UP 主 · 自述档案 · v1 预览</p><div class="bili-hero-grid"><div class="bili-identity"><h2 id="bilibili-title">楊桃寶Jo</h2><p class="bili-role">B站 UP 主 / 半自动化单人运营</p><a class="bili-profile-id" href="https://space.bilibili.com/702930217" target="_blank" rel="noreferrer">702930217</a></div><a class="bili-profile-image-link" href="https://space.bilibili.com/702930217" target="_blank" rel="noreferrer" aria-label="访问楊桃寶Jo的B站主页"><img src="/assets/works/bilibili-profile-header.png" alt="楊桃寶Jo的B站主页与视频内容概览"></a></div><p class="bili-intro">我是一个长期实践<strong>YouTube 视频搬运到 B 站</strong>的 UP 主：选题从 YouTube 来，加工在剪映里完成，<strong>内容覆盖学习、烹饪、生活、装修设计四个方向</strong>，主要靠<strong>主页小铺和平台流量分成</strong>过活。</p><div class="bili-meta"><span>数据观测日<strong>2026-08-10 · B站 API 实测</strong></span><span>所属分区<strong>知识 · 生活 · 美食 · 家居</strong></span><span>运营模式<strong>半自动化 · 单人独立运营</strong></span></div></header>
    <section class="bili-section"><div class="bili-section-heading"><span>01</span><h3>核心数据</h3><em>ACCOUNT SNAPSHOT</em></div><div class="bili-stat-grid"><div><small>FOLLOWERS</small><strong>3,900</strong><p>粉丝数</p></div><div><small>投稿</small><strong>796</strong><p>累计投稿</p></div><div><small>获赞数</small><strong>2.0 万</strong><p>内容累计获赞</p></div><div><small>播放数</small><strong>50.0 万</strong><p>内容累计播放</p></div></div></section>
    <section class="bili-section"><div class="bili-section-heading"><span>02</span><h3>我的内容方向</h3><em>CONTENT MIX</em></div><p class="bili-subtitle">不是什么都做，是“杂食策略”——用宽内容面覆盖更多兴趣人群，再通过系列化让他们沉淀。</p><div class="bili-direction-grid">${directions.map(item => { const [label, stars] = item.split("|"); return `<div><strong>${label}</strong><span>受欢迎指数 <b>${stars}</b></span></div>`; }).join("")}</div><div class="bili-highlight-grid"><div><b>半自动化</b><p>6 阶段流水线把“体力活”压到 30 分钟，剩下时间留给加工。</p></div><div><b>从“找选题”到“挑选题”</b><p>博主图鉴让选品不再从 0 开始，而是在已知候选池里做判断。</p></div></div><div class="bili-blogger-entry"><div><small>REAL-TIME SOURCE LIBRARY</small><h4>三、博主图鉴（实时选品系统）</h4><p>这是账号的“原料仓”：每一个考虑搬运的 YouTube 博主都有一张卡片收进图鉴。</p><div><span>图鉴覆盖博主数 20 个</span><span>每周扫描约 1.5 小时</span><span>命中率约 1%</span></div></div><a href="#blogger-book" class="bili-entry-button">查看博主图鉴 →</a></div></section>
    <section class="bili-section"><div class="bili-section-heading"><span>03</span><h3>我搬运的语种</h3><em>LANGUAGE MIX</em></div><p class="bili-subtitle">原视频主要语言 + 翻译方式</p><div class="bili-language-bars">${languages.map(([label, value, note]) => `<div><label>${label}<b>${value}%</b></label><span><i style="width:${value}%"></i></span><small>${note}</small></div>`).join("")}</div><p class="bili-footnote">所有非中文视频统一加中文字幕 + 中文配音旁白。</p></section>
    <section class="bili-section"><div class="bili-section-heading"><span>04</span><h3>我的搬运 Skill：6 步流程</h3><em>WORKFLOW</em></div><div class="bili-flow">${steps.map((step, i) => `<div><b>STAGE ${String(i + 1).padStart(2, "0")}</b><strong>${step}</strong><small>${["选博主，确认风格契合", "下载无水印 mp4", "生成 SRT，删中文片段", "全英字幕 / 无字幕", "标题、标签、合集", "翻译点赞最高 3-5 条"][i]}</small></div>${i < steps.length - 1 ? "<span>→</span>" : ""}`).join("")}</div><div class="bili-step-list">${["选题：打开 YouTube 选博主，找最新一条，确认风格契合。", "下载原片：YouTube 分享 → 引力去水印小程序 → 下载无水印 mp4。", "抽字幕：必剪语音转文字生成 SRT，手工删中文片段和引导语。", "加工剪映：删寒暄、sponsor、订阅引导，12 分钟压到 6-8 分钟并重做封面。", "B站双版本发布：英文 + 中文字幕 / 纯英文练听力，按学习、生活、烹饪时段发布。", "评论翻译：翻译原视频点赞最高 3-5 条评论，带来真实感和内容增量。"] .map((text, i) => `<p><b>Step ${i + 1}</b>${text}</p>`).join("")}</div><blockquote>6 步流程跑得顺，但选品依然靠人——博主图鉴是“原料仓”，最后 1% 的判断要靠眼睛和审美。</blockquote></section>
    <section class="bili-section"><div class="bili-section-heading"><span>05</span><h3>我的自研 Skill：一条命令完成搬运</h3><em>TECH STACK</em></div><p class="bili-copy">手动跑下载、抽音频、转字幕、抽帧、翻译和整理素材包耗时过久，目前实践把前 5 步串成流水线，初步验证 10 条视频从 YouTube 链接到剪映素材包，人工只需要 30 分钟。</p><div class="bili-tool-flow"><span>STAGE 01 下载视频<small>yt-dlp · 1080p</small></span><i>→</i><span>STAGE 02 抽音频<small>ffmpeg</small></span><i>→</i><span>STAGE 03 Whisper 转字幕<small>whisper-local</small></span><i>→</i><span>STAGE 04 抽关键帧<small>ffmpeg · 1/4 1/2 3/4</small></span><i>→</i><span>STAGE 05 Claude 翻译<small>Claude 3.5 Sonnet</small></span><i>→</i><span>STAGE 06 整理输出<small>→ 剪映素材包</small></span></div><p class="bili-footnote">整套工具已通过冒烟测试，覆盖视频不可用、API 失败、依赖缺失、网络中断四种场景，一个人也能稳定周更 2-3 期。</p></section>
    <section class="bili-section"><div class="bili-section-heading"><span>06</span><h3>怎么把流量变成收入</h3><em>MONETIZATION</em></div><div class="bili-income-grid"><div><h4>主页小铺：内容驱动的精准选品</h4><p>不是无脑挂车，小铺只卖和内容强相关的品类：烹饪挂厨具，装修挂家居好物，学习挂书和文具。购买决策是被内容说服，而不是被广告打扰。</p><small>SKU 不超过 10 个 · 每月上新不超过 2 个 · 下架超过 30 天没动的品</small></div><div><h4>平台流量分成：稳定但不可控</h4><p>创作激励、视频带货分账和充电分成占比不大但稳定，把它当作被动收入，不为它单独优化选题。</p><small>流量分成的钱收着，但不做 KPI；小铺的钱挣着，每月看复购率</small></div></div><div class="bili-income-table"><div>内容方向</div><div>对应品类</div><div>选品原则</div><div>烹饪 / 烘焙</div><div>厨具 / 食材 / 工具</div><div>出镜同款 &gt; 同类爆款</div><div>学习 / 读书</div><div>书 / 文具</div><div>引用过的资料 &gt; 同主题</div><div>生活 / Vlog</div><div>收纳 / 极简单品</div><div>视频里实际用过的</div></div></section>
    <section class="bili-section"><div class="bili-section-heading"><span>07</span><h3>账号规划</h3><em>ROADMAP</em></div><div class="bili-roadmap"><article><small>短期 · 1-2 个月</small><h4>试水 B 站直播</h4><ul><li>每周 1 次，直播投屏 YouTube 博主的视频，观众陪我看。</li><li>看的就是接下来要搬运的备选，看完再决定搬不搬。</li><li>不带货，不开广告。</li></ul></article><article><small>中期 · 3-6 个月</small><h4>开放“一条命令搬运”工具</h4><p>把脚本做成一个开放给其他 UP 主的小工具。我自己用得顺了，下一步是让和我一样做搬运的同行也能用。</p></article><article><small>长期 · 6-12 个月</small><h4>从内容运营到运营工具</h4><ul><li>把博主图鉴 + 搬运 Skill 整理成可复用工具。</li><li>让同类内容运营者也能使用。</li><li>判断依据：我自己用得顺了，下一步是让别人也能用。</li></ul><p>从“内容运营”到“运营工具”，可能是这个账号未来两年最大的想象空间。</p></article></div></section>
  </article>`;
}

function renderMemoryExperienceLegacy(documentEntry) {
  const memory = documentEntry.memory;
  return `
    <article class="memory-experience" aria-labelledby="memory-title-${documentEntry.id}">
      <section class="memory-section memory-header">
        <div>
          <p class="memory-index">${memory.index}</p>
          <h2 id="memory-title-${documentEntry.id}">${memory.title}</h2>
        </div>
        <div class="memory-header-meta"><p>${memory.meta}</p><p>${memory.tagline}</p></div>
        <p class="memory-intro">${memory.intro}</p>
      </section>
      <section class="memory-section memory-flow" aria-labelledby="memory-flow-title">
        <h3 id="memory-flow-title">01 · KNOWLEDGE FLOW</h3>
        <div class="memory-flow-track">
          <div class="memory-flow-object memory-documents" aria-label="文档、周报、会议纪要">
            <span></span><span></span><span></span><p>文档 / 周报 / 会议纪要</p>
          </div>
          <div class="memory-flow-line" aria-hidden="true"></div>
          <div class="memory-flow-object memory-engine" aria-label="AI 知识加工台"><i></i><p>AI 知识加工台</p></div>
          <div class="memory-flow-line" aria-hidden="true"></div>
          <div class="memory-flow-object memory-results" aria-label="PPT、信息图、总结、播客">
            <span>PPT</span><span>信息图</span><span>总结</span><span>播客</span><p>PPT / 信息图 / 总结 / 播客</p>
          </div>
        </div>
      </section>
      <section class="memory-section memory-practice">
        <div><h3>02 · ITERATION</h3><div class="memory-stamps">${memory.iteration.map((item) => `<span>${item}</span>`).join("")}</div></div>
        <div><h3>03 · OPERATIONS</h3><div class="memory-nodes">${memory.operations.map((item, index) => `<span class="${index === 0 ? "is-active" : ""}" tabindex="0">${item}</span>`).join("")}</div></div>
      </section>
      <section class="memory-section memory-metrics" aria-labelledby="memory-metrics-title">
        <h3 id="memory-metrics-title">04 · CORE METRICS</h3>
        <div class="memory-metric-grid">${memory.metrics.map((metric) => `<div class="memory-metric"><strong data-memory-number data-value="${metric.numeric}" data-prefix="${metric.prefix || ""}" data-suffix="${metric.suffix || ""}" data-decimals="${metric.decimals || 0}">0</strong><span>${metric.label}</span></div>`).join("")}</div>
        <div class="memory-funnel">${memory.funnel.map((item, index) => `<div class="memory-funnel-stage" style="--funnel-height:${[100, 77, 41][index]}%;--funnel-delay:${index * 250}ms"><div></div><p><span>${item.stage}</span><strong>${item.count}</strong><em>${item.rate}</em></p></div>`).join("")}</div>
      </section>
      <section class="memory-section memory-bars" aria-labelledby="memory-bars-title">
        <h3 id="memory-bars-title">05 · TASK DISTRIBUTION</h3>
        <div>${memory.bars.map((bar) => `<div class="memory-bar-row${bar.highlight ? " is-highlighted" : ""}" tabindex="0"><i><span style="--bar-width:${bar.percent}%"></span></i><strong>${bar.label}</strong><em>${bar.percent}%</em><small>${bar.delta}</small></div>`).join("")}</div>
      </section>
    </article>
  `;
}

function renderMemoryExperience(documentEntry) {
  const memory = documentEntry.memory;
  const highlightBody = (body) => memory.highlights.reduce((text, value) => text.replaceAll(value, `<span class="memory-inline-highlight">${value}</span>`), body);
  return `<article class="memory-experience memory-archive" aria-labelledby="memory-title-${documentEntry.id}">
    <section class="memory-section memory-hero"><div class="memory-hero-copy"><h2 class="memory-major-title" id="memory-title-${documentEntry.id}">${memory.title}</h2><p class="memory-tagline">把企业里散落的知识、材料和文件，转成能直接使用的工作成果。</p><p class="memory-hero-copy-text">面向办公场景，把周报、会议纪要、知识库文档、本地文件等内容，生成 PPT、信息图、总结、问答等可继续使用的结果。</p></div><div class="memory-interface memory-interface-screenshot" aria-label="AI 知识加工台真实界面"><img src="/assets/works/ai-knowledge-platform/knowledge-platform-top-right.png" alt="AI 知识加工台上传资源与任务处理界面"></div></section>
    <section class="memory-section memory-work"><header><p class="memory-major-title">01 我做了什么</p><h3>把功能迭代变成用户愿意尝试的工作场景</h3></header><div class="memory-role-intro"><p>围绕 AI 知识加工台的重点功能，参与场景提炼、运营内容策划、使用引导和数据复盘。</p><div class="memory-role-actions"><div><strong>场景提炼</strong><span>从真实工作困境里找共鸣切口</span></div><div><strong>内容策划</strong><span>围绕上新、教育和教程做内容</span></div><div><strong>体验转化</strong><span>让用户进入创建、使用、提问</span></div><div><strong>数据复盘</strong><span>根据行为数据调整重点</span></div></div></div><div class="memory-work-label">重点功能内容</div><div class="memory-feature-list">${memory.features.map((feature) => `<article class="memory-feature"><div class="memory-feature-title"><span>${feature.number}</span><h4>${feature.title}</h4></div><p>${feature.iteration}</p><small>运营切口 · ${feature.operation}</small><blockquote>“${feature.expression}”</blockquote></article>`).join("")}</div></section>
    <section class="memory-section memory-data"><header><p class="memory-major-title">02 数据复盘</p><h3>从创建入口，到实际使用，再到持续提问</h3></header><div class="memory-kpis" role="tablist" aria-label="数据指标">${memory.monthly.map((item, index) => `<button type="button" class="memory-kpi" role="tab" aria-selected="${index === 0}" data-memory-kpi-index="${index}"><strong>${item.new}</strong><span>${item.label}</span></button>`).join("")}</div><div class="memory-metric-detail" aria-live="polite"></div><div class="memory-path"><h4>用户行为路径 · UV</h4><div>${memory.path.map((item, index) => `<span><b>${item.count}</b><small>${item.label}</small></span>${index < memory.path.length - 1 ? `<i>→</i>` : ""}`).join("")}</div></div><div class="memory-task-mix"><h4>累计任务分布 · 核心四类</h4>${memory.taskMix.map((item) => `<div><strong>${item.label}</strong><span><i style="width:${parseInt(item.share, 10) * 3}%"></i></span><em>${item.share}</em><small>UV ${item.uv} · PV ${item.pv}</small></div>`).join("")}</div><p class="memory-data-note">数据区间：2026.08.10—2026.08.16，对比 2026.08.03—2026.08.09</p><p class="memory-insight">${memory.insight}</p></section>
    <section class="memory-section memory-content"><header><p class="memory-major-title">03 精选内容</p><h3>用场景内容把功能讲清楚</h3></header><div class="memory-content-browser"><nav aria-label="精选内容目录">${memory.contentArchive.map((item, index) => `<button type="button" class="memory-content-tab${index === 0 ? " is-active" : ""}" data-content-index="${index}"><span>${item.number}</span><strong>${item.type}</strong><small>${item.title}</small></button>`).join("")}</nav><div class="memory-content-detail" aria-live="polite"></div></div></section>
  </article>`;
}

function modelDataMetricValue(stage, metric) {
  return metric === "index" ? stage.index : metric === "pv" ? stage.pv : stage.active;
}

function modelDataMetricLabel(metric) {
  return metric === "index" ? "增长指数" : metric === "pv" ? "累计互动 PV" : "累计活跃人次";
}

function modelDataMetricFormat(value) {
  return Number(value).toLocaleString("en-US");
}

function modelDataChartMarkup(data, selectedIndex = 5, metric = "index") {
  const stages = data?.stages || [];
  const values = stages.map((stage) => modelDataMetricValue(stage, metric));
  const max = Math.max(...values, 1);
  const logMax = Math.log10(max + 1);
  const points = stages.map((stage, index) => {
    const normalized = metric === "index" ? stage.index / max : Math.log10(modelDataMetricValue(stage, metric) + 1) / logMax;
    return { x: 52 + index * 112, y: 214 - normalized * 168 };
  });
  if (!points.length) return "";
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index += 1) linePath += ` H ${points[index].x} V ${points[index].y}`;
  const areaPath = `${linePath} H ${points[points.length - 1].x} V 214 H ${points[0].x} Z`;
  const nodeMarkup = points.map((point, index) => {
    const stage = stages[index];
    const active = index === selectedIndex;
    return `<g class="model-data-trend-node${active ? " is-current" : ""}"><circle cx="${point.x}" cy="${point.y}" r="${active ? 7 : 4.5}" opacity="${0.45 + index * 0.1}"></circle>${active ? `<text x="${point.x}" y="${Math.max(20, point.y - 15)}" text-anchor="middle">${modelDataMetricFormat(modelDataMetricValue(stage, metric))}</text>` : ""}<text class="model-data-trend-label" x="${point.x}" y="246" text-anchor="middle">${stage.label}</text></g>`;
  }).join("");
  const scaleNote = metric === "index" ? "增长指数为展示用标准化指标（0—100）" : "累计指标使用对数刻度，便于同时阅读早期与规模化阶段";
  return `<div class="model-data-trend-wrap"><svg class="model-data-trend" viewBox="0 0 650 270" role="img" aria-label="${modelDataMetricLabel(metric)}六阶段趋势图"><line class="model-data-trend-gridline" x1="52" y1="214" x2="612" y2="214"></line><line class="model-data-trend-gridline" x1="52" y1="130" x2="612" y2="130"></line><line class="model-data-trend-gridline" x1="52" y1="46" x2="612" y2="46"></line><path class="model-data-trend-area" d="${areaPath}"></path><path class="model-data-trend-line" d="${linePath}"></path>${nodeMarkup}</svg><p class="model-data-trend-scale">${scaleNote}</p></div>`;
}

function modelStageDetailMarkup(model, index = 0) {
  const stage = model.stages?.[index] || model.stages?.[0];
  if (!stage) return "";
  return `<div class="model-detail-kicker"><span>${stage.number}</span><em>阶段卡片</em></div><h4>${stage.title}</h4><p class="model-detail-summary">${stage.summary}</p><ul>${stage.details.map((detail) => `<li>${detail}</li>`).join("")}</ul>${stage.models ? `<div class="model-model-pool"><div><small>已接入模型</small><p>${stage.models.connected.join(" · ")}</p></div><div><small>持续维护能力</small><p>${stage.models.maintained.join(" · ")}</p></div></div>` : ""}`;
}

function modelPrdPhase(prd) {
  if (prd.phase) return prd.phase;
  if (/^1\.|1\.30/.test(prd.time)) return "1.0";
  if (/2\.0/.test(prd.time)) return "2.0";
  if (/3\.|3\.16|4\.13|验收/.test(`${prd.time}${prd.number}`)) return "3.0";
  if (/7\./.test(prd.time)) return "7月";
  if (/8\./.test(prd.time)) return "8月";
  return "阶段性";
}

function modelPrdCardMarkup(prd, index, activeIndex = 3, displayNumber = String(index + 1).padStart(2, "0")) {
  return `<button type="button" class="model-prd-card${index === activeIndex ? " is-active" : ""}" data-model-prd-index="${index}" data-model-prd-phase="${modelPrdPhase(prd)}" data-model-prd-source-number="${prd.number}"><span>${displayNumber}</span><strong>${prd.title}</strong><small>${prd.time} · ${prd.theme}</small><em>${prd.status || "已完成 / 已上线"}</em></button>`;
}

function updateModelPrdDisplayNumbers(filter = "全部") {
  const cards = [...document.querySelectorAll("[data-model-prd-index]")];
  const visibleCards = cards.filter((card) => filter === "全部" || card.dataset.modelPrdPhase === filter);
  cards.forEach((card) => {
    const position = visibleCards.indexOf(card);
    card.querySelector("span").textContent = position >= 0 ? String(position + 1).padStart(2, "0") : card.dataset.modelPrdSourceNumber;
  });
}

function modelPrdDisplayNumber(index) {
  return document.querySelector(`[data-model-prd-index="${index}"] span`)?.textContent || "";
}

function modelPrdDetailMarkup(model, index = 0, displayNumber = "") {
  const prd = model.prds?.[index] || model.prds?.[0];
  if (!prd) return "";
  const status = prd.status || "已完成 / 已上线";
  const detailNumber = displayNumber || prd.number;
  const phaseLabel = prd.time?.includes("｜") ? prd.time.split("｜").slice(1).join("｜") : prd.time;
  if (prd.detailSections) {
    const sections = prd.detailSections.map((section) => `<div class="model-prd-prelude-block"><small>${section.label}</small><h5>${section.title}</h5><ul>${section.items.map((item) => `<li>${item}</li>`).join("")}</ul></div>`).join("");
    return `<div class="model-detail-kicker"><span>${detailNumber}</span><em>${phaseLabel} · ${status}</em></div><h4>${prd.title}</h4><p class="model-detail-summary">${prd.theme}</p><div class="model-prd-prelude-grid">${sections}</div>`;
  }
  return `<div class="model-detail-kicker"><span>${detailNumber}</span><em>${phaseLabel} · ${status}</em></div><h4>${prd.title}</h4><p class="model-detail-summary">${prd.theme}</p><div class="model-prd-detail-grid"><div><small>解决了什么</small><p>${prd.summary}</p></div><div><small>完成内容</small><ul>${prd.details.map((detail) => `<li>${detail}</li>`).join("")}</ul></div><div><small>我的工作</small><p>${prd.role}</p></div><div><small>体验变化</small><p>${prd.impact}</p></div></div>`;
}

function modelOperationDetailMarkup(model, mode = "promotion", index = 0) {
  const group = model.operationModes?.[mode];
  const operation = group?.cards?.[index] || group?.cards?.[0];
  if (!operation) return "";
  const detail = operation.detail || {};
  const fields = mode === "promotion"
    ? [
      ["运营目标", detail.goal],
      ["主要内容", detail.content],
      ["具体动作", detail.actions],
      ["用户触点", detail.touchpoint],
      ["复盘方式", detail.review],
    ]
    : [
      ["维护对象", detail.target],
      ["维护动作", detail.actions],
      ["常见问题", detail.issues],
      ["处理方式", detail.handling],
      ["最终保障", detail.guarantee],
    ];
  const fieldMarkup = fields.map(([label, value]) => {
    const isList = Array.isArray(value);
    return `<div class="model-operation-detail-field"><small>${label}</small>${isList ? `<ul>${value.map((item) => `<li>${item}</li>`).join("")}</ul>` : `<p>${String(value || "").replace(/\n/g, "<br>")}</p>`}</div>`;
  }).join("");
  return `<div class="model-detail-kicker"><span>${operation.number}</span><em>${group.label}</em></div><h4>${operation.title}</h4><p class="model-detail-summary">${operation.summary}</p><div class="model-operation-detail-grid">${fieldMarkup}</div>`;
}

function modelFeedbackDetailMarkup(model, index = 0) {
  const feedback = model.feedback?.[index] || model.feedback?.[0];
  if (!feedback) return "";
  return `<div class="model-feedback-detail-block"><span class="model-feedback-label">用户问题</span><h4>${feedback.question}</h4><div class="model-feedback-step"><small>产品动作</small><p>${feedback.action}</p></div><div class="model-feedback-step is-result"><small>迭代结果</small><p>${feedback.result}</p></div></div>`;
}

function renderModelExperience(documentEntry) {
  const model = documentEntry.modelExperience;
  const phaseFilters = ["全部", "1.0", "2.0", "3.0", "4.0"];
  return `<article class="model-experience" aria-labelledby="model-title-${documentEntry.id}">
    <section class="model-section model-hero">
      <div class="model-hero-copy"><p class="model-eyebrow">产品经历 / Product Experience</p><h2 id="model-title-${documentEntry.id}">${documentEntry.title}</h2><p class="model-hero-subtitle">${model.subtitle}</p><p class="model-hero-summary">${model.summary}</p></div>
      <div class="model-hero-visual model-hero-screenshot-wrap" aria-label="模型体验台真实界面"><img class="model-hero-screenshot" src="/assets/works/model-experience/model-experience-top-right.png" alt="模型体验台模型选择与体验界面"></div>
    </section>
    <section class="model-section model-intro-section"><header><span class="model-section-number">01</span><h3>体验台介绍</h3></header><div class="model-intro-grid"><div><p class="model-lead">${model.intro.positioning}</p><p>${model.intro.background}</p></div><div class="model-problem-list"><small>要解决的问题</small><ul>${model.intro.problems.map((problem) => `<li>${problem}</li>`).join("")}</ul><p class="model-vision"><b>产品愿景</b>${model.intro.vision}</p></div></div></section>
    <section class="model-section model-build-section"><header><span class="model-section-number">02</span><h3>从 0 到 1 搭建</h3><p>先确认问题，再把模型能力组织成可体验、可反馈、可复盘的工作入口。</p></header><div class="model-browser model-stage-browser"><nav aria-label="搭建阶段">${model.stages.map((stage, index) => `<button type="button" class="model-stage-card${index === 0 ? " is-active" : ""}" data-model-stage-index="${index}"><span>${stage.number}</span><strong>${stage.title}</strong><small>${stage.summary}</small></button>`).join("")}</nav><div class="model-detail-panel model-stage-detail" aria-live="polite">${modelStageDetailMarkup(model, 0)}</div></div></section>
    <section class="model-section model-iteration-section"><header><span class="model-section-number">03</span><h3>产品迭代</h3><p>把 19 个 PRD 放进上线阶段，逐项说明问题、动作和体验变化。</p></header><div class="model-phase-filters" role="tablist" aria-label="按迭代阶段筛选">${phaseFilters.map((filter, index) => `<button type="button" class="model-phase-filter${index === 0 ? " is-active" : ""}" data-model-prd-filter="${filter}" role="tab" aria-selected="${index === 0}">${filter}</button>`).join("")}</div><div class="model-browser model-prd-browser"><nav class="model-prd-list" aria-label="产品迭代列表"><div class="model-prd-version-rule" aria-hidden="true"></div>${model.prds.map((prd, index) => modelPrdCardMarkup(prd, index, 3, String(index + 1).padStart(2, "0"))).join("")}</nav><div class="model-detail-panel model-prd-detail" aria-live="polite">${modelPrdDetailMarkup(model, 3, "04")}</div></div></section>
    <section class="model-section model-operations-section"><header><span class="model-section-number">04</span><h3>运营与运维</h3><p>让用户知道模型体验台，也让产品持续稳定地运行。</p></header><div class="model-operation-modes" role="tablist" aria-label="选择工作类型"><button type="button" class="model-operation-mode is-active" data-model-operation-switch="promotion" role="tab" aria-selected="true">运营推广</button><button type="button" class="model-operation-mode" data-model-operation-switch="maintenance" role="tab" aria-selected="false">产品运维</button></div><div class="model-operation-distinction"><p><b>运营推广</b>让用户知道产品、理解功能、愿意尝试和持续使用。</p><p><b>产品运维</b>保证产品持续可用、信息准确、版本稳定、问题被处理。</p></div>${Object.entries(model.operationModes).map(([mode, group]) => `<div class="model-operation-mode-panel${mode === "promotion" ? " is-active" : ""}" data-model-operation-panel="${mode}"${mode === "promotion" ? "" : " hidden"}><div class="model-browser model-operation-browser"><nav aria-label="${group.label}">${group.cards.map((operation, index) => `<button type="button" class="model-operation-card${index === 0 ? " is-active" : ""}" data-model-operation-index="${index}" data-model-operation-mode="${mode}"><span>${operation.number}</span><strong>${operation.title}</strong><small>${operation.summary}</small></button>`).join("")}</nav><div class="model-detail-panel model-operation-detail" aria-live="polite">${modelOperationDetailMarkup(model, mode, 0)}</div></div><div class="model-loop"><div>${group.loop.map((item, index) => `<span>${item}</span>${index < group.loop.length - 1 ? "<i>→</i>" : ""}`).join("")}</div></div></div>`).join("")}</section>
    <section class="model-section model-data-section"><header><span class="model-section-number">05</span><h3>数据效果</h3><p>从冷启动到规模化使用，产品迭代与运营推广持续推动使用规模增长。</p></header><div class="model-browser model-data-browser"><nav class="model-data-stage-list" aria-label="六个增长阶段">${model.data.stages.map((stage, index) => `<button type="button" class="model-data-card${index === model.data.stages.length - 1 ? " is-active" : ""}" data-model-data-stage-index="${index}"><span>${stage.number}</span><strong>${stage.label}</strong><small>${stage.time}</small><b>${modelDataMetricFormat(stage.pv)} PV</b><em>${stage.resultTag}</em></button>`).join("")}</nav><div class="model-detail-panel model-data-detail" aria-live="polite"></div></div><p class="model-data-summary">${model.data.summary}</p><p class="model-data-source-note">${model.data.note}</p></section>
    <section class="model-section model-feedback-section"><header><span class="model-section-number">06</span><h3>用户反馈与复盘</h3><p>把用户问题变成产品动作，再回到可验证的迭代结果。</p></header><div class="model-browser model-feedback-browser"><nav class="model-feedback-list" aria-label="用户问题">${model.feedback.map((feedback, index) => `<button type="button" class="model-feedback-card${index === 0 ? " is-active" : ""}" data-model-feedback-index="${index}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${feedback.question}</strong></button>`).join("")}</nav><div class="model-detail-panel model-feedback-detail" aria-live="polite">${modelFeedbackDetailMarkup(model, 0)}</div></div></section>
    <section class="model-section model-outcomes-section"><header><span class="model-section-number">07</span><h3>阶段成果</h3><p>从产品搭建到持续运营，形成一套能够继续运行的产品闭环。</p></header><div class="model-outcome-grid">${model.outcomes.map((outcome) => `<article><span>${outcome.number}</span><h4>${outcome.title}</h4><ul>${outcome.items.map((item) => `<li>${item}</li>`).join("")}</ul></article>`).join("")}</div></section>
  </article>`;
}

function searchImagePlaceholderMarkup(sourceDoc, number = "1", imageSrc = "") {
  if (imageSrc) return `<figure class="search-image-placeholder has-image" data-source-doc="${sourceDoc}" data-source-image="${number}"><a href="${imageSrc}" data-search-image-preview aria-label="放大预览${sourceDoc}产品方案图片"><img src="${imageSrc}" alt="${sourceDoc}产品方案与交互示例" loading="lazy"><span class="search-image-zoom">点击放大预览</span></a><figcaption>${sourceDoc}<small>产品方案与交互示例 · 点击图片查看大图</small></figcaption></figure>`;
  return `<figure class="search-image-placeholder" role="img" aria-label="${sourceDoc} 产品文档图片待补" data-source-doc="${sourceDoc}" data-source-image="${number}"><span>IMAGE / ${String(number).padStart(2, "0")}</span><strong>图片待补</strong><figcaption>${sourceDoc}<small>产品方案与交互示例</small></figcaption></figure>`;
}

function searchListMarkup(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function searchEntryStageMarkup(entry) {
  if (!entry) return "";
  if (entry.images?.length) {
    const image = entry.images[0];
    return `<div class="search-entry-media-carousel" data-search-media-carousel data-media-index="0" aria-label="${entry.title}产品截图轮播"><div class="search-entry-media-viewport"><img data-search-media-image src="${image.src}" alt="${image.alt}"></div><button type="button" class="search-entry-media-control is-prev" data-search-media-prev aria-label="查看${entry.title}上一张截图">‹</button><button type="button" class="search-entry-media-control is-next" data-search-media-next aria-label="查看${entry.title}下一张截图">›</button><span class="search-entry-media-counter" data-search-media-counter>1 / ${entry.images.length}</span><small class="search-entry-media-source" data-search-media-source>来源：${image.source}</small></div>`;
  }
  if (!entry.videoSrc) {
    return `<div class="search-entry-video-placeholder" role="img" aria-label="${entry.posterAlt}"><span>VIDEO / ${entry.order}</span><strong>${entry.title}</strong><small>录屏待补</small><em>${entry.posterAlt}</em></div>`;
  }
  const poster = entry.posterSrc ? ` poster="${entry.posterSrc}"` : "";
  return `<div class="search-entry-video-shell"><video data-search-video src="${entry.videoSrc}"${poster} controls playsinline preload="metadata" aria-label="${entry.posterAlt}"></video><button type="button" class="search-entry-play" data-search-video-play aria-label="播放${entry.title}"><span aria-hidden="true">▶</span></button><div class="search-entry-video-error" data-search-video-error hidden>录屏加载失败</div></div>`;
}

function searchEntryDetailMarkup(entry) {
  if (!entry) return "";
  return `<header class="search-entry-detail-header"><span>${entry.order}</span><h4>${entry.title}</h4><p>${entry.description}</p></header><div class="search-entry-detail-content"><div class="search-entry-media">${searchEntryStageMarkup(entry)}</div><div class="search-entry-detail-copy"><div class="search-entry-detail-field"><small>关键能力</small><div class="search-entry-tags" aria-label="${entry.title}能力标签">${entry.tags.map((tag) => `<span>${tag}</span>`).join("")}</div></div><div class="search-entry-detail-field"><small>产品价值</small><p>${entry.value}</p></div><div class="search-entry-source"><small>方案证据</small><p>来源：${entry.source}</p></div></div></div>`;
}

function renderSearchEntryStage(search, index = 1) {
  const experience = documentPages.querySelector(".search-experience");
  const entries = search?.hero?.entries || [];
  const entry = entries[index] || entries[0];
  const detail = experience?.querySelector("[data-search-entry-detail]");
  if (!experience || !entry || !detail) return;
  detail.innerHTML = searchEntryDetailMarkup(entry);
  experience.querySelectorAll("[data-search-entry-tab]").forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  bindSearchEntryVideo(experience);
  bindSearchEntryCarousel(experience, entry);
}

function bindSearchEntryCarousel(experience, entry) {
  const carousel = experience.querySelector("[data-search-media-carousel]");
  if (!carousel || !entry?.images?.length) return;
  const image = carousel.querySelector("[data-search-media-image]");
  const counter = carousel.querySelector("[data-search-media-counter]");
  const source = carousel.querySelector("[data-search-media-source]");
  let index = Number(carousel.dataset.mediaIndex || 0);
  const update = (nextIndex) => {
    index = (nextIndex + entry.images.length) % entry.images.length;
    const item = entry.images[index];
    carousel.dataset.mediaIndex = String(index);
    if (image) {
      image.src = item.src;
      image.alt = item.alt;
    }
    if (counter) counter.textContent = `${index + 1} / ${entry.images.length}`;
    if (source) source.textContent = `来源：${item.source}`;
  };
  carousel.querySelector("[data-search-media-prev]")?.addEventListener("click", () => update(index - 1));
  carousel.querySelector("[data-search-media-next]")?.addEventListener("click", () => update(index + 1));
}

function bindSearchEntryVideo(experience) {
  const video = experience.querySelector("[data-search-video]");
  const play = experience.querySelector("[data-search-video-play]");
  const error = experience.querySelector("[data-search-video-error]");
  if (!video) return;
  play?.addEventListener("click", () => video.play().catch(() => {}));
  video.addEventListener("play", () => {
    experience.querySelector(".search-entry-video-shell")?.classList.add("is-playing");
  });
  video.addEventListener("pause", () => {
    experience.querySelector(".search-entry-video-shell")?.classList.remove("is-playing");
  });
  video.addEventListener("error", () => {
    if (error) error.hidden = false;
    video.hidden = true;
    if (play) play.hidden = true;
  });
}

function searchProblemDetailMarkup(search, index = 0) {
  const item = search.problems[index] || search.problems[0];
  if (!item) return "";
  return `<div class="search-detail-kicker"><span>${item.number}</span><em>SEARCH PROBLEM</em></div><h4>${item.title}</h4><p class="search-detail-lead">${item.summary}</p><div class="search-judgment-flow"><div><small>问题现象</small><p>${item.phenomenon}</p></div><div><small>数据证据</small><p>${item.evidence}</p></div><div class="is-judgment"><small>产品判断</small><p>${item.judgment}</p></div><div><small>解决方案</small>${searchListMarkup(item.solutions)}</div></div>`;
}

function searchWorkDetailMarkup(search, index = 0) {
  const item = search.coreWork[index] || search.coreWork[0];
  if (!item) return "";
  return `<div class="search-detail-kicker"><span>${item.number}</span><em>${item.tag}</em></div><h4>${item.title}</h4><p class="search-detail-lead">${item.summary}</p><div class="search-work-detail-grid"><div><small>我的产品动作</small>${searchListMarkup(item.actions)}</div><div><small>核心判断</small><p>${item.judgment}</p><div class="search-detail-result"><small>工作结果</small><p>${item.result}</p></div></div></div>`;
}

function searchIterationDetailMarkup(search, index = 0) {
  const item = search.iterations[index] || search.iterations[0];
  if (!item) return "";
  return `<div class="search-detail-kicker"><span>${item.number}</span><em>${item.status}</em></div><h4>${item.title}</h4><p class="search-detail-lead">${item.summary}</p><div class="search-iteration-detail"><div class="search-iteration-copy"><div><small>解决的问题</small><p>${item.problem}</p></div><div><small>我的产品动作</small>${searchListMarkup(item.actions)}</div><div><small>关键交互</small><p>${item.interaction}</p></div><div class="search-detail-result"><small>迭代结果</small><p>${item.result}</p></div></div>${searchImagePlaceholderMarkup(item.sourceDoc, "1", item.image)}</div>`;
}

function searchMetricMarkup(metric) {
  return `<div class="search-metric"><small>${metric.label}</small><strong>${metric.value}</strong>${metric.rate ? `<i aria-hidden="true"><span style="width:${metric.rate}%"></span></i>` : ""}</div>`;
}

function searchDataDetailMarkup(search, index = 0) {
  const item = search.data[index] || search.data[0];
  if (!item) return "";
  return `<div class="search-detail-kicker"><span>${item.number}</span><em>SEARCH DATA</em></div><div class="search-data-title"><div><h4>${item.title}</h4><p>${item.unit}</p></div><strong>${item.primary}</strong></div><div class="search-metric-grid">${item.metrics.map(searchMetricMarkup).join("")}</div><div class="search-data-path" aria-label="数据如何进入产品判断"><span>行为数据</span><i>→</i><span>场景判断</span><i>→</i><span>产品动作</span></div><div class="search-data-insight"><div><small>关键洞察</small><p>${item.insight}</p></div><div><small>对应动作</small><p>${item.action}</p></div></div>`;
}

function searchFeedbackDetailMarkup(search, index = 0) {
  const item = search.feedback[index] || search.feedback[0];
  if (!item) return "";
  const fields = [["用户问题", item.problem], ["数据证据", item.evidence], ["产品判断", item.judgment], ["产品动作", item.action], ["迭代结果", item.result]];
  return `<div class="search-detail-kicker"><span>${item.number}</span><em>FEEDBACK LOOP</em></div><h4>${item.title}</h4><div class="search-feedback-flow">${fields.map(([label, value], fieldIndex) => `<div class="${fieldIndex === fields.length - 1 ? "is-result" : ""}"><small>${label}</small><p>${value}</p></div>${fieldIndex < fields.length - 1 ? `<i aria-hidden="true">→</i>` : ""}`).join("")}</div>`;
}

function searchFeaturedDetailMarkup(search, index = 0) {
  const item = search.featured[index] || search.featured[0];
  if (!item) return "";
  return `<div class="search-detail-kicker"><span>${String(index + 1).padStart(2, "0")}</span><em>${item.type}</em></div><h4>${item.title}</h4><div class="search-featured-detail"><div class="search-featured-copy"><div><small>需求背景</small><p>${item.background}</p></div><div><small>核心判断</small><p>${item.judgment}</p></div><div><small>关键方案</small>${searchListMarkup(item.solution)}</div><div><small>我的参与</small><p>${item.participation}</p></div><div class="search-detail-result"><small>产品结果</small><p>${item.result}</p></div></div>${searchImagePlaceholderMarkup(item.title, "1", item.image)}</div>`;
}

function renderSearchExperience(documentEntry) {
  const search = documentEntry.searchExperience;
  const entries = search.hero.entries || [];
  const defaultIndex = Math.max(0, entries.findIndex((entry) => entry.id === search.hero.defaultEntryId));
  return `<article class="search-experience" aria-labelledby="search-title-${documentEntry.id}">
    <section class="search-section search-hero">
      <header class="search-hero-copy"><p class="search-eyebrow">${search.eyebrow}</p><h2 id="search-title-${documentEntry.id}">${documentEntry.title}</h2><p class="search-hero-subtitle">${search.subtitle}</p><p class="search-hero-summary">${search.summary}</p></header>
      <div class="search-entry-demo" aria-label="真实搜索入口体验"><div class="search-entry-layout"><nav class="search-entry-nav" aria-label="搜索入口导航"><div class="search-entry-heading"><span>SEARCH ENTRY</span><h3>${search.hero.title}</h3><p>${search.hero.subtitle}</p></div><div class="search-entry-tabs" role="tablist" aria-label="搜索入口切换">${entries.map((entry, index) => `<button type="button" class="search-entry-tab${index === defaultIndex ? " is-active" : ""}" data-search-entry-tab="${index}" role="tab" aria-selected="${index === defaultIndex}" aria-controls="search-entry-detail-${documentEntry.id}" tabindex="${index === defaultIndex ? "0" : "-1"}"><span>${entry.order}</span><strong>${entry.label}</strong><small>${entry.navSummary}</small></button>`).join("")}</div></nav><section id="search-entry-detail-${documentEntry.id}" class="search-entry-detail" data-search-entry-detail role="tabpanel" aria-live="polite">${searchEntryDetailMarkup(entries[defaultIndex])}</section></div></div>
    </section>
    <section class="search-section search-intro-section"><header><span class="search-section-number">01</span><h3>产品介绍</h3><p>企业资源先被统一理解，用户才能从搜索结果继续走向答案。</p></header><div class="search-intro-grid"><div class="search-intro-copy">${search.intro.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div><div class="search-object-grid">${search.intro.objects.map((item) => `<article><span>${item.number}</span><small>${item.signal}</small><h4>${item.title}</h4><p>${item.detail}</p></article>`).join("")}</div></div></section>
    <section class="search-section search-problem-section"><header><span class="search-section-number">02</span><h3>搜索问题与产品判断</h3><p>把“搜不准”拆成资源、召回、交互与感知问题，才能找到真正的产品动作。</p></header><div class="search-browser"><nav aria-label="搜索问题" role="tablist">${search.problems.map((item, index) => `<button type="button" class="search-nav-card${index === 0 ? " is-active" : ""}" data-search-problem-index="${index}" role="tab" aria-selected="${index === 0}"><span>${item.number}</span><strong>${item.title}</strong><small>${item.summary}</small></button>`).join("")}</nav><div class="search-detail-panel search-problem-detail" aria-live="polite">${searchProblemDetailMarkup(search, 0)}</div></div></section>
    <section class="search-section search-work-section"><header><span class="search-section-number">03</span><h3>我的核心工作</h3><p>从资源底座到答案生成，再用数据与反馈把产品推向下一轮。</p></header><div class="search-browser"><nav aria-label="核心工作" role="tablist">${search.coreWork.map((item, index) => `<button type="button" class="search-nav-card${index === 0 ? " is-active" : ""}" data-search-work-index="${index}" role="tab" aria-selected="${index === 0}"><span>${item.number}</span><strong>${item.title}</strong><small>${item.tag} · ${item.summary}</small></button>`).join("")}</nav><div class="search-detail-panel search-work-detail" aria-live="polite">${searchWorkDetailMarkup(search, 0)}</div></div></section>
    <section class="search-section search-iteration-section"><header><span class="search-section-number">04</span><h3>产品迭代</h3><p>六个连续阶段把资源治理、消息专项、AI 能力与反馈插件组织成完整搜索链路。</p></header><div class="search-browser search-iteration-browser"><nav aria-label="产品迭代阶段" role="tablist">${search.iterations.map((item, index) => `<button type="button" class="search-nav-card search-iteration-card${index === 0 ? " is-active" : ""}" data-search-iteration-index="${index}" role="tab" aria-selected="${index === 0}"><span>${item.number}</span><strong>${item.title}</strong><small>${item.summary}</small><em>${item.status}</em></button>`).join("")}</nav><div class="search-detail-panel search-iteration-detail-panel" aria-live="polite">${searchIterationDetailMarkup(search, 0)}</div></div></section>
    <section class="search-section search-data-section"><header><span class="search-section-number">05</span><h3>数据效果</h3><p>用真实搜索 PV、有点率和点击 PV 定位核心场景，不把流量口径改写成用户数。</p></header><div class="search-browser search-data-browser"><nav aria-label="搜索数据" role="tablist">${search.data.map((item, index) => `<button type="button" class="search-data-card${index === 0 ? " is-active" : ""}" data-search-data-index="${index}" role="tab" aria-selected="${index === 0}"><span>${item.number}</span><strong>${item.title}</strong><b>${item.primary}</b><small>${item.unit}</small></button>`).join("")}</nav><div class="search-detail-panel search-data-detail" aria-live="polite">${searchDataDetailMarkup(search, 0)}</div></div><p class="search-data-note">数据口径：PV 表示搜索或点击次数；页面不将 PV 表述为用户数，也不补充没有来源的 UV、增长率或留存数据。</p></section>
    <section class="search-section search-feedback-section"><header><span class="search-section-number">06</span><h3>用户反馈与复盘</h3><p>让用户问题、行为数据和产品动作在同一个反馈链路中闭环。</p></header><div class="search-browser"><nav aria-label="用户反馈" role="tablist">${search.feedback.map((item, index) => `<button type="button" class="search-nav-card${index === 0 ? " is-active" : ""}" data-search-feedback-index="${index}" role="tab" aria-selected="${index === 0}"><span>${item.number}</span><strong>${item.title}</strong><small>${item.problem}</small></button>`).join("")}</nav><div class="search-detail-panel search-feedback-detail" aria-live="polite">${searchFeedbackDetailMarkup(search, 0)}</div></div></section>
    <section class="search-section search-featured-section"><header><span class="search-section-number">07</span><h3>精选内容</h3><p>选取七份关键文档，按背景、判断、方案、参与和结果快速展开。</p></header><div class="search-browser search-featured-browser"><nav aria-label="精选文档" role="tablist">${search.featured.map((item, index) => `<button type="button" class="search-featured-card${index === 0 ? " is-active" : ""}" data-search-featured-index="${index}" role="tab" aria-selected="${index === 0}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${item.title}</strong><small>${item.type}</small></button>`).join("")}</nav><div class="search-detail-panel search-featured-detail-panel" aria-live="polite">${searchFeaturedDetailMarkup(search, 0)}</div></div></section>
  </article>`;
}

function renderModelStageDetail(model, index = 0) {
  const detail = document.querySelector(".model-stage-detail");
  if (!detail) return;
  detail.innerHTML = modelStageDetailMarkup(model, index);
  document.querySelectorAll(".model-stage-card").forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
}

function renderModelPrdDetail(model, index = 0, displayNumber = "") {
  const detail = document.querySelector(".model-prd-detail");
  if (!detail) return;
  detail.innerHTML = modelPrdDetailMarkup(model, index, displayNumber || modelPrdDisplayNumber(index));
  document.querySelectorAll(".model-prd-card").forEach((card) => card.classList.toggle("is-active", Number(card.dataset.modelPrdIndex) === index));
}

function renderModelOperationDetail(model, mode = "promotion", index = 0) {
  const panel = document.querySelector(`[data-model-operation-panel="${mode}"]`);
  const detail = panel?.querySelector(".model-operation-detail");
  const cards = panel?.querySelectorAll(".model-operation-card");
  if (!detail || !cards) return;
  detail.innerHTML = modelOperationDetailMarkup(model, mode, index);
  cards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
}

function renderModelOperationMode(mode = "promotion") {
  document.querySelectorAll("[data-model-operation-switch]").forEach((button) => {
    const active = button.dataset.modelOperationSwitch === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-model-operation-panel]").forEach((panel) => {
    const active = panel.dataset.modelOperationPanel === mode;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
}

function renderModelFeedbackDetail(model, index = 0) {
  const detail = document.querySelector(".model-feedback-detail");
  if (!detail) return;
  detail.innerHTML = modelFeedbackDetailMarkup(model, index);
  document.querySelectorAll(".model-feedback-card").forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
}

function renderModelDataDetail(model, stageIndex = 5, metric = "index") {
  const stage = model.data.stages?.[stageIndex] || model.data.stages?.[model.data.stages.length - 1];
  const detail = document.querySelector(".model-data-detail");
  if (!detail || !stage) return;
  detail.innerHTML = `<div class="model-detail-kicker"><span>${stage.number}</span><em>${stage.time}</em></div><h4>${stage.title}</h4><p class="model-detail-summary">${stage.label} · ${stage.resultTag}</p><div class="model-data-metrics"><div><small>累计互动 PV</small><strong>${modelDataMetricFormat(stage.pv)}</strong></div><div><small>累计活跃人次</small><strong>${modelDataMetricFormat(stage.active)}</strong></div></div><div class="model-data-chart-head"><div><h5>${model.data.chartTitle}</h5><p>${model.data.chartSubtitle}</p></div><div class="model-data-metric-tabs" role="tablist" aria-label="切换数据指标"><button type="button" class="${metric === "index" ? "is-active" : ""}" data-model-metric="index" role="tab" aria-selected="${metric === "index"}">增长指数</button><button type="button" class="${metric === "pv" ? "is-active" : ""}" data-model-metric="pv" role="tab" aria-selected="${metric === "pv"}">累计互动 PV</button><button type="button" class="${metric === "active" ? "is-active" : ""}" data-model-metric="active" role="tab" aria-selected="${metric === "active"}">累计活跃人次</button></div></div>${modelDataChartMarkup(model.data, stageIndex, metric)}<div class="model-data-narrative"><div><small>阶段说明</small><p>${stage.description}</p></div><div><small>产品动作</small><p>${stage.action}</p></div><div><small>阶段结果</small><p>${stage.result}</p></div></div>`;
  document.querySelectorAll("[data-model-data-stage-index]").forEach((button, index) => button.classList.toggle("is-active", index === stageIndex));
}

function renderSearchDetail(search, index, buttonSelector, detailSelector, markup) {
  const experience = documentPages.querySelector(".search-experience");
  const detail = experience?.querySelector(detailSelector);
  if (!experience || !detail) return;
  detail.innerHTML = markup(search, index);
  experience.querySelectorAll(buttonSelector).forEach((button, buttonIndex) => {
    const selected = buttonIndex === index;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
}

function renderSearchProblemDetail(search, index = 0) {
  renderSearchDetail(search, index, "[data-search-problem-index]", ".search-problem-detail", searchProblemDetailMarkup);
}

function renderSearchWorkDetail(search, index = 0) {
  renderSearchDetail(search, index, "[data-search-work-index]", ".search-work-detail", searchWorkDetailMarkup);
}

function renderSearchIterationDetail(search, index = 0) {
  renderSearchDetail(search, index, "[data-search-iteration-index]", ".search-iteration-detail-panel", searchIterationDetailMarkup);
}

function renderSearchDataDetail(search, index = 0) {
  renderSearchDetail(search, index, "[data-search-data-index]", ".search-data-detail", searchDataDetailMarkup);
}

function renderSearchFeedbackDetail(search, index = 0) {
  renderSearchDetail(search, index, "[data-search-feedback-index]", ".search-feedback-detail", searchFeedbackDetailMarkup);
}

function renderSearchFeaturedDetail(search, index = 0) {
  renderSearchDetail(search, index, "[data-search-featured-index]", ".search-featured-detail-panel", searchFeaturedDetailMarkup);
}

function renderMemoryContentDetail(memory, index = 0) {
  const data = memory?.memory || memory;
  const item = data?.contentArchive?.[index] || data?.contentArchive?.[0];
  const detail = document.querySelector(".memory-content-detail");
  if (!detail || !item) return;
  detail.innerHTML = `<div class="memory-detail-kicker"><span>${item.number}</span><small>${item.type}</small></div><p class="memory-content-function">对应功能 · ${item.function}</p><h4>${item.theme}</h4><p class="memory-detail-lead">${item.description}</p><div class="memory-detail-notes"><span>场景</span><span>方法</span><span>结果</span></div>`;
  document.querySelectorAll(".memory-content-tab").forEach((tab, tabIndex) => tab.classList.toggle("is-active", tabIndex === index));
}

function renderMemoryMetricDetail(memory, index = 0) {
  const data = memory?.memory || memory;
  const item = data?.monthly?.[index] || data?.monthly?.[0];
  const detail = document.querySelector(".memory-metric-detail");
  if (!detail || !item) return;
  detail.innerHTML = `<div class="memory-metric-detail-head"><h4>${item.label}</h4><strong>${item.old} <span>→</span> ${item.new}</strong><em>${item.delta}</em></div><div class="memory-metric-detail-bar" aria-hidden="true"><i style="width:${item.newPercent}%"></i></div><div class="memory-metric-detail-meta"><span>起始周期 ${item.old}</span><span>当前周期 ${item.new}</span></div><p>对比周期：2026.06.01—2026.08.04，约 10 周</p>`;
  document.querySelectorAll(".memory-kpi").forEach((tab, tabIndex) => {
    tab.classList.toggle("is-active", tabIndex === index);
    tab.setAttribute("aria-selected", String(tabIndex === index));
  });
}

function renderDocumentPageLinks(documentEntry, pageNumber) {
  const { width, height: defaultHeight, pageHeights } = documentEntry.renderedPages;
  const height = pageHeights?.[pageNumber - 1] || defaultHeight;
  const positionFor = (box) => `--link-x:${(box.x / width * 100).toFixed(4)}%;--link-y:${(box.y / height * 100).toFixed(4)}%;--link-width:${(box.width / width * 100).toFixed(4)}%;--link-height:${(box.height / height * 100).toFixed(4)}%`;
  return (documentEntry.links || [])
    .filter((link) => link.page === pageNumber)
    .map((link) => {
      const position = positionFor(link);
      if (link.targetPage) {
        const surfaceClass = link.surface === "tinted" ? " is-tinted" : "";
        const labelClass = link.repaintLabel ? " is-labeled" : "";
        const cover = link.cover
          ? `<span class="document-page-cover${surfaceClass}" aria-hidden="true" style="${positionFor(link.cover)}"></span>`
          : "";
        return `
          ${cover}
          <a
            class="document-page-jump${labelClass}${surfaceClass}"
            href="#document-${documentEntry.id}-page-${link.targetPage}"
            data-document-page-jump="${link.targetPage}"
            data-document-id="${documentEntry.id}"
            aria-label="${link.ariaLabel || link.label}"
            style="${position}"
          >${link.repaintLabel ? link.displayLabel || link.label : ""}</a>
        `;
      }
      return `
        <a
          class="document-page-link"
          href="#document-${link.targetDocumentId}"
          data-document-link="${link.targetDocumentId}"
          aria-label="${link.ariaLabel || link.label}"
          style="${position}"
        >${link.label}</a>
      `;
    }).join("");
}

function renderDocumentPages(documents) {
  const comparison = documents.length > 1;
  const embedded = documents.some((documentEntry) => documentEntry.contentType === "embed");
  const workbook = documents.some((documentEntry) => documentEntry.contentType === "workbook");
  const wideTable = documents.some((documentEntry) => documentEntry.layout === "wide-table");
  documentPages.classList.toggle("is-comparison", comparison);
  documentPages.classList.toggle("is-embed", embedded);
  documentPages.classList.toggle("is-workbook", workbook);
  documentPages.classList.toggle("has-wide-table", wideTable);
  documentPages.innerHTML = documents.map((documentEntry) => {
    const heading = comparison
      ? `<header class="document-column-heading"><h2>${documentEntry.columnLabel || documentEntry.title}</h2><p>${documentEntry.title}</p></header>`
      : "";
    const workIntro = documentEntry.workIntro
      ? `
        <section class="work-intro" aria-labelledby="work-intro-${documentEntry.id}">
          <div class="work-intro-copy">
            <p class="work-intro-kicker">${documentEntry.workIntro.kicker}</p>
            <h2 id="work-intro-${documentEntry.id}">${documentEntry.title}</h2>
            <p class="work-intro-summary">${documentEntry.workIntro.summary}</p>
          </div>
          <figure class="work-intro-cover">
            <img
              src="${documentEntry.workIntro.coverImage}"
              width="${documentEntry.workIntro.coverWidth}"
              height="${documentEntry.workIntro.coverHeight}"
              alt="${documentEntry.workIntro.coverAlt}"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            >
          </figure>
          <div class="work-intro-action">
            <button
              class="work-cta"
              type="button"
              data-document-link="${documentEntry.workIntro.action.targetDocumentId}"
              aria-label="${documentEntry.workIntro.action.ariaLabel}"
            >
              <span>${documentEntry.workIntro.action.label}</span>
              <span class="arrow" aria-hidden="true">↗</span>
            </button>
          </div>
        </section>
        <button
          class="work-cta work-cta-float"
          type="button"
          data-document-link="${documentEntry.workIntro.action.targetDocumentId}"
          aria-label="${documentEntry.workIntro.action.ariaLabel}"
          tabindex="-1"
        >
          <span>${documentEntry.workIntro.action.label}</span>
          <span class="arrow" aria-hidden="true">↗</span>
        </button>
      `
      : "";
    if (documentEntry.contentType === "embed") {
      return `
        <article class="document-column document-embed-column" aria-label="${documentEntry.title}">
          ${heading}
          <iframe class="document-embed-frame" src="${documentEntry.embedUrl}" title="${documentEntry.title}" loading="eager"></iframe>
        </article>
      `;
    }
    if (documentEntry.contentType === "video") {
      return `
        <article class="document-column document-video-column" aria-label="${documentEntry.title}">
          ${heading}
          <video class="document-video" src="${documentEntry.file}" controls preload="metadata" playsinline>
            当前浏览器不支持视频播放。
          </video>
        </article>
      `;
    }
    if (documentEntry.contentType === "memory") {
      return renderMemoryExperience(documentEntry);
    }
    if (documentEntry.contentType === "model-experience") {
      return renderModelExperience(documentEntry);
    }
    if (documentEntry.contentType === "search-experience") {
      return renderSearchExperience(documentEntry);
    }
    if (documentEntry.contentType === "bilibili-experience") {
      return renderBilibiliExperience();
    }
    if (documentEntry.contentType === "text") {
      return `
        <article class="document-column document-text-column" aria-label="${documentEntry.columnLabel || documentEntry.title}">
          ${heading}
          <div class="document-text-content">${renderDocumentText(documentEntry)}</div>
        </article>
      `;
    }
    if (documentEntry.contentType === "workbook") {
      const sheets = documentEntry.sheets || [];
      return `
        <article class="document-column workbook-document" aria-label="${documentEntry.title}">
          <header class="workbook-header">
            <div>
              <p>具体数据 / ${sheets.length} 个工作表</p>
              <h2>${documentEntry.title}</h2>
            </div>
            <a class="workbook-download" href="${documentEntry.file}" download>下载原始 Excel <span aria-hidden="true">↓</span></a>
          </header>
          <div class="workbook-tabs" role="tablist" aria-label="选择工作表">
            ${sheets.map((sheet, index) => `
              <button
                class="workbook-tab"
                type="button"
                role="tab"
                id="workbook-tab-${sheet.id}"
                aria-controls="workbook-sheet-${sheet.id}"
                aria-selected="${index === 0}"
                tabindex="${index === 0 ? 0 : -1}"
                data-workbook-sheet-target="${sheet.id}"
              >${sheet.label}</button>
            `).join("")}
          </div>
          <div class="workbook-sheet-stage">
            ${sheets.map((sheet, index) => `
              <section
                class="workbook-sheet"
                id="workbook-sheet-${sheet.id}"
                role="tabpanel"
                aria-labelledby="workbook-tab-${sheet.id}"
                ${index === 0 ? "" : "hidden"}
              >
                <div class="workbook-sheet-meta"><strong>${sheet.name}</strong><span>可横向滚动查看完整数据</span></div>
                <div class="workbook-sheet-scroll" tabindex="0" aria-label="${sheet.name} 数据表">
                  <img src="${sheet.image}" width="${sheet.width}" height="${sheet.height}" alt="${sheet.name} 工作表完整预览" loading="${index === 0 ? "eager" : "lazy"}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ""}>
                </div>
              </section>
            `).join("")}
          </div>
        </article>
      `;
    }
    const { width, height, pageHeights } = documentEntry.renderedPages;
    const pages = Array.from({ length: documentEntry.pages }, (_, index) => {
      const pageNumber = index + 1;
      const pageHeight = pageHeights?.[index] || height;
      const imageMarkup = `
        <img
          src="${renderedDocumentPage(documentEntry, pageNumber)}"
          width="${width}"
          height="${pageHeight}"
          loading="${pageNumber === 1 ? "eager" : "lazy"}"
          decoding="async"
        ${pageNumber === 1 ? 'fetchpriority="high"' : ""}
        alt="${documentEntry.title}, page ${pageNumber} of ${documentEntry.pages}"
      >`;
      if (pageNumber === 1 && documentEntry.preface) {
        const splitY = documentEntry.preface.titleSplitY;
        const splitOffset = (splitY / width) * 100;
        return `
          <div
            class="document-page document-page-with-preface"
            id="document-${documentEntry.id}-page-${pageNumber}"
            style="--document-width:${width};--document-height:${pageHeight};--document-title-split:${splitY};--document-title-offset:${splitOffset}%"
          >
            <div class="document-title-slice" aria-hidden="true">${imageMarkup}</div>
            <section class="document-preface" aria-label="${documentEntry.title}项目概述">
              ${documentEntry.preface.video ? `
                <video class="document-preface-video" src="${documentEntry.preface.video}" controls preload="metadata" playsinline>
                  当前浏览器不支持视频播放。
                </video>
              ` : `<p class="document-preface-kicker">${documentEntry.preface.kicker}</p>`}
              <div class="document-preface-copy">
                ${documentEntry.preface.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
              </div>
            </section>
            <div class="document-body-slice">${imageMarkup}</div>
            ${renderDocumentPageLinks(documentEntry, pageNumber)}
          </div>
        `;
      }
      return `
        <div class="document-page${documentEntry.transparentPages ? " is-transparent" : ""}" id="document-${documentEntry.id}-page-${pageNumber}">
        ${imageMarkup}
        ${renderDocumentPageLinks(documentEntry, pageNumber)}
      </div>
      `;
    }).join("");
    const outcome = documentEntry.outcome
      ? `
        <section class="document-outcome" aria-labelledby="outcome-${documentEntry.id}">
          <header class="document-outcome-header">
            <p class="document-outcome-kicker">01 / 发布效果</p>
            <h2 id="outcome-${documentEntry.id}">${documentEntry.outcome.heading}</h2>
            <p>${documentEntry.outcome.summary}</p>
          </header>
          <div class="document-outcome-grid">
            <figure class="outcome-ranking">
              <div class="outcome-label">${documentEntry.outcome.ranking.label}</div>
              <img
                src="${documentEntry.outcome.ranking.image}"
                width="${documentEntry.outcome.ranking.width}"
                height="${documentEntry.outcome.ranking.height}"
                alt="${documentEntry.outcome.ranking.alt}"
                loading="lazy"
                decoding="async"
              >
              <figcaption>${documentEntry.outcome.ranking.caption}</figcaption>
            </figure>
            <section class="outcome-metrics" aria-labelledby="metrics-${documentEntry.id}">
              <div class="outcome-label">${documentEntry.outcome.metrics.label}</div>
              <div class="outcome-metrics-panel">
                <span class="outcome-metrics-mark" aria-hidden="true">PV / UV</span>
                <h3 id="metrics-${documentEntry.id}">${documentEntry.outcome.metrics.heading}</h3>
                <p class="outcome-metrics-summary">${documentEntry.outcome.metrics.summary}</p>
                <div class="metric-comparison" role="list" aria-label="发布前后 PV 与 UV 对比">
                  ${documentEntry.outcome.metrics.rows.map((row) => {
                    const beforeWidth = Math.max(3, Math.round((row.before / documentEntry.outcome.metrics.scaleMax) * 100));
                    const afterWidth = Math.max(3, Math.round((row.after / documentEntry.outcome.metrics.scaleMax) * 100));
                    return `
                      <div class="metric-row" role="listitem" aria-label="${row.label}：${row.before} 到 ${row.after}，${row.change}">
                        <div class="metric-name"><strong>${row.label}</strong><span>${row.description}</span></div>
                        <div class="metric-bars" aria-hidden="true">
                          <div class="metric-bar metric-bar-before"><span style="width:${beforeWidth}%"></span></div>
                          <div class="metric-bar metric-bar-after"><span style="width:${afterWidth}%"></span></div>
                        </div>
                        <div class="metric-values"><span>${row.before.toLocaleString()} → ${row.after.toLocaleString()}</span><strong>${row.change}</strong></div>
                      </div>
                    `;
                  }).join("")}
                </div>
                <div class="metric-legend" aria-label="图例">
                  <span><i class="metric-legend-swatch metric-legend-before" aria-hidden="true"></i>${documentEntry.outcome.metrics.beforeLabel}</span>
                  <span><i class="metric-legend-swatch metric-legend-after" aria-hidden="true"></i>${documentEntry.outcome.metrics.afterLabel}</span>
                </div>
                <p class="outcome-metrics-source">${documentEntry.outcome.metrics.source}</p>
                ${documentEntry.outcome.metrics.dataDocumentId ? `
                  <button
                    class="outcome-data-cta"
                    type="button"
                    data-document-link="${documentEntry.outcome.metrics.dataDocumentId}"
                    aria-label="点击查看 AI 知识加工台具体数据"
                  >
                    <span>点击查看具体数据</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ` : ""}
              </div>
            </section>
          </div>
        </section>
      `
      : "";
    const introduction = documentEntry.introduction
      ? `
        <section class="document-introduction" aria-labelledby="introduction-${documentEntry.id}">
          <header class="document-introduction-header">
            <p>${documentEntry.introduction.kicker}</p>
            <h2 id="introduction-${documentEntry.id}">${documentEntry.introduction.heading}</h2>
            ${documentEntry.introduction.meta ? `
              <dl class="document-introduction-meta">
                ${documentEntry.introduction.meta.map((item) => `
                  <div>
                    <dt>${item.label}</dt>
                    <dd>${item.value}</dd>
                  </div>
                `).join("")}
              </dl>
            ` : ""}
          </header>
          <div class="document-introduction-copy">
            ${documentEntry.introduction.sections
              ? documentEntry.introduction.sections.map((section) => `
                <section class="document-introduction-section">
                  <h3>${section.heading}</h3>
                  ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
                </section>
              `).join("")
              : documentEntry.introduction.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
          </div>
        </section>
      `
      : "";
    const sourceHeading = documentEntry.outcome
      ? `
        <header class="document-source-heading">
          <p>02 / 运营稿</p>
          <h2>完整运营稿</h2>
        </header>
      `
      : documentEntry.introduction
        ? `
          <header class="document-source-heading">
            <p>${documentEntry.introduction.source?.kicker || "02 / 运营内容"}</p>
            <h2>${documentEntry.introduction.source?.heading || "完整运营内容"}</h2>
          </header>
        `
        : "";
    return `
      <article class="document-column${documentEntry.transparentPages ? " document-transparent-column" : ""}" aria-label="${documentEntry.columnLabel || documentEntry.title}">
        ${heading}
        ${workIntro}
        ${introduction}
        ${outcome}
        ${sourceHeading}
        <div class="document-column-pages">${pages}</div>
      </article>
    `;
  }).join("");
}

function disconnectWorkIntroCta() {
  if (workIntroSetupFrame) {
    window.cancelAnimationFrame(workIntroSetupFrame);
    workIntroSetupFrame = 0;
  }
  workIntroObserver?.disconnect();
  workIntroObserver = null;
}

function setupWorkIntroCta() {
  disconnectWorkIntroCta();
  const hero = documentPages.querySelector(".work-intro");
  const floatingCta = documentPages.querySelector(".work-cta-float");
  if (!hero || !floatingCta || !("IntersectionObserver" in window)) return;

  workIntroObserver = new IntersectionObserver(
    ([entry]) => {
      const visible = !entry.isIntersecting && !documentModal.hidden;
      floatingCta.classList.toggle("is-visible", visible);
      floatingCta.tabIndex = visible ? 0 : -1;
    },
    { root: documentModalScroll, threshold: 0.1 },
  );
  workIntroObserver.observe(hero);
}

function scheduleWorkIntroCta() {
  disconnectWorkIntroCta();
  workIntroSetupFrame = window.requestAnimationFrame(() => {
    workIntroSetupFrame = 0;
    setupWorkIntroCta();
  });
}

function updateDocumentCloseAction() {
  const previousView = documentModalHistory.at(-1);
  const currentView = activeModalDocuments[0];
  const label = previousView
    ? `返回${previousView.documents.map((documentEntry) => documentEntry.title).join(" / ")}`
    : currentView?.contentType === "embed"
      ? `关闭${currentView.title}`
      : "关闭文档";
  documentModalClose.setAttribute("aria-label", label);
}

function renderDocumentModalView(documents, scrollTop = 0) {
  activeModalDocuments = documents;
  renderDocumentPages(documents);
  documentModal.classList.toggle(
    "is-transparent-document",
    documents.length > 0 && documents.every((documentEntry) => documentEntry.transparentPages),
  );
  documentModal.classList.toggle("is-memory-experience", documents.some((documentEntry) => documentEntry.contentType === "memory"));
  documentModal.classList.toggle("is-model-experience", documents.some((documentEntry) => documentEntry.contentType === "model-experience"));
  documentModal.classList.toggle("is-search-experience", documents.some((documentEntry) => documentEntry.contentType === "search-experience"));
  documentModal.classList.toggle("is-bilibili-experience", documents.some((documentEntry) => documentEntry.contentType === "bilibili-experience"));
  documentModalDialog.setAttribute("aria-label", documents.map((documentEntry) => documentEntry.title).join(" / "));
  documentModalScroll.scrollTop = scrollTop;
  documentPages.querySelectorAll(".document-column").forEach((column) => { column.scrollTop = 0; });
  updateDocumentCloseAction();
  scheduleWorkIntroCta();
}

function enterMemoryExperience(trigger) {
  const experience = documentPages.querySelector(".memory-experience");
  if (!experience) return;
  window.requestAnimationFrame(() => {
    const panel = experience.getBoundingClientRect();
    const origin = trigger?.getBoundingClientRect();
    if (origin) {
      experience.style.setProperty("--memory-origin-x", `${origin.left + origin.width / 2 - panel.left}px`);
      experience.style.setProperty("--memory-origin-y", `${origin.top + origin.height / 2 - panel.top}px`);
    }
    experience.classList.add("is-entered");
    documentPages.querySelectorAll("[data-memory-number]").forEach((number) => animateMemoryNumber(number));
    const memoryEntry = activeModalDocuments.find((entry) => entry.contentType === "memory");
    renderMemoryContentDetail(memoryEntry, 0);
    documentPages.querySelectorAll(".memory-content-tab").forEach((tab) => tab.addEventListener("click", () => renderMemoryContentDetail(memoryEntry, Number(tab.dataset.contentIndex))));
    renderMemoryMetricDetail(memoryEntry, 0);
    documentPages.querySelectorAll(".memory-kpi").forEach((tab) => {
      const selectMetric = () => renderMemoryMetricDetail(memoryEntry, Number(tab.dataset.memoryKpiIndex));
      tab.addEventListener("click", selectMetric);
      tab.addEventListener("pointerup", selectMetric);
      tab.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") selectMetric(); });
    });
    documentPages.addEventListener("click", (event) => {
      const tab = event.target.closest?.(".memory-kpi");
      if (tab) renderMemoryMetricDetail(memoryEntry, Number(tab.dataset.memoryKpiIndex));
    });
  });
}

function enterModelExperience(trigger) {
  const experience = documentPages.querySelector(".model-experience");
  if (!experience) return;
  window.requestAnimationFrame(() => {
    const panel = experience.getBoundingClientRect();
    const origin = trigger?.getBoundingClientRect();
    if (origin) {
      experience.style.setProperty("--model-origin-x", `${origin.left + origin.width / 2 - panel.left}px`);
      experience.style.setProperty("--model-origin-y", `${origin.top + origin.height / 2 - panel.top}px`);
    }
    experience.classList.add("is-entered");
    const modelEntry = activeModalDocuments.find((entry) => entry.contentType === "model-experience");
    const model = modelEntry?.modelExperience;
    if (!model) return;
    const defaultDataStage = Math.max(0, (model.data.stages?.length || 1) - 1);
    renderModelDataDetail(model, defaultDataStage, "index");
    documentPages.querySelectorAll("[data-model-stage-index]").forEach((button) => button.addEventListener("click", () => renderModelStageDetail(model, Number(button.dataset.modelStageIndex))));
    updateModelPrdDisplayNumbers("全部");
    documentPages.querySelectorAll("[data-model-prd-index]").forEach((button) => button.addEventListener("click", () => renderModelPrdDetail(model, Number(button.dataset.modelPrdIndex), button.querySelector("span")?.textContent)));
    documentPages.querySelectorAll("[data-model-prd-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.modelPrdFilter;
        documentPages.querySelectorAll("[data-model-prd-filter]").forEach((item) => {
          const selected = item === button;
          item.classList.toggle("is-active", selected);
          item.setAttribute("aria-selected", String(selected));
        });
        documentPages.querySelectorAll("[data-model-prd-index]").forEach((card) => {
          card.hidden = filter !== "全部" && card.dataset.modelPrdPhase !== filter;
        });
        updateModelPrdDisplayNumbers(filter);
        const firstVisible = [...documentPages.querySelectorAll("[data-model-prd-index]")].find((card) => !card.hidden);
        if (firstVisible) renderModelPrdDetail(model, Number(firstVisible.dataset.modelPrdIndex), firstVisible.querySelector("span")?.textContent);
      });
    });
    documentPages.querySelectorAll("[data-model-operation-switch]").forEach((button) => button.addEventListener("click", () => renderModelOperationMode(button.dataset.modelOperationSwitch)));
    documentPages.querySelectorAll("[data-model-operation-index]").forEach((button) => button.addEventListener("click", () => renderModelOperationDetail(model, button.dataset.modelOperationMode, Number(button.dataset.modelOperationIndex))));
    documentPages.querySelectorAll("[data-model-feedback-index]").forEach((button) => button.addEventListener("click", () => renderModelFeedbackDetail(model, Number(button.dataset.modelFeedbackIndex))));
    documentPages.querySelectorAll("[data-model-data-stage-index]").forEach((button) => button.addEventListener("click", () => {
      const activeMetric = document.querySelector("[data-model-metric].is-active")?.dataset.modelMetric || "index";
      renderModelDataDetail(model, Number(button.dataset.modelDataStageIndex), activeMetric);
    }));
    documentPages.addEventListener("click", (event) => {
      const metric = event.target.closest?.("[data-model-metric]");
      if (!metric) return;
      const activeStage = [...documentPages.querySelectorAll("[data-model-data-stage-index]")].find((button) => button.classList.contains("is-active"));
      renderModelDataDetail(model, activeStage ? Number(activeStage.dataset.modelDataStageIndex) : (model.data.stages.length - 1), metric.dataset.modelMetric);
    });
  });
}

function enterSearchExperience(trigger) {
  const experience = documentPages.querySelector(".search-experience");
  if (!experience) return;
  window.requestAnimationFrame(() => {
    const panel = experience.getBoundingClientRect();
    const origin = trigger?.getBoundingClientRect();
    if (origin) {
      experience.style.setProperty("--search-origin-x", `${origin.left + origin.width / 2 - panel.left}px`);
      experience.style.setProperty("--search-origin-y", `${origin.top + origin.height / 2 - panel.top}px`);
    }
    experience.classList.add("is-entered");
    const searchEntry = activeModalDocuments.find((entry) => entry.contentType === "search-experience");
    const search = searchEntry?.searchExperience;
    if (!search) return;
    const defaultEntryIndex = Math.max(0, search.hero.entries.findIndex((entry) => entry.id === search.hero.defaultEntryId));

    const bindings = [
      ["[data-search-problem-index]", "searchProblemIndex", renderSearchProblemDetail],
      ["[data-search-work-index]", "searchWorkIndex", renderSearchWorkDetail],
      ["[data-search-iteration-index]", "searchIterationIndex", renderSearchIterationDetail],
      ["[data-search-data-index]", "searchDataIndex", renderSearchDataDetail],
      ["[data-search-feedback-index]", "searchFeedbackIndex", renderSearchFeedbackDetail],
      ["[data-search-featured-index]", "searchFeaturedIndex", renderSearchFeaturedDetail],
    ];
    bindings.forEach(([selector, datasetKey, renderer]) => {
      experience.querySelectorAll(selector).forEach((button) => button.addEventListener("click", () => renderer(search, Number(button.dataset[datasetKey]))));
    });
    bindSearchEntryVideo(experience);
    bindSearchEntryCarousel(experience, search.hero.entries[defaultEntryIndex]);
    const entryTabs = [...experience.querySelectorAll("[data-search-entry-tab]")];
    const selectEntry = (index, moveFocus = false) => {
      const currentVideo = experience.querySelector("[data-search-video]");
      if (currentVideo) {
        currentVideo.pause();
        currentVideo.currentTime = 0;
      }
      renderSearchEntryStage(search, index);
      if (moveFocus) experience.querySelector(`[data-search-entry-tab="${index}"]`)?.focus();
    };
    entryTabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectEntry(index));
      tab.addEventListener("keydown", (event) => {
        let nextIndex = index;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectEntry(index, true);
          return;
        }
        if (event.key === "ArrowRight") nextIndex = (index + 1) % entryTabs.length;
        else if (event.key === "ArrowLeft") nextIndex = (index - 1 + entryTabs.length) % entryTabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = entryTabs.length - 1;
        else return;
        event.preventDefault();
        selectEntry(nextIndex, true);
      });
    });
  });
}

function animateMemoryNumber(element) {
  const target = Number(element.dataset.value);
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 1500;
  const started = performance.now();
  const frame = (now) => {
    const progress = Math.min(1, (now - started) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    const decimals = Number(element.dataset.decimals || 0);
    const value = target * eased;
    const formatted = decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString();
    element.textContent = `${element.dataset.prefix}${formatted}${element.dataset.suffix}`;
    if (progress < 1) window.requestAnimationFrame(frame);
  };
  window.requestAnimationFrame(frame);
}

function openDocumentModal(room, object, documents, trigger, { pushCurrent = false } = {}) {
  syncBranding();
  const openingModal = documentModal.hidden;
  if (openingModal) {
    documentReturnFocus = trigger || document.activeElement;
    documentModalHistory = [];
  } else if (pushCurrent && activeModalDocuments.length) {
    documentModalHistory.push({
      documents: activeModalDocuments,
      scrollTop: documentModalScroll.scrollTop,
    });
  }
  renderDocumentModalView(documents);
  documentModal.hidden = false;
  documentModal.setAttribute("aria-hidden", "false");
  if (openingModal) documentModalScroll.scrollTop = 0;
  document.body.classList.add("is-document-open");
  documentModalClose.focus({ preventScroll: true });
  if (documents.some((documentEntry) => documentEntry.contentType === "memory")) enterMemoryExperience(trigger);
  if (documents.some((documentEntry) => documentEntry.contentType === "model-experience")) enterModelExperience(trigger);
  if (documents.some((documentEntry) => documentEntry.contentType === "search-experience")) enterSearchExperience(trigger);
}

function closeOrReturnDocument() {
  const previousView = documentModalHistory.pop();
  if (!previousView) {
    closeDocumentModal();
    return;
  }
  renderDocumentModalView(previousView.documents, previousView.scrollTop);
  documentModalClose.focus({ preventScroll: true });
}

function closeDocumentModal(restoreFocus = true) {
  if (documentModal.hidden) return;
  const experience = documentPages.querySelector(".memory-experience.is-entered, .model-experience.is-entered, .search-experience.is-entered");
  const experienceClosingClass = documentModal.classList.contains("is-model-experience")
    ? "is-model-closing"
    : documentModal.classList.contains("is-search-experience")
      ? "is-search-closing"
      : "is-memory-closing";
  if (experience && !documentModal.classList.contains(experienceClosingClass)) {
    documentModal.classList.add(experienceClosingClass);
    experience.classList.remove("is-entered");
    window.setTimeout(() => {
      documentModal.classList.remove("is-memory-closing", "is-model-closing", "is-search-closing");
      closeDocumentModal(restoreFocus);
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 100 : 400);
    return;
  }
  disconnectWorkIntroCta();
  documentModal.hidden = true;
  documentModal.setAttribute("aria-hidden", "true");
  documentPages.replaceChildren();
  documentModal.classList.remove("is-transparent-document", "is-memory-experience", "is-memory-closing", "is-model-experience", "is-model-closing", "is-search-experience", "is-search-closing", "is-bilibili-experience");
  document.body.classList.remove("is-document-open");
  if (restoreFocus) documentReturnFocus?.focus({ preventScroll: true });
  documentReturnFocus = null;
  activeModalDocuments = [];
  documentModalHistory = [];
  updateDocumentCloseAction();
}

function openRoomObject(roomId, objectId, trigger) {
  if (transitioning || currentPageId !== roomId) return;
  const { room, object, documents } = getRoomObject(roomId, objectId);
  if (!room || !object || !documents.length) return;
  markObjectDiscovered(roomId, objectId);
  openDocumentModal(room, object, documents, trigger);
}

function updateVisualControls(pageId) {
  if (pageId === "doorstep") {
    roomSwitchControls.hidden = true;
    return;
  }
  const { previous, next } = adjacentPages(pageId);
  previousButton.dataset.pageId = previous.id;
  previousButton.setAttribute("aria-label", `Previous page: ${previous.accessibleLabel}`);
  nextButton.dataset.pageId = next.id;
  nextButton.setAttribute("aria-label", `Next page: ${next.accessibleLabel}`);
  roomSwitchControls.hidden = false;
}

function setNavigationState(pageId) {
  navLinks.forEach((link) => {
    const selected = pageId === link.dataset.pageId;
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
    if (selected && window.matchMedia("(max-width: 640px)").matches) {
      link.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  });
}

function setLocked(locked) {
  transitioning = locked;
  header.dataset.locked = String(locked);
  navLinks.forEach((link) => {
    if (locked) link.setAttribute("aria-disabled", "true");
    else link.removeAttribute("aria-disabled");
  });
  visualControlButtons.forEach((button) => { button.disabled = locked; });
  if (!locked && historySyncPending) {
    historySyncPending = false;
    window.setTimeout(() => syncNavigationToLocation(false), 0);
  }
}

function updateDocument(room) {
  syncBranding();
  document.title = room
    ? `${room.title} — ${PORTFOLIO.authorName} Portfolio`
    : `${PORTFOLIO.authorName} — Portfolio 2026`;
}

function commitHistory(path, mode) {
  if (mode === "push") window.history.pushState({}, "", path);
  if (mode === "replace") window.history.replaceState({}, "", path);
}

function setFocusRoom(room) {
  const originX = (room.hotspotCenter.x / OVERVIEW_SIZE.width) * 100;
  const originY = (room.hotspotCenter.y / OVERVIEW_SIZE.height) * 100;
  const { sourceFinal, detailInitial } = room.transition;

  focusClipPath.setAttribute("d", room.hotspotPath);
  stage.style.setProperty("--focus-x", `${originX}%`);
  stage.style.setProperty("--focus-y", `${originY}%`);
  stage.style.setProperty("--focus-scale", sourceFinal.scale);
  stage.style.setProperty("--focus-shift-x", `${sourceFinal.x}%`);
  stage.style.setProperty("--focus-shift-y", `${sourceFinal.y}%`);
  stage.style.setProperty("--focus-blur", `${sourceFinal.blur}px`);
  stage.style.setProperty("--incoming-start-x", `${detailInitial.x}%`);
  stage.style.setProperty("--incoming-start-y", `${detailInitial.y}%`);
  stage.style.setProperty("--incoming-start-scale", detailInitial.scale);
  stage.style.setProperty("--incoming-start-blur", `${detailInitial.blur}px`);
}

function setSwitchDirection(direction) {
  const sign = direction === "previous" ? -1 : 1;
  stage.style.setProperty("--switch-enter-x", `${sign * 12}px`);
  stage.style.setProperty("--switch-exit-x", `${sign * -10}px`);
  stage.dataset.switchDirection = direction;
}

function clearTransitionClasses() {
  stage.classList.remove(
    "is-focus-transition",
    "is-focus-selecting",
    "is-focus-expanding",
    "is-focus-crossfading",
    "is-switch-prepared",
    "is-switching",
    "is-returning",
  );
  detail.classList.remove("is-updating");
  delete stage.dataset.switchDirection;
  focusClipPath.removeAttribute("d");
}

function clearOverviewInteractionState() {
  hotspots.forEach((hotspot) => hotspot.classList.remove("is-highlighted"));
  clearTransitionClasses();
  [
    "--focus-x",
    "--focus-y",
    "--focus-scale",
    "--focus-shift-x",
    "--focus-shift-y",
    "--focus-blur",
    "--incoming-start-x",
    "--incoming-start-y",
    "--incoming-start-scale",
    "--incoming-start-blur",
  ].forEach((property) => stage.style.removeProperty(property));
}

function prepareOverviewDirectorySelection(roomId) {
  const directory = detail.querySelector(".overview-directory");
  if (!directory) return;
  directory.classList.add("is-committing");
  detail.querySelectorAll("[data-directory-room]").forEach((row) => {
    const selected = row.dataset.roomId === roomId;
    row.classList.toggle("is-selected", selected);
    row.classList.toggle("is-muted", !selected);
  });
}

async function focusFromOverview(room, swapDirectory) {
  setFocusRoom(room);
  portfolioMain.dataset.page = "transition";
  stage.dataset.view = "transition";
  stage.classList.add("is-focus-transition");
  stage.getBoundingClientRect();
  stage.classList.add("is-focus-selecting");

  if (prefersReducedMotion.matches) {
    await wait(REDUCED_FOCUS_TIMING.crossfadeStart);
    stage.classList.add("is-focus-crossfading");
    swapDirectory();
    await wait(REDUCED_FOCUS_TIMING.detailStart - REDUCED_FOCUS_TIMING.crossfadeStart);
    detail.classList.add("is-visible");
    await wait(REDUCED_FOCUS_TIMING.total - REDUCED_FOCUS_TIMING.detailStart);
    return;
  }

  await wait(FOCUS_TIMING.expandStart);
  stage.classList.add("is-focus-expanding");
  await wait(FOCUS_TIMING.crossfadeStart - FOCUS_TIMING.expandStart);
  stage.classList.add("is-focus-crossfading");
  await wait(60);
  swapDirectory();
  await wait(FOCUS_TIMING.detailStart - FOCUS_TIMING.crossfadeStart - 60);
  detail.classList.add("is-visible");
  await wait(FOCUS_TIMING.total - FOCUS_TIMING.detailStart);
}

async function switchRoomVisual(direction) {
  setSwitchDirection(direction);
  stage.classList.add("is-switch-prepared");
  stage.getBoundingClientRect();
  stage.classList.add("is-switching");

  const duration = prefersReducedMotion.matches ? 140 : ROOM_SWITCH_MS;
  await wait(duration / 2);
  detail.classList.remove("is-updating");
  await wait(duration / 2);
}

function getSwitchDirection(targetPageId, requestedDirection) {
  if (requestedDirection) return requestedDirection;
  const currentIndex = PAGE_NAVIGATION.findIndex((item) => item.id === currentPageId);
  const nextIndex = PAGE_NAVIGATION.findIndex((item) => item.id === targetPageId);
  return nextIndex < currentIndex ? "previous" : "next";
}

async function transitionToRoom(room, historyMode = "push", animate = true, requestedDirection) {
  if (!room || transitioning || currentPageId === room.id) return;

  setLocked(true);
  const fromOverview = currentPageId === "overview";
  const direction = getSwitchDirection(room.id, requestedDirection);
  if (fromOverview && animate) prepareOverviewDirectorySelection(room.id);
  const imageReady = await preloadImage(room.image);
  if (!imageReady) {
    if (fromOverview) renderOverviewDirectory();
    setLocked(false);
    return;
  }

  if (fromOverview && !animate) clearOverviewInteractionState();
  if (fromOverview && !animate) portfolioMain.dataset.page = room.id;
  incomingImage.src = room.image;
  incomingImage.alt = room.alt;
  incomingImage.removeAttribute("aria-hidden");
  if (!fromOverview && animate) detail.classList.add("is-updating");
  if (!fromOverview || !animate) renderDetail(room);
  setNavigationState(room.id);

  if (animate && fromOverview) await focusFromOverview(room, () => renderDetail(room, { entering: true }));
  else if (animate) await switchRoomVisual(direction);

  currentImage.src = room.image;
  currentImage.alt = room.alt;
  incomingImage.src = room.image;
  currentPageId = room.id;
  portfolioMain.dataset.page = room.id;
  stage.dataset.view = "room";
  stage.dataset.roomId = room.id;
  detail.classList.add("is-visible");
  updateVisualControls(currentPageId);
  clearTransitionClasses();
  if (!historySyncPending) commitHistory(room.path, historyMode);
  updateDocument(room);
  setLocked(false);
  if (animate) detail.querySelector(".detail-title")?.focus({ preventScroll: true });
}

async function transitionToOverview(historyMode = "push", animate = true) {
  if (transitioning || currentPageId === "overview") return;

  setLocked(true);
  const imageReady = await preloadImage(OVERVIEW_IMAGE);
  if (!imageReady) {
    setLocked(false);
    return;
  }
  incomingImage.src = OVERVIEW_IMAGE;
  incomingImage.alt = "Isometric overview of four portfolio categories: garden, kitchen, living room, and study";
  incomingImage.removeAttribute("aria-hidden");
  stage.dataset.view = "transition";
  portfolioMain.dataset.page = "overview-enter";
  stage.classList.add("is-returning");
  if (animate) detail.classList.add("is-updating");
  setNavigationState("overview");

  if (animate) {
    stage.getBoundingClientRect();
    await wait(prefersReducedMotion.matches ? 140 : ROOM_SWITCH_MS);
  }

  currentImage.src = OVERVIEW_IMAGE;
  currentImage.alt = incomingImage.alt;
  incomingImage.src = OVERVIEW_IMAGE;
  currentPageId = "overview";
  portfolioMain.dataset.page = "overview";
  stage.dataset.view = "overview";
  delete stage.dataset.roomId;
  renderOverviewDirectory({ entering: animate });
  detail.classList.add("is-visible");
  updateVisualControls(currentPageId);
  clearTransitionClasses();
  if (!historySyncPending) commitHistory("/", historyMode);
  updateDocument(null);
  setLocked(false);
}

function navigateToPage(pageId, direction, source = "top-tab") {
  closeDocumentModal(false);
  syncBranding();
  const page = PAGE_NAVIGATION.find((item) => item.id === pageId);
  if (!page) return;
  if (page.type === "overview") transitionToOverview("push", true);
  else {
    const directFromOverviewArrow = source === "overview-arrow" && currentPageId === "overview";
    transitionToRoom(
      ROOMS.find((room) => room.id === page.roomId),
      "push",
      !directFromOverviewArrow,
      direction,
    );
  }
}

function navigateToRoom(id, direction, source = "overview-hotspot") {
  navigateToPage(id, direction, source);
}

function highlightRoom(id, highlighted) {
  document.querySelector(`.hotspot[data-room-id="${id}"]`)?.classList.toggle("is-highlighted", highlighted);
}

function setDirectoryRoomHighlight(roomId, highlighted) {
  const directory = detail.querySelector(".overview-directory");
  if (!directory || (!highlighted && transitioning && directory.classList.contains("is-committing"))) return;
  detail.querySelectorAll("[data-directory-room]").forEach((row) => {
    const active = highlighted && row.dataset.roomId === roomId;
    row.classList.toggle("is-active", active);
    row.classList.toggle("is-muted", highlighted && !active);
  });
  highlightRoom(roomId, highlighted);
}

function setDirectoryObjectHighlight(roomId, objectId, highlighted) {
  detail.querySelectorAll("[data-directory-object]").forEach((row) => {
    const active = highlighted && row.dataset.roomId === roomId && row.dataset.objectId === objectId;
    row.classList.toggle("is-active", active);
    row.classList.toggle("is-muted", highlighted && !active);
  });
  roomObjectHotspots.forEach((hotspot) => {
    const active = highlighted && hotspot.dataset.roomId === roomId && hotspot.dataset.objectId === objectId;
    hotspot.classList.toggle("is-directory-highlighted", active);
  });
}

function warmRoomObjectDocuments(roomId, objectId) {
  const { documents } = getRoomObject(roomId, objectId);
  documents.forEach((documentEntry) => {
    if (documentEntry.renderedPages) preloadImage(renderedDocumentPage(documentEntry, 1));
    if (documentEntry.workIntro?.coverImage) preloadImage(documentEntry.workIntro.coverImage);
  });
}

navLinks.forEach((link) => {
  const id = link.dataset.roomId;
  const pageId = link.dataset.pageId;
  const activate = () => {
    if (transitioning) return;
    navigateToPage(pageId, undefined, "top-tab");
  };
  link.addEventListener("click", (event) => {
    event.preventDefault();
    activate();
  });
  link.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    activate();
  });
  if (id) {
    link.addEventListener("mouseenter", () => {
      highlightRoom(id, true);
      warmRoomImage(id);
    });
    link.addEventListener("mouseleave", () => highlightRoom(id, false));
    link.addEventListener("focus", () => {
      highlightRoom(id, true);
      warmRoomImage(id);
    });
    link.addEventListener("blur", () => highlightRoom(id, false));
  }
});

hotspots.forEach((hotspot) => {
  const id = hotspot.dataset.roomId;
  hotspot.addEventListener("click", () => navigateToRoom(id, undefined, "overview-hotspot"));
  hotspot.addEventListener("pointerenter", () => {
    setDirectoryRoomHighlight(id, true);
    warmRoomImage(id);
  });
  hotspot.addEventListener("pointerleave", () => {
    if (document.activeElement !== hotspot) setDirectoryRoomHighlight(id, false);
  });
  hotspot.addEventListener("focus", () => {
    setDirectoryRoomHighlight(id, true);
    warmRoomImage(id);
  });
  hotspot.addEventListener("blur", () => setDirectoryRoomHighlight(id, false));
  hotspot.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      navigateToRoom(id, undefined, "overview-hotspot");
    }
  });
});

roomObjectHotspots.forEach((hotspot) => {
  const roomId = hotspot.dataset.roomId;
  const objectId = hotspot.dataset.objectId;
  const activate = () => openRoomObject(roomId, objectId, hotspot);
  const warmDocument = () => warmRoomObjectDocuments(roomId, objectId);
  hotspot.addEventListener("click", activate);
  hotspot.addEventListener("pointerenter", () => {
    setDirectoryObjectHighlight(roomId, objectId, true);
    warmDocument();
  });
  hotspot.addEventListener("pointerleave", () => {
    if (document.activeElement !== hotspot) setDirectoryObjectHighlight(roomId, objectId, false);
  });
  hotspot.addEventListener("focus", () => {
    setDirectoryObjectHighlight(roomId, objectId, true);
    warmDocument();
  });
  hotspot.addEventListener("blur", () => setDirectoryObjectHighlight(roomId, objectId, false));
  hotspot.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate();
  });
});

function linkedDocument(link) {
  const room = ROOMS.find((item) => item.id === currentPageId);
  const documentEntry = room?.documents?.find((item) => item.id === link.dataset.documentLink);
  return { room, documentEntry };
}

function warmLinkedDocument(link) {
  const { documentEntry } = linkedDocument(link);
  if (documentEntry?.renderedPages) preloadImage(renderedDocumentPage(documentEntry, 1));
  if (documentEntry?.contentType === "workbook" && documentEntry.sheets?.[0]) {
    preloadImage(documentEntry.sheets[0].image);
  }
}

async function openLinkedDocument(link) {
  const { room, documentEntry } = linkedDocument(link);
  if (!room || !documentEntry) return;
  if (documentEntry.renderedPages) {
    const ready = await preloadImage(renderedDocumentPage(documentEntry, 1));
    if (!ready || documentModal.hidden) return;
  }
  openDocumentModal(room, null, [documentEntry], documentReturnFocus, { pushCurrent: true });
}

documentPages.addEventListener("pointerover", (event) => {
  const link = event.target.closest("[data-document-link]");
  if (link) warmLinkedDocument(link);
});

documentPages.addEventListener("focusin", (event) => {
  const link = event.target.closest("[data-document-link]");
  if (link) warmLinkedDocument(link);
});

function jumpToDocumentPage(pageJump) {
  const target = document.getElementById(`document-${pageJump.dataset.documentId}-page-${pageJump.dataset.documentPageJump}`);
  if (!target) return;
  const targetTop = documentModalScroll.scrollTop
    + target.getBoundingClientRect().top
    - documentModalScroll.getBoundingClientRect().top;
  documentModalScroll.scrollTo({ top: targetTop, behavior: "auto" });
}

documentPages.addEventListener("keydown", async (event) => {
  const workbookTab = event.target.closest("[data-workbook-sheet-target]");
  if (workbookTab && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    const tabs = [...workbookTab.closest("[role=tablist]").querySelectorAll("[role=tab]")];
    const currentIndex = tabs.indexOf(workbookTab);
    const targetIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? tabs.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[targetIndex].focus();
    tabs[targetIndex].click();
    return;
  }
  if (event.key !== "Enter") return;
  const pageJump = event.target.closest("[data-document-page-jump]");
  if (pageJump) {
    event.preventDefault();
    jumpToDocumentPage(pageJump);
    return;
  }
  const documentLink = event.target.closest("[data-document-link]");
  if (documentLink) {
    event.preventDefault();
    await openLinkedDocument(documentLink);
  }
});

documentPages.addEventListener("click", async (event) => {
  const workbookTab = event.target.closest("[data-workbook-sheet-target]");
  if (workbookTab) {
    const workbook = workbookTab.closest(".workbook-document");
    const targetId = workbookTab.dataset.workbookSheetTarget;
    workbook.querySelectorAll("[data-workbook-sheet-target]").forEach((tab) => {
      const selected = tab === workbookTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    workbook.querySelectorAll(".workbook-sheet").forEach((sheet) => {
      sheet.hidden = sheet.id !== `workbook-sheet-${targetId}`;
    });
    workbook.querySelector(`#workbook-sheet-${targetId} .workbook-sheet-scroll`)?.scrollTo({ left: 0, top: 0 });
    return;
  }
  const pageJump = event.target.closest("[data-document-page-jump]");
  if (pageJump) {
    event.preventDefault();
    jumpToDocumentPage(pageJump);
    return;
  }
  const link = event.target.closest("[data-document-link]");
  if (!link) return;
  event.preventDefault();
  await openLinkedDocument(link);
});

documentModal.addEventListener("click", (event) => {
  if (!event.target.closest("[data-document-close]")) return;
  closeOrReturnDocument();
});

function closeSearchImagePreview() {
  const preview = document.querySelector("[data-search-image-lightbox]");
  if (!preview) return;
  preview.remove();
  document.body.classList.remove("has-search-image-lightbox");
}

function closeBloggerBookPreview() {
  document.querySelector("[data-blogger-book-overlay]")?.remove();
  document.body.classList.remove("has-blogger-book-overlay");
}

document.addEventListener("click", (event) => {
  const bloggerBookButton = event.target.closest(".bili-entry-button");
  if (bloggerBookButton) {
    event.preventDefault();
    closeBloggerBookPreview();
    const overlay = document.createElement("div");
    overlay.className = "blogger-book-overlay";
    overlay.dataset.bloggerBookOverlay = "true";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "博主图鉴预览");
    overlay.innerHTML = `<div class="blogger-book-window"><button type="button" class="blogger-book-close" data-blogger-book-close aria-label="关闭博主图鉴">×</button><iframe src="/blogger-book/index.html" title="博主图鉴实时选品系统"></iframe></div>`;
    document.body.append(overlay);
    document.body.classList.add("has-blogger-book-overlay");
    overlay.querySelector("[data-blogger-book-close]").focus();
    return;
  }
  const bloggerBookOverlay = event.target.closest("[data-blogger-book-overlay]");
  if (bloggerBookOverlay && (event.target === bloggerBookOverlay || event.target.closest("[data-blogger-book-close]"))) {
    closeBloggerBookPreview();
    return;
  }
  const imageLink = event.target.closest("[data-search-image-preview]");
  if (imageLink) {
    event.preventDefault();
    closeSearchImagePreview();
    const preview = document.createElement("div");
    preview.className = "search-image-lightbox";
    preview.dataset.searchImageLightbox = "true";
    preview.setAttribute("role", "dialog");
    preview.setAttribute("aria-modal", "true");
    preview.setAttribute("aria-label", "图片放大预览");
    preview.innerHTML = `<button type="button" class="search-image-lightbox-close" data-search-image-lightbox-close aria-label="关闭图片预览">×</button><img src="${imageLink.href}" alt="${imageLink.querySelector("img")?.alt || "产品方案图片"}">`;
    document.body.append(preview);
    document.body.classList.add("has-search-image-lightbox");
    preview.querySelector("[data-search-image-lightbox-close]").focus();
    return;
  }
  const preview = event.target.closest("[data-search-image-lightbox]");
  if (preview && (event.target === preview || event.target.closest("[data-search-image-lightbox-close]"))) closeSearchImagePreview();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSearchImagePreview();
    closeBloggerBookPreview();
  }
  if (event.key === "Escape" && !documentModal.hidden) closeOrReturnDocument();
  if (!documentModal.hidden && documentModal.classList.contains("is-memory-experience") && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
    console.log("TODO: switch product experience", event.key);
  }
  if (!documentModal.hidden && (documentModal.classList.contains("is-memory-experience") || documentModal.classList.contains("is-model-experience") || documentModal.classList.contains("is-search-experience")) && event.key === "Tab") {
    const experience = documentModal.querySelector(".memory-experience, .model-experience, .search-experience");
    const focusable = [documentModalClose, ...(experience ? experience.querySelectorAll("button, [href], [tabindex=\"0\"]") : [])].filter((element, index, list) => element && !element.disabled && !element.hidden && list.indexOf(element) === index);
    const currentIndex = focusable.indexOf(document.activeElement);
    if (event.shiftKey && currentIndex <= 0) {
      event.preventDefault();
      focusable.at(-1).focus();
    } else if (!event.shiftKey && currentIndex === focusable.length - 1) {
      event.preventDefault();
      focusable[0].focus();
    }
  }
});

const preloadAllRoomImages = () => PAGE_NAVIGATION
  .filter((page) => page.type === "room")
  .forEach((page) => {
    warmRoomImage(page.roomId);
    warmRoomDocuments(page.roomId);
  });
if ("requestIdleCallback" in window) window.requestIdleCallback(preloadAllRoomImages, { timeout: 1800 });
else window.setTimeout(preloadAllRoomImages, 700);

function navigateWithArrow(button, direction) {
  const source = currentPageId === "overview" ? "overview-arrow" : "detail-arrow";
  navigateToPage(button.dataset.pageId, direction, source);
}

previousButton.addEventListener("click", () => navigateWithArrow(previousButton, "previous"));
nextButton.addEventListener("click", () => navigateWithArrow(nextButton, "next"));

function syncNavigationToLocation(animate = true) {
  const room = roomFromPath(window.location.pathname);
  const targetPageId = room?.id || "overview";
  if (targetPageId === currentPageId) return;
  if (transitioning) {
    historySyncPending = true;
    return;
  }
  if (room) transitionToRoom(room, "none", animate);
  else transitionToOverview("none", animate);
}

window.addEventListener("popstate", () => {
  closeDocumentModal(false);
  syncBranding();
  syncNavigationToLocation(true);
});

if (initialRoom) {
  transitionToRoom(initialRoom, "replace", false);
} else {
  renderOverviewDirectory();
  detail.classList.add("is-visible");
  commitHistory("/", "replace");
  setNavigationState("overview");
  updateVisualControls("overview");
  updateDocument(null);
}
