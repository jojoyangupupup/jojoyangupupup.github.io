from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/rooms/doorstep-house-final.png"
OUTPUT = ROOT / "assets/rooms/objects"

# The page image is the source of truth. This is the plaque's pixel-space ROI
# in the 1312 x 1199 house image; no screen-size coordinates are involved.
SOURCE_CROP = (744, 157, 880, 350)
PLAQUE = (
    ((32, 12), (36, 11), (40, 11), (42, 11)),
    ((42, 11), (69, 26), (100, 43), (116, 54)),
    ((116, 54), (121, 58), (123, 64), (123, 70)),
    ((123, 70), (123, 105), (123, 143), (123, 160)),
    ((123, 160), (123, 169), (118, 176), (110, 179)),
    ((110, 179), (83, 164), (47, 145), (23, 132)),
    ((23, 132), (16, 128), (12, 121), (12, 113)),
    ((12, 113), (12, 82), (12, 53), (12, 37)),
    ((12, 37), (12, 30), (13, 26), (15, 24)),
    ((15, 24), (20, 17), (27, 13), (32, 12)),
)


def cubic(start, control_a, control_b, end, steps=12):
    points = []
    for index in range(steps):
        t = index / steps
        inverse = 1 - t
        x = (
            inverse**3 * start[0]
            + 3 * inverse**2 * t * control_a[0]
            + 3 * inverse * t**2 * control_b[0]
            + t**3 * end[0]
        )
        y = (
            inverse**3 * start[1]
            + 3 * inverse**2 * t * control_a[1]
            + 3 * inverse * t**2 * control_b[1]
            + t**3 * end[1]
        )
        points.append((round(x, 3), round(y, 3)))
    return points


def supersampled_mask(size):
    scale = 4
    mask = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    draw = ImageDraw.Draw(mask)
    points = []
    for curve_index, curve in enumerate(PLAQUE):
        start, control_a, control_b, end = curve
        if curve_index == 0:
            points.append(start)
        points.extend(cubic(start, control_a, control_b, end))
    points.append(PLAQUE[-1][-1])
    draw.polygon([(x * scale, y * scale) for x, y in points], fill=255)
    return mask.resize(size, Image.Resampling.LANCZOS)


def main():
    source = Image.open(SOURCE).convert("RGBA")
    crop = source.crop(SOURCE_CROP)
    mask = supersampled_mask(crop.size)

    # Keep only the real plaque pixels and trim the source canvas. A two-pixel
    # transparent margin is retained so the 2px expansion is never clipped.
    bbox = mask.getbbox()
    # Four pixels keep the two-pixel expanded ring away from the asset edge
    # while still removing the original image's large transparent surround.
    left = max(0, bbox[0] - 4)
    top = max(0, bbox[1] - 4)
    right = min(crop.width, bbox[2] + 4)
    bottom = min(crop.height, bbox[3] + 4)
    crop = crop.crop((left, top, right, bottom))
    mask = mask.crop((left, top, right, bottom))

    cutout = crop.copy()
    cutout.putalpha(mask)

    # MaxFilter(5) is an exact two-pixel alpha dilation on the raster mask.
    expanded = mask.filter(ImageFilter.MaxFilter(5))
    ring = ImageChops.subtract(expanded, mask)
    glow = Image.new("RGBA", crop.size, (255, 247, 223, 0))
    glow.putalpha(ring.point(lambda value: round(value * 0.95)))

    OUTPUT.mkdir(parents=True, exist_ok=True)
    cutout.save(OUTPUT / "doorstep-wechat-cutout.png")
    mask.save(OUTPUT / "doorstep-wechat-alpha-mask.png")
    glow.save(OUTPUT / "doorstep-wechat-glow.png")
    print({
        "source_crop": SOURCE_CROP,
        "asset_offset": (SOURCE_CROP[0] + left, SOURCE_CROP[1] + top),
        "asset_size": crop.size,
        "alpha_bbox": mask.getbbox(),
        "cutout": "assets/rooms/objects/doorstep-wechat-cutout.png",
        "mask": "assets/rooms/objects/doorstep-wechat-alpha-mask.png",
        "glow": "assets/rooms/objects/doorstep-wechat-glow.png",
    })


if __name__ == "__main__":
    main()
