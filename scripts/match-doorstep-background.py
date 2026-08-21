#!/usr/bin/env python3
"""Match the supplied doorstep scene's outer background to the page canvas."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/rooms/doorstep-house-full.png"
OUTPUT = ROOT / "assets/rooms/doorstep-house-full-matched.png"
CANVAS = (235, 230, 222)

# The complete house silhouette, including the lower plinth, in source pixels.
HOUSE_OUTLINE = (
    (655, 16),
    (1160, 334),
    (1163, 878),
    (1122, 921),
    (657, 1205),
    (631, 1205),
    (142, 875),
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
