#!/usr/bin/env python3
"""Match the supplied doorstep scene's outer background to the page canvas."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/rooms/doorstep-house-full.png"
OUTPUT = ROOT / "assets/rooms/doorstep-house-final.png"
CANVAS = (235, 230, 222)

# The complete house silhouette in source pixels. The lower points follow the
# outside edge of the plinth, preserving its full depth while excluding only
# the three marked background/shadow areas beyond it.
HOUSE_OUTLINE = (
    (655, 16),
    (1160, 334),
    (1160, 807),
    (1163, 807),
    (1163, 853),
    (1150, 859),
    (1100, 893),
    (1050, 927),
    (1000, 961),
    (950, 995),
    (900, 1030),
    (850, 1065),
    (800, 1099),
    (750, 1135),
    (700, 1171),
    (657, 1199),
    (650, 1193),
    (600, 1158),
    (500, 1088),
    (400, 1019),
    (300, 950),
    (200, 881),
    (150, 849),
    (142, 849),
    (142, 808),
    (154, 808),
    (154, 337),
)

SUPERSAMPLE = 4


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    if source.size != (1312, 1199):
        raise ValueError(f"Unexpected source size: {source.size}")

    mask = Image.new("L", (source.width * SUPERSAMPLE, source.height * SUPERSAMPLE), 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon(
        [(x * SUPERSAMPLE, y * SUPERSAMPLE) for x, y in HOUSE_OUTLINE],
        fill=255,
    )
    mask = mask.resize(source.size, Image.Resampling.LANCZOS)

    background = Image.new("RGB", source.size, CANVAS)
    matched = Image.composite(source, background, mask)
    matched.save(OUTPUT, optimize=True)


if __name__ == "__main__":
    main()
