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
} from "/scripts/rooms-data.js?v=15";

const FOCUS_TIMING = {
  expandStart: 80,
  crossfadeStart: 300,
  detailStart: 700,
  total: 950,
};
const REDUCED_FOCUS_TIMING = { crossfadeStart: 30, detailStart: 110, total: 200 };
const ROOM_SWITCH_MS = 500;
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
              </defs>
              ${ROOMS.flatMap((room) => (room.objectHotspots || []).map((object) => `
                <path
                  class="room-object-hotspot"
                  tabindex="0"
                  role="button"
                  data-room-id="${room.id}"
                  data-object-id="${object.id}"
                  aria-label="Open ${object.label} document"
                  d="${object.path}"
                ></path>
                ${object.glowImage ? `
                  <image
                    class="room-object-glow"
                    data-room-id="${room.id}"
                    href="${object.glowImage.file}"
                    x="${object.glowImage.x}"
                    y="${object.glowImage.y}"
                    width="${object.glowImage.width}"
                    height="${object.glowImage.height}"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  ></image>
                ` : ""}
              `)).join("")}
            </svg>
          </div>

          <nav class="room-switch-controls" aria-label="Adjacent portfolio categories" hidden>
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
        </div>
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

function renderDetail(room) {
  detail.innerHTML = `
    <p class="detail-kicker">${room.number} / Category</p>
    <h1 class="detail-title" tabindex="-1">${room.title}</h1>
    <p class="detail-description">${room.description}</p>
    <section class="projects-section" aria-labelledby="projects-heading">
      <h2 class="projects-label" id="projects-heading">Selected Work</h2>
      <ol class="project-list">
        ${room.projects.map((project, index) => `
          <li id="${project.id}">
            <a class="project-link" href="${room.path}#${project.id}" aria-label="${project.title}, ${project.type}, ${project.year}">
              <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
              <span class="project-copy">
                <span class="project-title">${project.title}</span>
                <span class="project-type">${project.type}</span>
              </span>
              <span class="project-year">${project.year}</span>
            </a>
          </li>
        `).join("")}
      </ol>
    </section>
  `;
}

function getRoomObject(roomId, objectId) {
  const room = ROOMS.find((item) => item.id === roomId);
  const object = room?.objectHotspots?.find((item) => item.id === objectId);
  const documentEntry = room?.documents?.find((item) => item.id === object?.documentId);
  return { room, object, documentEntry };
}

function renderedDocumentPage(documentEntry, pageNumber) {
  const { basePath, extension } = documentEntry.renderedPages;
  return `${basePath}/page-${String(pageNumber).padStart(2, "0")}.${extension}`;
}

function renderDocumentPages(documentEntry) {
  const { width, height } = documentEntry.renderedPages;
  documentPages.innerHTML = Array.from({ length: documentEntry.pages }, (_, index) => {
    const pageNumber = index + 1;
    return `
      <div class="document-page">
        <img
          src="${renderedDocumentPage(documentEntry, pageNumber)}"
          width="${width}"
          height="${height}"
          loading="${pageNumber === 1 ? "eager" : "lazy"}"
          decoding="async"
          ${pageNumber === 1 ? 'fetchpriority="high"' : ""}
          alt="${documentEntry.title}, page ${pageNumber} of ${documentEntry.pages}"
        >
      </div>
    `;
  }).join("");
}

function openDocumentModal(room, object, documentEntry, trigger) {
  syncBranding();
  documentReturnFocus = trigger || document.activeElement;
  renderDocumentPages(documentEntry);
  documentModalDialog.setAttribute("aria-label", documentEntry.title);
  documentModal.hidden = false;
  documentModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-document-open");
  documentModalScroll.scrollTop = 0;
  documentModalClose.focus({ preventScroll: true });
}

function closeDocumentModal(restoreFocus = true) {
  if (documentModal.hidden) return;
  documentModal.hidden = true;
  documentModal.setAttribute("aria-hidden", "true");
  documentPages.replaceChildren();
  document.body.classList.remove("is-document-open");
  if (restoreFocus) documentReturnFocus?.focus({ preventScroll: true });
  documentReturnFocus = null;
}

function openRoomObject(roomId, objectId, trigger) {
  if (transitioning || currentPageId !== roomId) return;
  const { room, object, documentEntry } = getRoomObject(roomId, objectId);
  if (!room || !object || !documentEntry) return;
  openDocumentModal(room, object, documentEntry, trigger);
}

function showRoomCaption(room) {
  const caption = document.createElement("p");
  caption.className = "visual-caption";
  caption.textContent = `${room.number} / ${room.title}`;
  stage.querySelector(".visual-caption")?.remove();
  stage.append(caption);
}

function removeVisualCaption() {
  stage.querySelector(".visual-caption")?.remove();
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
  stage.style.setProperty("--switch-enter-x", `${sign * 16}px`);
  stage.style.setProperty("--switch-exit-x", `${sign * -12}px`);
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

async function focusFromOverview(room) {
  setFocusRoom(room);
  portfolioMain.dataset.page = "transition";
  stage.dataset.view = "transition";
  stage.classList.add("is-focus-transition");
  stage.getBoundingClientRect();
  stage.classList.add("is-focus-selecting");

  if (prefersReducedMotion.matches) {
    await wait(REDUCED_FOCUS_TIMING.crossfadeStart);
    stage.classList.add("is-focus-crossfading");
    await wait(REDUCED_FOCUS_TIMING.detailStart - REDUCED_FOCUS_TIMING.crossfadeStart);
    detail.classList.add("is-visible");
    await wait(REDUCED_FOCUS_TIMING.total - REDUCED_FOCUS_TIMING.detailStart);
    return;
  }

  await wait(FOCUS_TIMING.expandStart);
  stage.classList.add("is-focus-expanding");
  await wait(FOCUS_TIMING.crossfadeStart - FOCUS_TIMING.expandStart);
  stage.classList.add("is-focus-crossfading");
  await wait(FOCUS_TIMING.detailStart - FOCUS_TIMING.crossfadeStart);
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
  const imageReady = await preloadImage(room.image);
  if (!imageReady) {
    setLocked(false);
    return;
  }

  if (fromOverview && !animate) clearOverviewInteractionState();
  if (fromOverview && !animate) portfolioMain.dataset.page = room.id;
  incomingImage.src = room.image;
  incomingImage.alt = room.alt;
  incomingImage.removeAttribute("aria-hidden");
  if (!fromOverview && animate) detail.classList.add("is-updating");
  renderDetail(room);
  setNavigationState(room.id);

  if (animate && fromOverview) await focusFromOverview(room);
  else if (animate) await switchRoomVisual(direction);

  currentImage.src = room.image;
  currentImage.alt = room.alt;
  incomingImage.src = room.image;
  currentPageId = room.id;
  portfolioMain.dataset.page = room.id;
  stage.dataset.view = "room";
  stage.dataset.roomId = room.id;
  showRoomCaption(room);
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
  detail.classList.remove("is-visible");
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
  removeVisualCaption();
  detail.innerHTML = "";
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
  hotspot.addEventListener("pointerenter", () => warmRoomImage(id));
  hotspot.addEventListener("focus", () => warmRoomImage(id));
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
  const warmDocument = () => {
    const { documentEntry } = getRoomObject(roomId, objectId);
    if (documentEntry?.renderedPages) preloadImage(renderedDocumentPage(documentEntry, 1));
  };
  hotspot.addEventListener("click", activate);
  hotspot.addEventListener("pointerenter", warmDocument);
  hotspot.addEventListener("focus", warmDocument);
  hotspot.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    activate();
  });
});

documentModal.addEventListener("click", (event) => {
  if (!event.target.closest("[data-document-close]")) return;
  closeDocumentModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !documentModal.hidden) closeDocumentModal();
});

const preloadAllRoomImages = () => PAGE_NAVIGATION
  .filter((page) => page.type === "room")
  .forEach((page) => warmRoomImage(page.roomId));
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
  commitHistory("/", "replace");
  setNavigationState("overview");
  updateVisualControls("overview");
  updateDocument(null);
}
