#!/usr/bin/env python3
"""Match the supplied doorstep scene's outer background to the page canvas."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/rooms/doorstep-house-full.png"
OUTPUT = ROOT / "assets/rooms/doorstep-house-final.png"
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

# The three regions marked in 4901.png: the outer right wall edge and the two
# lower plinth sections. Everything else remains from the supplied scene.
REMOVED_REGIONS = (
    ((1148, 330), (1168, 336), (1167, 878), (1152, 892), (1144, 878)),
    ((140, 814), (657, 1150), (660, 1205), (631, 1205), (140, 878)),
    ((657, 1150), (1160, 814), (1167, 920), (660, 1205)),
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
    for region in REMOVED_REGIONS:
        draw.polygon(
            [(x * SUPERSAMPLE, y * SUPERSAMPLE) for x, y in region],
            fill=0,
        )
    mask = mask.resize(source.size, Image.Resampling.LANCZOS)

    background = Image.new("RGB", source.size, CANVAS)
    matched = Image.composite(source, background, mask)
    matched.save(OUTPUT, optimize=True)


if __name__ == "__main__":
    main()
