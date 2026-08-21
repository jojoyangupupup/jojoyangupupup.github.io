#!/usr/bin/env python3
"""Extract the current doorstep house without changing its RGB content."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/rooms/doorstep-house-contact-source.png"
OUTPUT = ROOT / "assets/rooms/doorstep-house-contact-transparent.png"

# Clockwise outer silhouette in the source image's 1315 x 1197 coordinates.
# The points sit just outside the roof, wall, and floor edges so pale structural
# pixels remain intact while every pixel beyond the house becomes transparent.
HOUSE_OUTLINE = (
    (646, 18),
    (1170, 334),
    (1174, 878),
    (1129, 920),
    (616, 1204),
    (592, 1204),
    (116, 874),
    (126, 344),
)

SUPERSAMPLE = 4


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (1315, 1197):
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
