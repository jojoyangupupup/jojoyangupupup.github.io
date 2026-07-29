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
    ],
    objectHotspots: [
      {
        id: "kitchen-book",
        number: "01",
        label: "心相印营销策划",
        documentId: "heartprint-marketing",
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
