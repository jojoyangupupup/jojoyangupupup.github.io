#!/usr/bin/env python3
"""Extract the current doorstep house without changing its RGB content."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/rooms/doorstep-house-contact-source.png"
OUTPUT = ROOT / "assets/rooms/doorstep-house-contact-transparent.png"

# Clockwise outer silhouette in the source image's 1312 x 1199 coordinates.
# The points sit just outside the roof, wall, and floor edges so pale structural
# pixels remain intact while every pixel beyond the house becomes transparent.
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
    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (1312, 1199):
        raise ValueError(f"Unexpected source size: {source.size}")

    mask = Image.new(
        "L",
        (source.width * SUPERSAMPLE, source.height * SUPERSAMPLE),
        0,
    )
    points = [(x * SUPERSAMPLE, y * SUPERSAMPLE) for x, y in HOUSE_OUTLINE]
    ImageDraw.Draw(mask).polygon(points, fill=255)
    mask = mask.resize(source.size, Image.Resampling.LANCZOS)

    source.putalpha(mask)
    source.save(OUTPUT, optimize=True)


if __name__ == "__main__":
    main()
