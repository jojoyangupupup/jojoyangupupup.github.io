#!/usr/bin/env python3
"""Extract the doorstep house without changing its canvas or RGB content."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/rooms/doorstep-final.png"
OUTPUT = ROOT / "assets/rooms/doorstep-house-transparent.png"

# Clockwise outer silhouette in the source image's 1626 x 967 coordinates.
# The points sit just outside the roof, wall, and floor edges so pale structural
# pixels remain intact while every pixel beyond the house becomes transparent.
HOUSE_OUTLINE = (
    (724, 73.5),
    (1104.5, 290),
    (1104.5, 675.5),
    (719, 888.5),
    (331, 659),
    (331, 290),
)

SUPERSAMPLE = 4


def main() -> None:
    source = Image.open(SOURCE).convert("RGBA")
    if source.size != (1626, 967):
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
