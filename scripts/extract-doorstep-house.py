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

# The supplied 4900.jpg marks these three structural pieces for removal:
# the narrow outside edge of the right wall and the two white plinth sections
# below the left and right front floor edges. They are cut from the alpha mask,
# while the room, floor surface, and interior objects remain pixel-identical.
REMOVED_REGIONS = (
    ((1148, 330), (1168, 336), (1167, 878), (1152, 892), (1144, 878)),
    # Keep a narrow structural plinth directly below each floor edge so the
    # house retains its dimensional, grounded profile after background removal.
    ((140, 840), (657, 1174), (660, 1205), (631, 1205), (140, 878)),
    ((657, 1174), (1160, 840), (1167, 920), (660, 1205)),
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
    draw = ImageDraw.Draw(mask)
    draw.polygon(points, fill=255)
    for region in REMOVED_REGIONS:
        draw.polygon([(x * SUPERSAMPLE, y * SUPERSAMPLE) for x, y in region], fill=0)
    mask = mask.resize(source.size, Image.Resampling.LANCZOS)

    source.putalpha(mask)
    source.save(OUTPUT, optimize=True)


if __name__ == "__main__":
    main()
