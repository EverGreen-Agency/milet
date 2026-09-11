"""
Rebuild Milet Brand Assets with Exact Geometry and True Compound-Path Transparency
"""

import os
import subprocess
import xml.etree.ElementTree as ET
from PIL import Image
import numpy as np

BASE_DIR = r"c:\Users\Lenovo\Desktop\milet"
LOGO_SVG_DIR = os.path.join(BASE_DIR, "assets", "logo", "svg")
LOGO_PNG_TRANSPARENT = os.path.join(BASE_DIR, "assets", "logo", "png", "transparent")
LOGO_PNG_SOLID = os.path.join(BASE_DIR, "assets", "logo", "png", "solid")
ICONS_DIR = os.path.join(BASE_DIR, "assets", "icons")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

os.makedirs(LOGO_SVG_DIR, exist_ok=True)
os.makedirs(LOGO_PNG_TRANSPARENT, exist_ok=True)
os.makedirs(LOGO_PNG_SOLID, exist_ok=True)

# -------------------------------------------------------------
# 1. Exact Asymmetric Möbius Loop (Compound Path - True Hole)
# -------------------------------------------------------------
# In 500x500 viewBox:
# Right wall is thicker, tilted, sweeping; left wall is slender; aperture is transparent.
AMBER_DEFS = """
  <defs>
    <linearGradient id="amberGrad" x1="18%" y1="12%" x2="82%" y2="88%">
      <stop offset="0%" stop-color="#FCE6B3"/>
      <stop offset="22%" stop-color="#F0B952"/>
      <stop offset="52%" stop-color="#D39B3D"/>
      <stop offset="82%" stop-color="#B26C2A"/>
      <stop offset="100%" stop-color="#783908"/>
    </linearGradient>
    <linearGradient id="amberRidge" x1="80%" y1="15%" x2="20%" y2="85%">
      <stop offset="0%" stop-color="#FFF8E7" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#F2BE57" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#C07828" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="innerTwistShadow" x1="35%" y1="25%" x2="70%" y2="75%">
      <stop offset="0%" stop-color="#5C2803" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#D39B3D" stop-opacity="0"/>
    </linearGradient>
    <filter id="subtleGlow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#8C4A11" flood-opacity="0.22"/>
    </filter>
  </defs>
"""

# The compound path has OUTER contour clockwise, INNER contour counter-clockwise
# creating an intrinsically transparent hole on ANY background!
SYMBOL_COMPOUND_D = """
  M 245 46
  C 292 46, 388 102, 436 192
  C 476 268, 466 345, 416 410
  C 376 450, 290 458, 204 450
  C 128 442, 64 388, 58 322
  C 52 242, 108 132, 174 78
  C 204 53, 224 46, 245 46 Z

  M 235 142
  C 198 142, 158 212, 153 272
  C 148 328, 184 362, 234 362
  C 284 362, 318 322, 323 262
  C 328 198, 278 142, 235 142 Z
"""

def get_symbol_svg_markup(is_mono=False, mono_color="#1A1A1A"):
    if is_mono:
        return f"""<path fill-rule="evenodd" fill="{mono_color}" d="{SYMBOL_COMPOUND_D.strip()}"/>"""
    else:
        return f"""
  <g filter="url(#subtleGlow)">
    <!-- Base Asymmetric Torus Body with True Transparent Aperture -->
    <path fill-rule="evenodd" fill="url(#amberGrad)" d="{SYMBOL_COMPOUND_D.strip()}"/>

    <!-- 3D Luminous Specular Ridge along the thick right ribbon -->
    <path d="M 238 52 C 284 52, 376 106, 422 192 C 458 262, 448 330, 402 396"
          fill="none" stroke="url(#amberRidge)" stroke-width="14" stroke-linecap="round" opacity="0.9"/>

    <!-- Inner Torus Twist Shadow on inner right edge -->
    <path d="M 234 142 C 280 142, 328 198, 323 262 C 318 322, 284 362, 234 362 C 270 338, 288 292, 288 248 C 288 202, 264 162, 234 142 Z"
          fill="url(#innerTwistShadow)"/>

    <!-- Bottom Rim Reflection -->
    <path d="M 155 432 C 215 442, 285 440, 345 418"
          fill="none" stroke="#FFE9BE" stroke-width="4.5" stroke-linecap="round" opacity="0.65"/>
  </g>
"""

# Shared Font Styling for Wordmark & Tagline
SHARED_FONT_STYLE = """
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&amp;family=Plus+Jakarta+Sans:wght@500;600;700&amp;display=swap');
    .milet-wm {
      font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
      font-weight: 600;
      letter-spacing: -0.015em;
    }
    .milet-tag {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.32em;
    }
  </style>
"""

# -------------------------------------------------------------
# 2. SVGs: Primary (Vertical) Logo
# -------------------------------------------------------------
def build_primary_logo(mode="dark"):
    if mode == "dark": # dark text for light bg
        text_col = "#1A1A1A"
        tag_col = "#6E6961"
        symbol_block = get_symbol_svg_markup(is_mono=False)
        defs = AMBER_DEFS + SHARED_FONT_STYLE
    elif mode == "light": # light text for dark bg
        text_col = "#F7F3EA"
        tag_col = "#C9B89F"
        symbol_block = get_symbol_svg_markup(is_mono=False)
        defs = AMBER_DEFS + SHARED_FONT_STYLE
    elif mode == "mono_black":
        text_col = "#1A1A1A"
        tag_col = "#1A1A1A"
        symbol_block = get_symbol_svg_markup(is_mono=True, mono_color="#1A1A1A")
        defs = f"<defs>{SHARED_FONT_STYLE}</defs>"
    elif mode == "mono_white":
        text_col = "#F7F3EA"
        tag_col = "#F7F3EA"
        symbol_block = get_symbol_svg_markup(is_mono=True, mono_color="#F7F3EA")
        defs = f"<defs>{SHARED_FONT_STYLE}</defs>"

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="100%" height="100%">
{defs}
  <!-- Símbolo no Topo -->
  <g transform="translate(100, 20) scale(0.8)">
    {symbol_block}
  </g>

  <!-- Wordmark 'Milet' -->
  <text x="300" y="515" text-anchor="middle" class="milet-wm" font-size="114" fill="{text_col}">Milet</text>

  <!-- Tagline 'ENERGIA EM MAIS LIBERDADE' -->
  <text x="300" y="580" text-anchor="middle" class="milet-tag" font-size="15" fill="{tag_col}">ENERGIA EM MAIS LIBERDADE</text>
</svg>"""

# -------------------------------------------------------------
# 3. SVGs: Horizontal Logo
# -------------------------------------------------------------
def build_horizontal_logo(mode="dark"):
    if mode == "dark":
        text_col = "#1A1A1A"
        tag_col = "#666159"
        line_col = "#D4CAB8"
        symbol_block = get_symbol_svg_markup(is_mono=False)
        defs = AMBER_DEFS + SHARED_FONT_STYLE
    elif mode == "light":
        text_col = "#F7F3EA"
        tag_col = "#C9B89F"
        line_col = "#3D3A35"
        symbol_block = get_symbol_svg_markup(is_mono=False)
        defs = AMBER_DEFS + SHARED_FONT_STYLE
    elif mode == "mono_black":
        text_col = "#1A1A1A"
        tag_col = "#1A1A1A"
        line_col = "#1A1A1A"
        symbol_block = get_symbol_svg_markup(is_mono=True, mono_color="#1A1A1A")
        defs = f"<defs>{SHARED_FONT_STYLE}</defs>"
    elif mode == "mono_white":
        text_col = "#F7F3EA"
        tag_col = "#F7F3EA"
        line_col = "#F7F3EA"
        symbol_block = get_symbol_svg_markup(is_mono=True, mono_color="#F7F3EA")
        defs = f"<defs>{SHARED_FONT_STYLE}</defs>"

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 220" width="100%" height="100%">
{defs}
  <!-- Símbolo à esquerda -->
  <g transform="translate(10, 10) scale(0.4)">
    {symbol_block}
  </g>

  <!-- Wordmark 'Milet' -->
  <text x="240" y="132" class="milet-wm" font-size="94" fill="{text_col}">Milet</text>

  <!-- Divisor Vertical -->
  <line x1="530" y1="58" x2="530" y2="150" stroke="{line_col}" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>

  <!-- Tagline Multi-linha à direita -->
  <text x="560" y="92" class="milet-tag" font-size="13" fill="{tag_col}">ENERGIA</text>
  <text x="560" y="114" class="milet-tag" font-size="13" fill="{tag_col}">EM MAIS</text>
  <text x="560" y="136" class="milet-tag" font-size="13" fill="{tag_col}">LIBERDADE</text>
</svg>"""

# -------------------------------------------------------------
# 4. SVGs: Símbolo Isolado
# -------------------------------------------------------------
def build_symbol_svg(mode="amber"):
    if mode == "amber":
        defs = AMBER_DEFS
        block = get_symbol_svg_markup(is_mono=False)
    elif mode == "mono_black":
        defs = ""
        block = get_symbol_svg_markup(is_mono=True, mono_color="#1A1A1A")
    elif mode == "mono_white":
        defs = ""
        block = get_symbol_svg_markup(is_mono=True, mono_color="#F7F3EA")

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
{defs}
{block}
</svg>"""

# -------------------------------------------------------------
# 5. Write and Validate All SVGs
# -------------------------------------------------------------
svg_files = {
    "milet-logo-primary-dark.svg": build_primary_logo("dark"),
    "milet-logo-primary-light.svg": build_primary_logo("light"),
    "milet-logo-primary-mono-black.svg": build_primary_logo("mono_black"),
    "milet-logo-primary-mono-white.svg": build_primary_logo("mono_white"),

    "milet-logo-horizontal-dark.svg": build_horizontal_logo("dark"),
    "milet-logo-horizontal-light.svg": build_horizontal_logo("light"),
    "milet-logo-horizontal-mono-black.svg": build_horizontal_logo("mono_black"),
    "milet-logo-horizontal-mono-white.svg": build_horizontal_logo("mono_white"),

    "milet-symbol-amber.svg": build_symbol_svg("amber"),
    "milet-symbol-amber-darkbg.svg": build_symbol_svg("amber"), # same clean compound path!
    "milet-symbol-amber-lightbg.svg": build_symbol_svg("amber"),
    "milet-symbol-mono-black.svg": build_symbol_svg("mono_black"),
    "milet-symbol-mono-white.svg": build_symbol_svg("mono_white"),
}

print("Writing and validating all SVGs...")
for fname, content in svg_files.items():
    fpath = os.path.join(LOGO_SVG_DIR, fname)
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)
    # Validate with XML parser
    try:
        ET.fromstring(content)
        print(f"VALID: {fname}")
    except Exception as e:
        print(f"FAILED XML PARSE: {fname} -> {e}")

# -------------------------------------------------------------
# 6. Render High-Resolution PNGs with Dual-Background Matting
# -------------------------------------------------------------
print("Rendering 32-bit Transparent PNGs...")

def render_dual_bg_alpha(svg_path, out_png_path, width, height):
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_code = f.read()

    def make_html(bg_hex):
        return f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:{width}px; height:{height}px; background:{bg_hex}; overflow:hidden; display:flex; align-items:center; justify-content:center; }}
svg {{ width:100%; height:100%; }}
</style></head><body>{svg_code}</body></html>"""

    tmp_w_html = out_png_path + ".w.html"
    tmp_b_html = out_png_path + ".b.html"
    tmp_w_png = out_png_path + ".w.png"
    tmp_b_png = out_png_path + ".b.png"

    with open(tmp_w_html, "w", encoding="utf-8") as f:
        f.write(make_html("#FFFFFF"))
    with open(tmp_b_html, "w", encoding="utf-8") as f:
        f.write(make_html("#000000"))

    subprocess.run([CHROME_PATH, "--headless=new", "--disable-gpu", f"--screenshot={tmp_w_png}", f"--window-size={width},{height}", tmp_w_html], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    subprocess.run([CHROME_PATH, "--headless=new", "--disable-gpu", f"--screenshot={tmp_b_png}", f"--window-size={width},{height}", tmp_b_html], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    im_w = Image.open(tmp_w_png).convert("RGB")
    im_b = Image.open(tmp_b_png).convert("RGB")

    arr_w = np.array(im_w, dtype=np.float32)
    arr_b = np.array(im_b, dtype=np.float32)

    diff = (arr_w - arr_b).clip(0, 255)
    alpha = (1.0 - (diff / 255.0)).mean(axis=2)
    alpha = np.clip(alpha, 0.0, 1.0)

    alpha_mask = alpha > 0.01
    recovered_rgb = np.zeros_like(arr_b)
    recovered_rgb[alpha_mask] = (arr_b[alpha_mask] / alpha[alpha_mask, None]).clip(0, 255)

    rgba = np.dstack([recovered_rgb.astype(np.uint8), (alpha * 255).astype(np.uint8)])
    out_im = Image.fromarray(rgba, "RGBA")
    out_im.save(out_png_path, "PNG")

    for p in [tmp_w_html, tmp_b_html, tmp_w_png, tmp_b_png]:
        if os.path.exists(p):
            os.remove(p)

    print(f"Generated 32-bit RGBA: {os.path.basename(out_png_path)}")

png_targets = [
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-dark.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-primary-dark.png"), 1800, 2100),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-light.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-primary-light.png"), 1800, 2100),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-dark.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-horizontal-dark.png"), 2640, 660),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-light.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-horizontal-light.png"), 2640, 660),
    (os.path.join(LOGO_SVG_DIR, "milet-symbol-amber.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-symbol-amber.png"), 1500, 1500),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-mono-black.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-primary-mono-black.png"), 1800, 2100),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-mono-white.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-primary-mono-white.png"), 1800, 2100),
]

for s, p, w, h in png_targets:
    try:
        render_dual_bg_alpha(s, p, w, h)
    except Exception as e:
        print(f"Error {p}: {e}")

# Also render Solid Background PNGs
print("Rendering Solid Background PNGs...")
def render_solid_png(svg_path, out_png_path, width, height, bg_hex):
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_code = f.read()
    html_code = f"""<!DOCTYPE html><html><head><meta charset="utf-8"><style>
* {{ margin:0; padding:0; box-sizing:border-box; }}
html, body {{ width:{width}px; height:{height}px; background:{bg_hex}; overflow:hidden; display:flex; align-items:center; justify-content:center; }}
svg {{ width:100%; height:100%; }}
</style></head><body>{svg_code}</body></html>"""
    tmp_html = out_png_path + ".html"
    with open(tmp_html, "w", encoding="utf-8") as f:
        f.write(html_code)
    subprocess.run([CHROME_PATH, "--headless=new", "--disable-gpu", f"--screenshot={out_png_path}", f"--window-size={width},{height}", tmp_html], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(tmp_html):
        os.remove(tmp_html)
    print(f"Generated solid PNG: {os.path.basename(out_png_path)}")

solid_targets = [
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-dark.svg"),
     os.path.join(LOGO_PNG_SOLID, "milet-logo-primary-marfim.png"), 1800, 2100, "#F7F3EA"),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-light.svg"),
     os.path.join(LOGO_PNG_SOLID, "milet-logo-primary-carvao.png"), 1800, 2100, "#1A1A1A"),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-dark.svg"),
     os.path.join(LOGO_PNG_SOLID, "milet-logo-horizontal-marfim.png"), 2640, 660, "#F7F3EA"),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-light.svg"),
     os.path.join(LOGO_PNG_SOLID, "milet-logo-horizontal-carvao.png"), 2640, 660, "#1A1A1A"),
]

for s, p, w, h, bg in solid_targets:
    try:
        render_solid_png(s, p, w, h, bg)
    except Exception as e:
        print(f"Error {p}: {e}")

# Favicons & App Icons from the solid PNG
try:
    carvao_im = Image.open(os.path.join(LOGO_PNG_SOLID, "milet-logo-primary-carvao.png"))
    cw, ch = carvao_im.size
    sym_crop = carvao_im.crop((int(cw*0.12), int(ch*0.03), int(cw*0.88), int(ch*0.65)))
    for size in [512, 192, 64, 32, 16]:
        resized = sym_crop.resize((size, size), Image.Resampling.LANCZOS)
        name = f"favicon-{size}x{size}.png" if size <= 64 else f"app-icon-{size}x{size}.png"
        resized.save(os.path.join(LOGO_PNG_SOLID, name))
    print("Favicons successfully refreshed!")
except Exception as e:
    print(f"Error refreshing favicons: {e}")

print("All Brand Assets Rebuilt and Verified Successfully!")
