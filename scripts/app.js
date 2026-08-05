import {
  OVERVIEW_IMAGE,
  OVERVIEW_MOTION_OBJECTS,
  OVERVIEW_SIZE,
  PAGE_NAVIGATION,
  PORTFOLIO,
  ROOMS,
  SHOW_HOTSPOTS,
  adjacentPages,
  roomFromPath,
} from "/scripts/rooms-data.js?v=37";

const FOCUS_TIMING = {
  expandStart: 80,
  crossfadeStart: 300,
  detailStart: 700,
  total: 950,
};
const REDUCED_FOCUS_TIMING = { crossfadeStart: 30, detailStart: 110, total: 200 };
const ROOM_SWITCH_MS = 300;
const DISCOVERY_STORAGE_KEY = "portfolio-discovered-items-v1";
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
            <div class="overview-motion-layer" aria-hidden="true">
              ${OVERVIEW_MOTION_OBJECTS.map((object) => `
                <img
                  class="overview-motion-object motion-${object.motion}${object.mobile ? "" : " scatter-mobile-hidden"}"
                  src="/assets/rooms/overview-motion/${object.id}.webp"
                  width="${object.width}"
                  height="${object.height}"
                  alt=""
                  draggable="false"
                  style="--object-x:${object.x}%;--object-y:${object.y}%;--object-width:${object.size}%;--motion-duration:${object.duration}s;--motion-delay:${object.delay}s"
                >
              `).join("")}
            </div>
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
                    aria-label="Open ${object.label}${object.documentIds?.length > 1 ? " and related documents" : " document"}"
                    d="${object.path}"
                  ></path>
                  ${object.glowImage ? `
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

function renderDetail(room, { entering = false } = {}) {
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
      ${renderItems(section.items)}
      ${(section.paragraphsAfter || []).map((paragraph) => `<p>${paragraph}</p>`).join("")}
      ${(section.subsections || []).map((subsection) => renderSection(subsection, true)).join("")}
      ${section.note ? `<p class="document-text-note">${section.note}</p>` : ""}
    </section>
  `;
  return (documentEntry.textSections || []).map((section) => renderSection(section)).join("");
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
  const wideTable = documents.some((documentEntry) => documentEntry.layout === "wide-table");
  documentPages.classList.toggle("is-comparison", comparison);
  documentPages.classList.toggle("is-embed", embedded);
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
    if (documentEntry.contentType === "text") {
      return `
        <article class="document-column document-text-column" aria-label="${documentEntry.columnLabel || documentEntry.title}">
          ${heading}
          <div class="document-text-content">${renderDocumentText(documentEntry)}</div>
        </article>
      `;
    }
    const { width, height, pageHeights } = documentEntry.renderedPages;
    const pages = Array.from({ length: documentEntry.pages }, (_, index) => {
      const pageNumber = index + 1;
      const pageHeight = pageHeights?.[index] || height;
      return `
        <div class="document-page${documentEntry.transparentPages ? " is-transparent" : ""}" id="document-${documentEntry.id}-page-${pageNumber}">
          <img
            src="${renderedDocumentPage(documentEntry, pageNumber)}"
            width="${width}"
            height="${pageHeight}"
            loading="${pageNumber === 1 ? "eager" : "lazy"}"
            decoding="async"
          ${pageNumber === 1 ? 'fetchpriority="high"' : ""}
          alt="${documentEntry.title}, page ${pageNumber} of ${documentEntry.pages}"
        >
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
              </div>
            </section>
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
      : "";
    return `
      <article class="document-column${documentEntry.transparentPages ? " document-transparent-column" : ""}" aria-label="${documentEntry.columnLabel || documentEntry.title}">
        ${heading}
        ${workIntro}
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
  documentModalDialog.setAttribute("aria-label", documents.map((documentEntry) => documentEntry.title).join(" / "));
  documentModalScroll.scrollTop = scrollTop;
  documentPages.querySelectorAll(".document-column").forEach((column) => { column.scrollTop = 0; });
  updateDocumentCloseAction();
  scheduleWorkIntroCta();
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
  disconnectWorkIntroCta();
  documentModal.hidden = true;
  documentModal.setAttribute("aria-hidden", "true");
  documentPages.replaceChildren();
  documentModal.classList.remove("is-transparent-document");
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !documentModal.hidden) closeOrReturnDocument();
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
