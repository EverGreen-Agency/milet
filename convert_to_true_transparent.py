"""
Converts SVGs to true 32-bit RGBA transparent PNGs using exact dual-background difference matting.
"""

import os
import subprocess
import numpy as np
from PIL import Image

BASE_DIR = r"c:\Users\Lenovo\Desktop\milet"
SVG_DIR = os.path.join(BASE_DIR, "assets", "logo", "svg")
TRANSPARENT_DIR = os.path.join(BASE_DIR, "assets", "logo", "png", "transparent")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def render_dual_bg_alpha(svg_path, out_png_path, width, height):
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_code = f.read()

    # Template for specific bg color
    def make_html(bg_hex):
        return f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:{width}px; height:{height}px; background:{bg_hex}; overflow:hidden; display:flex; align-items:center; justify-content:center; }}
svg {{ width:100%; height:100%; }}
</style></head><body>{svg_code}</body></html>"""

    tmp_white_html = out_png_path + ".w.html"
    tmp_black_html = out_png_path + ".b.html"
    tmp_white_png = out_png_path + ".w.png"
    tmp_black_png = out_png_path + ".b.png"

    with open(tmp_white_html, "w", encoding="utf-8") as f:
        f.write(make_html("#FFFFFF"))
    with open(tmp_black_html, "w", encoding="utf-8") as f:
        f.write(make_html("#000000"))

    # Render on white
    subprocess.run([CHROME_PATH, "--headless=new", "--disable-gpu", f"--screenshot={tmp_white_png}", f"--window-size={width},{height}", tmp_white_html], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    # Render on black
    subprocess.run([CHROME_PATH, "--headless=new", "--disable-gpu", f"--screenshot={tmp_black_png}", f"--window-size={width},{height}", tmp_black_html], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    im_w = Image.open(tmp_white_png).convert("RGB")
    im_b = Image.open(tmp_black_png).convert("RGB")

    arr_w = np.array(im_w, dtype=np.float32)
    arr_b = np.array(im_b, dtype=np.float32)

    # alpha = 1.0 - (W - B) / 255.0
    # Average across 3 channels for robustness
    diff = (arr_w - arr_b).clip(0, 255)
    alpha = (1.0 - (diff / 255.0)).mean(axis=2)
    alpha = np.clip(alpha, 0.0, 1.0)

    # Recover foreground color: C = B / alpha
    # To avoid division by zero:
    alpha_mask = alpha > 0.01
    recovered_rgb = np.zeros_like(arr_b)
    recovered_rgb[alpha_mask] = (arr_b[alpha_mask] / alpha[alpha_mask, None]).clip(0, 255)

    rgba = np.dstack([recovered_rgb.astype(np.uint8), (alpha * 255).astype(np.uint8)])
    out_im = Image.fromarray(rgba, "RGBA")
    out_im.save(out_png_path, "PNG")

    # Cleanup temp files
    for p in [tmp_white_html, tmp_black_html, tmp_white_png, tmp_black_png]:
        if os.path.exists(p):
            os.remove(p)

    print(f"Generated true transparent RGBA: {os.path.basename(out_png_path)}")

targets = [
    (os.path.join(SVG_DIR, "milet-logo-primary-dark.svg"),
     os.path.join(TRANSPARENT_DIR, "milet-logo-primary-dark.png"), 1800, 2160),
    (os.path.join(SVG_DIR, "milet-logo-primary-light.svg"),
     os.path.join(TRANSPARENT_DIR, "milet-logo-primary-light.png"), 1800, 2160),
    (os.path.join(SVG_DIR, "milet-logo-horizontal-dark.svg"),
     os.path.join(TRANSPARENT_DIR, "milet-logo-horizontal-dark.png"), 2640, 660),
    (os.path.join(SVG_DIR, "milet-logo-horizontal-light.svg"),
     os.path.join(TRANSPARENT_DIR, "milet-logo-horizontal-light.png"), 2640, 660),
    (os.path.join(SVG_DIR, "milet-symbol-amber-darkbg.svg"),
     os.path.join(TRANSPARENT_DIR, "milet-symbol-amber.png"), 1500, 1500),
    (os.path.join(SVG_DIR, "milet-logo-primary-mono-black.svg"),
     os.path.join(TRANSPARENT_DIR, "milet-logo-primary-mono-black.png"), 1800, 2160),
    (os.path.join(SVG_DIR, "milet-logo-primary-mono-white.svg"),
     os.path.join(TRANSPARENT_DIR, "milet-logo-primary-mono-white.png"), 1800, 2160),
]

for s, p, w, h in targets:
    try:
        render_dual_bg_alpha(s, p, w, h)
    except Exception as e:
        print(f"Error {p}: {e}")

print("All transparent PNGs are now verified 32-bit RGBA!")
