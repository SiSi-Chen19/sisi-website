import math
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / ".codex_deps"))

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ASSET_DIR = Path(r"C:\Users\cxc05\Desktop\素材")
OUT_DIR = ASSET_DIR / "生成3D视频"
FPS = 24
SIZE = (1280, 720)


def ease(t):
    return 0.5 - 0.5 * math.cos(math.pi * max(0, min(1, t)))


def cover_image(path, size=SIZE):
    img = Image.open(path).convert("RGB")
    sw, sh = size
    iw, ih = img.size
    scale = max(sw / iw, sh / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    img = img.resize((nw, nh), Image.LANCZOS)
    return img.crop(((nw - sw) // 2, (nh - sh) // 2, (nw + sw) // 2, (nh + sh) // 2))


def fit_image(path, box):
    img = Image.open(path).convert("RGB")
    bw, bh = box
    iw, ih = img.size
    scale = min(bw / iw, bh / ih)
    nw, nh = int(iw * scale), int(ih * scale)
    canvas = Image.new("RGBA", box, (0, 0, 0, 0))
    img = img.resize((nw, nh), Image.LANCZOS).convert("RGBA")
    canvas.alpha_composite(img, ((bw - nw) // 2, (bh - nh) // 2))
    return canvas


def gradient_bg(t, theme="rose"):
    w, h = SIZE
    y = np.linspace(0, 1, h)[:, None]
    x = np.linspace(0, 1, w)[None, :]
    pulse = 0.5 + 0.5 * math.sin(t * math.tau)
    if theme == "teal":
        top = np.array([18, 36, 57])
        bottom = np.array([20, 105, 115])
        accent = np.array([255, 210, 90])
    elif theme == "violet":
        top = np.array([33, 22, 60])
        bottom = np.array([115, 45, 110])
        accent = np.array([95, 220, 255])
    else:
        top = np.array([38, 31, 48])
        bottom = np.array([210, 80, 120])
        accent = np.array([255, 225, 170])
    base = (top * (1 - y) + bottom * y).astype(np.float32)[:, None, :]
    glow = np.exp(-(((x - 0.68 - 0.08 * math.sin(t * math.tau)) ** 2) / 0.05 + ((y - 0.42) ** 2) / 0.09))
    arr = base + glow[..., None] * accent * (0.34 + 0.18 * pulse)
    arr += (np.sin((x * 8 + t * 3) * math.tau) * 8 + np.cos((y * 5 - t * 2) * math.tau) * 7)[..., None]
    return Image.fromarray(np.uint8(np.clip(arr, 0, 255)), "RGB").filter(ImageFilter.GaussianBlur(0.3)).convert("RGBA")


def add_particles(draw, t, count=70, color=(255, 238, 190)):
    random.seed(321)
    w, h = SIZE
    for i in range(count):
        bx = random.random()
        by = random.random()
        speed = 0.12 + random.random() * 0.28
        x = (bx + math.sin((t + bx) * math.tau) * 0.025) * w
        y = ((by - t * speed) % 1.0) * h
        z = 0.45 + random.random() * 1.25
        r = (1.0 + random.random() * 2.8) * z
        alpha = int(55 + 130 * (0.5 + 0.5 * math.sin((t * 2 + bx) * math.tau)))
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(*color, alpha))


def perspective_coeffs(src, dst):
    matrix = []
    for (x, y), (u, v) in zip(dst, src):
        matrix.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        matrix.append([0, 0, 0, x, y, 1, -v * x, -v * y])
    a = np.array(matrix, dtype=np.float64)
    b = np.array(src, dtype=np.float64).reshape(8)
    return np.linalg.solve(a, b)


def warp_card(card, center, width, height, yaw, pitch=0.0, lift=0.0):
    w, h = card.size
    card = card.resize((int(width), int(height)), Image.LANCZOS)
    w, h = card.size
    yaw_rad = math.radians(yaw)
    squeeze_l = 1 + math.sin(yaw_rad) * 0.18
    squeeze_r = 1 - math.sin(yaw_rad) * 0.18
    edge = abs(math.sin(yaw_rad)) * w * 0.16
    skew = math.sin(math.radians(pitch)) * h * 0.08
    x, y = center
    half = w / 2
    top_l = (x - half + edge, y - h / 2 + skew - lift)
    top_r = (x + half - edge, y - h / 2 - skew - lift)
    bot_r = (x + half - edge * 0.55, y + h / 2 + skew - lift)
    bot_l = (x - half + edge * 0.55, y + h / 2 - skew - lift)
    dst = [top_l, top_r, bot_r, bot_l]
    src = [(0, 0), (w, 0), (w, h), (0, h)]
    coeffs = perspective_coeffs(src, dst)
    warped = card.transform(SIZE, Image.Transform.PERSPECTIVE, coeffs, Image.Resampling.BICUBIC)
    alpha = warped.split()[-1]
    shadow = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    shadow_layer = Image.new("RGBA", SIZE, (0, 0, 0, 160))
    shadow_layer.putalpha(alpha.filter(ImageFilter.GaussianBlur(16)))
    shadow.alpha_composite(shadow_layer, (0, 22))
    shine = Image.new("RGBA", SIZE, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shine)
    shade = int(32 + abs(math.sin(yaw_rad)) * 62)
    sd.polygon(dst, outline=(255, 255, 255, 120), fill=(255, 255, 255, max(0, 34 - shade // 2)))
    return shadow, warped, shine


def write_video(path, make_frame, seconds):
    path.parent.mkdir(parents=True, exist_ok=True)
    writer = imageio.get_writer(str(path), fps=FPS, codec="libx264", quality=8, macro_block_size=1)
    total = int(seconds * FPS)
    for frame in range(total):
        img = make_frame(frame / total, frame)
        writer.append_data(np.asarray(img.convert("RGB")))
    writer.close()


def title_intro():
    title = fit_image(ASSET_DIR / "标题.jpg", (820, 560))

    def frame(t, _):
        bg = gradient_bg(t, "teal")
        draw = ImageDraw.Draw(bg, "RGBA")
        add_particles(draw, t, 95, (255, 235, 165))
        zoom = 0.92 + 0.12 * ease(t)
        yaw = math.sin(t * math.tau) * 9
        pitch = math.cos(t * math.tau) * 4
        sh, card, shine = warp_card(title, (640, 365), 820 * zoom, 560 * zoom, yaw, pitch, 12 * math.sin(t * math.tau))
        bg.alpha_composite(sh)
        bg.alpha_composite(card)
        bg.alpha_composite(shine)
        draw = ImageDraw.Draw(bg, "RGBA")
        draw.arc((208, 32, 1072, 770), 195 + t * 360, 310 + t * 360, fill=(255, 240, 160, 135), width=3)
        draw.arc((138, -32, 1142, 830), 10 - t * 260, 120 - t * 260, fill=(105, 230, 255, 95), width=4)
        return bg

    write_video(OUT_DIR / "01_标题_3D开场.mp4", frame, 4.5)


def carousel():
    names = ["小兰.jpg", "美琪.jpg", "小丝.jpg", "抚子.jpg", "奇迹.jpg", "婴儿.jpg"]
    cards = [fit_image(ASSET_DIR / n, (390, 500)) for n in names]

    def frame(t, _):
        bg = gradient_bg(t, "rose")
        draw = ImageDraw.Draw(bg, "RGBA")
        add_particles(draw, t, 60, (255, 230, 230))
        items = []
        for i, card in enumerate(cards):
            a = t * math.tau + i * math.tau / len(cards)
            z = math.cos(a)
            x = 640 + math.sin(a) * 430
            y = 360 + math.sin(a * 2) * 18
            scale = 0.55 + (z + 1) * 0.22
            yaw = -math.sin(a) * 36
            items.append((z, card, (x, y), scale, yaw))
        for z, card, center, scale, yaw in sorted(items, key=lambda item: item[0]):
            sh, warped, shine = warp_card(card, center, 390 * scale, 500 * scale, yaw, 3 * z)
            if z < -0.15:
                warped = ImageEnhance.Brightness(warped).enhance(0.74)
            bg.alpha_composite(sh)
            bg.alpha_composite(warped)
            bg.alpha_composite(shine)
        draw.ellipse((260, 602, 1020, 676), outline=(255, 255, 255, 90), width=2)
        return bg

    write_video(OUT_DIR / "02_人物_3D环绕轮播.mp4", frame, 6)


def transform_showcase():
    names = ["小兰变身.jpg", "美琪变身.jpg", "小丝变身.jpg", "方块变身.jpg"]
    cards = [fit_image(ASSET_DIR / n, (360, 560)) for n in names]

    def frame(t, _):
        bg = gradient_bg(t, "violet")
        draw = ImageDraw.Draw(bg, "RGBA")
        add_particles(draw, (t * 1.4) % 1, 115, (180, 245, 255))
        for r in range(5):
            pad = 70 + r * 48
            alpha = 34 + r * 8
            draw.rounded_rectangle((pad, 76 + r * 10, 1280 - pad, 690 - r * 15), radius=26, outline=(255, 255, 255, alpha), width=2)
        for i, card in enumerate(cards):
            local = (t + i / len(cards)) % 1
            x = 160 + i * 320 + math.sin((t + i * 0.2) * math.tau) * 25
            y = 365 + math.cos((t + i * 0.3) * math.tau) * 22
            scale = 0.88 + 0.08 * math.sin((t + i * 0.17) * math.tau)
            yaw = math.sin(local * math.tau) * 24
            sh, warped, shine = warp_card(card, (x, y), 360 * scale, 560 * scale, yaw, -5)
            bg.alpha_composite(sh)
            bg.alpha_composite(warped)
            bg.alpha_composite(shine)
        return bg

    write_video(OUT_DIR / "03_变身_3D展示台.mp4", frame, 6)


def flip_pair(src_name, dst_name, out_name, theme):
    front = fit_image(ASSET_DIR / src_name, (520, 610))
    back = fit_image(ASSET_DIR / dst_name, (520, 610))

    def frame(t, _):
        bg = gradient_bg(t, theme)
        draw = ImageDraw.Draw(bg, "RGBA")
        add_particles(draw, (t * 1.8) % 1, 120, (255, 245, 190))
        spin = ease((t * 1.18) % 1)
        yaw = -88 + spin * 176
        active = front if spin < 0.5 else back
        if spin >= 0.5:
            yaw -= 180
        scale = 0.88 + 0.08 * math.sin(t * math.tau)
        sh, warped, shine = warp_card(active, (640, 355), 520 * scale, 610 * scale, yaw, math.sin(t * math.tau) * 5)
        bg.alpha_composite(sh)
        bg.alpha_composite(warped)
        bg.alpha_composite(shine)
        ring = 90 + 35 * math.sin(t * math.tau)
        draw.arc((640 - 430 - ring, 360 - 430, 640 + 430 + ring, 360 + 430), t * 360, t * 360 + 130, fill=(255, 250, 190, 145), width=5)
        draw.arc((640 - 510, 360 - 350 - ring, 640 + 510, 360 + 350 + ring), 210 - t * 410, 335 - t * 410, fill=(130, 235, 255, 120), width=4)
        return bg

    write_video(OUT_DIR / out_name, frame, 4.5)


def video_texture(src_name, out_name, theme):
    reader = imageio.get_reader(str(ASSET_DIR / src_name))
    frames = []
    for i, frame in enumerate(reader):
        if i % 2 == 0:
            img = Image.fromarray(frame).convert("RGB")
            iw, ih = img.size
            scale = min(720 / iw, 470 / ih)
            img = img.resize((int(iw * scale), int(ih * scale)), Image.LANCZOS)
            canvas = Image.new("RGBA", (720, 470), (0, 0, 0, 0))
            canvas.alpha_composite(img.convert("RGBA"), ((720 - img.width) // 2, (470 - img.height) // 2))
            frames.append(canvas)
        if len(frames) >= FPS * 5:
            break
    reader.close()
    if not frames:
        return

    def frame(t, idx):
        bg = gradient_bg(t, theme)
        draw = ImageDraw.Draw(bg, "RGBA")
        add_particles(draw, t, 75, (210, 245, 255))
        source = frames[idx % len(frames)]
        yaw = math.sin(t * math.tau) * 18
        pitch = math.cos(t * math.tau) * 5
        sh, warped, shine = warp_card(source, (640, 360), 800, 520, yaw, pitch, 16 * math.sin(t * math.tau))
        bg.alpha_composite(sh)
        bg.alpha_composite(warped)
        bg.alpha_composite(shine)
        draw.line((250, 640, 1030, 640), fill=(255, 255, 255, 105), width=2)
        draw.ellipse((315, 594, 965, 706), outline=(255, 255, 255, 75), width=2)
        return bg

    write_video(OUT_DIR / out_name, frame, 5)


def save_contact_sheet():
    thumbs = []
    font_path = Path(r"C:\Windows\Fonts\msyh.ttc")
    font = ImageFont.truetype(str(font_path), 16) if font_path.exists() else ImageFont.load_default()
    for mp4 in sorted(OUT_DIR.glob("*.mp4")):
        reader = imageio.get_reader(str(mp4))
        frame = Image.fromarray(reader.get_data(min(24, reader.count_frames() - 1))).convert("RGB")
        reader.close()
        frame.thumbnail((300, 170), Image.LANCZOS)
        tile = Image.new("RGB", (320, 220), (24, 24, 30))
        tile.paste(frame, (10, 10))
        d = ImageDraw.Draw(tile)
        d.text((10, 188), mp4.name, fill=(235, 235, 235), font=font)
        thumbs.append(tile)
    if not thumbs:
        return
    sheet = Image.new("RGB", (640, math.ceil(len(thumbs) / 2) * 220), (18, 18, 24))
    for i, tile in enumerate(thumbs):
        sheet.paste(tile, ((i % 2) * 320, (i // 2) * 220))
    sheet.save(OUT_DIR / "视频预览索引.jpg", quality=92)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    title_intro()
    carousel()
    transform_showcase()
    flip_pair("小兰.jpg", "小兰变身.jpg", "04_小兰_3D翻转变身.mp4", "teal")
    flip_pair("美琪.jpg", "美琪变身.jpg", "05_美琪_3D翻转变身.mp4", "rose")
    flip_pair("小丝.jpg", "小丝变身.jpg", "06_小丝_3D翻转变身.mp4", "violet")
    video_texture("视频1.mp4", "07_视频1_3D透视舞台.mp4", "teal")
    video_texture("视频2 .mp4", "08_视频2_3D透视舞台.mp4", "rose")
    save_contact_sheet()
    print(f"Generated videos in: {OUT_DIR}")


if __name__ == "__main__":
    main()
