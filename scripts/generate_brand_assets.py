"""
Milet Brand Asset Generator
Generates high-resolution SVGs, transparent PNGs, solid PNGs, JPEGs, and Favicons
for the Milet brand identity system.
"""

import os
import subprocess
from PIL import Image

BASE_DIR = r"c:\Users\Lenovo\Desktop\milet"
LOGO_SVG_DIR = os.path.join(BASE_DIR, "assets", "logo", "svg")
LOGO_PNG_TRANSPARENT = os.path.join(BASE_DIR, "assets", "logo", "png", "transparent")
LOGO_PNG_SOLID = os.path.join(BASE_DIR, "assets", "logo", "png", "solid")
ICONS_DIR = os.path.join(BASE_DIR, "assets", "icons")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

os.makedirs(LOGO_SVG_DIR, exist_ok=True)
os.makedirs(LOGO_PNG_TRANSPARENT, exist_ok=True)
os.makedirs(LOGO_PNG_SOLID, exist_ok=True)
os.makedirs(ICONS_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. SVGs: Symbol & Logos
# -------------------------------------------------------------

# Refined amber Möbius loop SVG markup (with realistic gradients, depth, and volume)
SYMBOL_AMBER_DEFS = """
  <defs>
    <linearGradient id="amberGrad1" x1="15%" y1="10%" x2="85%" y2="90%">
      <stop offset="0%" stop-color="#FCE6B3"/>
      <stop offset="25%" stop-color="#E5A842"/>
      <stop offset="60%" stop-color="#D39B3D"/>
      <stop offset="85%" stop-color="#B87333"/>
      <stop offset="100%" stop-color="#7A3D0B"/>
    </linearGradient>
    <linearGradient id="amberGrad2" x1="80%" y1="20%" x2="20%" y2="95%">
      <stop offset="0%" stop-color="#FFF1D0"/>
      <stop offset="35%" stop-color="#EDB34C"/>
      <stop offset="70%" stop-color="#C5852C"/>
      <stop offset="100%" stop-color="#8F4B12"/>
    </linearGradient>
    <linearGradient id="amberHighlight" x1="30%" y1="0%" x2="50%" y2="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="40%" stop-color="#FCE4B0" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#D39B3D" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="amberGlow" cx="45%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FFE8B5" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#D39B3D" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#995213" stop-opacity="0"/>
    </radialGradient>
    <filter id="softDepth" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#8C4A11" flood-opacity="0.25"/>
    </filter>
  </defs>
"""

# The organic Möbius loop path coordinates in a 500x500 box
# Continuous, perfectly balanced organic rounded triangular loop with inner volume
SYMBOL_PATHS_COLOR = """
  <g filter="url(#softDepth)">
    <!-- Base Body of Loop -->
    <path d="M 250 65 
             C 320 65, 410 135, 425 220 
             C 438 295, 385 400, 310 425 
             C 245 445, 155 425, 105 375 
             C 60 330, 65 240, 115 160 
             C 155 95, 205 65, 250 65 Z" 
          fill="url(#amberGrad1)"/>

    <!-- Inner Torus Twist Layer -->
    <path d="M 250 65 
             C 200 65, 150 100, 115 160 
             C 65 240, 60 330, 105 375 
             C 145 415, 220 435, 285 415 
             C 225 390, 175 330, 165 260 
             C 155 190, 200 120, 250 65 Z" 
          fill="url(#amberGrad2)" opacity="0.95"/>

    <!-- Inner Aperture Cutout with Refraction Twist -->
    <path d="M 250 155 
             C 285 155, 325 195, 335 245 
             C 345 295, 315 345, 275 355 
             C 230 365, 185 335, 175 285 
             C 165 235, 210 155, 250 155 Z" 
          fill="#1A1A1A" class="milet-cutout"/>

    <!-- Luminous Edge Highlights -->
    <path d="M 245 70 
             C 310 70, 395 135, 415 215 
             C 425 255, 415 310, 385 350" 
          stroke="url(#amberHighlight)" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.8"/>

    <!-- Subtle Amber Glow Core -->
    <ellipse cx="230" cy="180" rx="90" ry="70" fill="url(#amberGlow)" opacity="0.6"/>
  </g>
"""

def generate_svg_symbol(is_dark_bg=False, is_mono_black=False, is_mono_white=False):
    if is_mono_black or is_mono_white:
        color = "#1A1A1A" if is_mono_black else "#F7F3EA"
        cutout = "#FFFFFF" if is_mono_black else "#1A1A1A"
        return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <path fill-rule="evenodd" fill="{color}" d="
    M 250 65 
    C 320 65, 410 135, 425 220 
    C 438 295, 385 400, 310 425 
    C 245 445, 155 425, 105 375 
    C 60 330, 65 240, 115 160 
    C 155 95, 205 65, 250 65 Z
    M 250 160 
    C 210 160, 170 235, 178 285 
    C 186 335, 230 360, 275 350 
    C 315 340, 340 295, 332 245 
    C 324 195, 285 160, 250 160 Z
  "/>
</svg>"""
    else:
        bg_cutout = "#1A1A1A" if is_dark_bg else "#F7F3EA"
        paths = SYMBOL_PATHS_COLOR.replace('class="milet-cutout"', f'fill="{bg_cutout}"')
        return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
{SYMBOL_AMBER_DEFS}
{paths}
</svg>"""

# High-contrast custom editorial serif font styling for Milet wordmark
WORDMARK_FONT_STYLE = """
<defs>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&amp;family=Plus+Jakarta+Sans:wght@400;500;600&amp;display=swap');
    .wordmark {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .tagline {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.32em;
    }
  </style>
</defs>
"""

def generate_primary_logo(mode="dark_text_on_light"):
    # Primary is Vertical (Symbol centered above Milet wordmark and tagline)
    if mode == "dark_text_on_light":
        text_color = "#1A1A1A"
        tag_color = "#6E6961"
        cutout_color = "#F7F3EA"
        symbol_block = SYMBOL_PATHS_COLOR.replace('class="milet-cutout"', f'fill="{cutout_color}"')
        defs = SYMBOL_AMBER_DEFS + WORDMARK_FONT_STYLE
    elif mode == "light_text_on_dark":
        text_color = "#F7F3EA"
        tag_color = "#C9B89F"
        cutout_color = "#1A1A1A"
        symbol_block = SYMBOL_PATHS_COLOR.replace('class="milet-cutout"', f'fill="{cutout_color}"')
        defs = SYMBOL_AMBER_DEFS + WORDMARK_FONT_STYLE
    elif mode == "mono_black":
        defs = WORDMARK_FONT_STYLE
        text_color = "#1A1A1A"
        tag_color = "#1A1A1A"
        symbol_block = """
        <path fill-rule="evenodd" fill="#1A1A1A" d="
          M 250 65 C 320 65, 410 135, 425 220 C 438 295, 385 400, 310 425 C 245 445, 155 425, 105 375 C 60 330, 65 240, 115 160 C 155 95, 205 65, 250 65 Z
          M 250 160 C 210 160, 170 235, 178 285 C 186 335, 230 360, 275 350 C 315 340, 340 295, 332 245 C 324 195, 285 160, 250 160 Z
        "/>"""
    elif mode == "mono_white":
        defs = WORDMARK_FONT_STYLE
        text_color = "#F7F3EA"
        tag_color = "#F7F3EA"
        symbol_block = """
        <path fill-rule="evenodd" fill="#F7F3EA" d="
          M 250 65 C 320 65, 410 135, 425 220 C 438 295, 385 400, 310 425 C 245 445, 155 425, 105 375 C 60 330, 65 240, 115 160 C 155 95, 205 65, 250 65 Z
          M 250 160 C 210 160, 170 235, 178 285 C 186 335, 230 360, 275 350 C 315 340, 340 295, 332 245 C 324 195, 285 160, 250 160 Z
        "/>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 720" width="100%" height="100%">
{defs}
  <!-- Símbolo no topo -->
  <g transform="translate(100, 30) scale(0.8)">
    {symbol_block}
  </g>

  <!-- Wordmark 'Milet' -->
  <text x="300" y="525" text-anchor="middle" class="wordmark" font-size="110" fill="{text_color}">Milet</text>

  <!-- Tagline 'ENERGIA EM MAIS LIBERDADE' -->
  <text x="300" y="585" text-anchor="middle" class="tagline" font-size="15" fill="{tag_color}">ENERGIA EM MAIS LIBERDADE</text>
</svg>"""

def generate_horizontal_logo(mode="dark_text_on_light"):
    # Horizontal: Symbol on left (160x160), Milet in middle, Tagline on right or below
    if mode == "dark_text_on_light":
        text_color = "#1A1A1A"
        tag_color = "#736E66"
        line_color = "#D8CEBE"
        cutout_color = "#F7F3EA"
        symbol_block = SYMBOL_PATHS_COLOR.replace('class="milet-cutout"', f'fill="{cutout_color}"')
        defs = SYMBOL_AMBER_DEFS + WORDMARK_FONT_STYLE
    elif mode == "light_text_on_dark":
        text_color = "#F7F3EA"
        tag_color = "#C9B89F"
        line_color = "#403D38"
        cutout_color = "#1A1A1A"
        symbol_block = SYMBOL_PATHS_COLOR.replace('class="milet-cutout"', f'fill="{cutout_color}"')
        defs = SYMBOL_AMBER_DEFS + WORDMARK_FONT_STYLE
    elif mode == "mono_black":
        defs = WORDMARK_FONT_STYLE
        text_color = "#1A1A1A"
        tag_color = "#1A1A1A"
        line_color = "#1A1A1A"
        symbol_block = """
        <path fill-rule="evenodd" fill="#1A1A1A" d="
          M 250 65 C 320 65, 410 135, 425 220 C 438 295, 385 400, 310 425 C 245 445, 155 425, 105 375 C 60 330, 65 240, 115 160 C 155 95, 205 65, 250 65 Z
          M 250 160 C 210 160, 170 235, 178 285 C 186 335, 230 360, 275 350 C 315 340, 340 295, 332 245 C 324 195, 285 160, 250 160 Z
        "/>"""
    elif mode == "mono_white":
        defs = WORDMARK_FONT_STYLE
        text_color = "#F7F3EA"
        tag_color = "#F7F3EA"
        line_color = "#F7F3EA"
        symbol_block = """
        <path fill-rule="evenodd" fill="#F7F3EA" d="
          M 250 65 C 320 65, 410 135, 425 220 C 438 295, 385 400, 310 425 C 245 445, 155 425, 105 375 C 60 330, 65 240, 115 160 C 155 95, 205 65, 250 65 Z
          M 250 160 C 210 160, 170 235, 178 285 C 186 335, 230 360, 275 350 C 315 340, 340 295, 332 245 C 324 195, 285 160, 250 160 Z
        "/>"""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 220" width="100%" height="100%">
{defs}
  <!-- Símbolo à esquerda -->
  <g transform="translate(10, 10) scale(0.4)">
    {symbol_block}
  </g>

  <!-- Wordmark 'Milet' -->
  <text x="240" y="132" class="wordmark" font-size="94" fill="{text_color}">Milet</text>

  <!-- Divisor Vertical Elegante -->
  <line x1="530" y1="58" x2="530" y2="150" stroke="{line_color}" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>

  <!-- Tagline Multi-linha à direita como no Brandboard -->
  <text x="560" y="92" class="tagline" font-size="13" fill="{tag_color}">ENERGIA</text>
  <text x="560" y="114" class="tagline" font-size="13" fill="{tag_color}">EM MAIS</text>
  <text x="560" y="136" class="tagline" font-size="13" fill="{tag_color}">LIBERDADE</text>
</svg>"""

# -------------------------------------------------------------
# 2. SVGs: Iconografia Oficial (8 Ícones)
# -------------------------------------------------------------
ICONS = {
    "energia": """<path d="M 54 14 L 30 52 L 48 52 L 42 86 L 68 46 L 50 46 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>""",
    "dados": """
      <line x1="24" y1="78" x2="24" y2="58" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="42" y1="78" x2="42" y2="40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="60" y1="78" x2="60" y2="24" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="76" y1="78" x2="76" y2="48" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    """,
    "consumidor": """
      <circle cx="50" cy="36" r="16" fill="none" stroke="currentColor" stroke-width="3"/>
      <path d="M 22 78 C 22 62, 35 56, 50 56 C 65 56, 78 62, 78 78" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    """,
    "escolhas": """
      <path d="M 50 20 C 68 20, 80 40, 80 62 C 80 74, 66 82, 50 82 C 34 82, 20 74, 20 62 C 20 40, 32 20, 50 20 Z" fill="none" stroke="currentColor" stroke-width="3"/>
      <line x1="50" y1="20" x2="50" y2="82" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    """,
    "integracao": """
      <circle cx="40" cy="50" r="22" fill="none" stroke="currentColor" stroke-width="3"/>
      <circle cx="60" cy="50" r="22" fill="none" stroke="currentColor" stroke-width="3"/>
    """,
    "tecnologia": """
      <polygon points="50,18 78,34 78,66 50,82 22,66 22,34" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    """,
    "independencia": """
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="3"/>
      <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="50" cy="50" r="6" fill="currentColor"/>
    """,
    "possibilidades": """
      <line x1="50" y1="22" x2="50" y2="78" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
      <line x1="22" y1="50" x2="78" y2="50" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    """
}

def generate_icon_svg(name, inner_svg):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" color="#D39B3D">
  {inner_svg}
</svg>"""

# -------------------------------------------------------------
# 3. Write All SVGs
# -------------------------------------------------------------
print("Writing Logo SVGs...")

# Symbols
with open(os.path.join(LOGO_SVG_DIR, "milet-symbol-amber-darkbg.svg"), "w", encoding="utf-8") as f:
    f.write(generate_svg_symbol(is_dark_bg=True))

with open(os.path.join(LOGO_SVG_DIR, "milet-symbol-amber-lightbg.svg"), "w", encoding="utf-8") as f:
    f.write(generate_svg_symbol(is_dark_bg=False))

with open(os.path.join(LOGO_SVG_DIR, "milet-symbol-mono-black.svg"), "w", encoding="utf-8") as f:
    f.write(generate_svg_symbol(is_mono_black=True))

with open(os.path.join(LOGO_SVG_DIR, "milet-symbol-mono-white.svg"), "w", encoding="utf-8") as f:
    f.write(generate_svg_symbol(is_mono_white=True))

# Primary Logos (Vertical)
with open(os.path.join(LOGO_SVG_DIR, "milet-logo-primary-dark.svg"), "w", encoding="utf-8") as f:
    f.write(generate_primary_logo(mode="dark_text_on_light"))

with open(os.path.join(LOGO_SVG_DIR, "milet-logo-primary-light.svg"), "w", encoding="utf-8") as f:
    f.write(generate_primary_logo(mode="light_text_on_dark"))

with open(os.path.join(LOGO_SVG_DIR, "milet-logo-primary-mono-black.svg"), "w", encoding="utf-8") as f:
    f.write(generate_primary_logo(mode="mono_black"))

with open(os.path.join(LOGO_SVG_DIR, "milet-logo-primary-mono-white.svg"), "w", encoding="utf-8") as f:
    f.write(generate_primary_logo(mode="mono_white"))

# Horizontal Logos
with open(os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-dark.svg"), "w", encoding="utf-8") as f:
    f.write(generate_horizontal_logo(mode="dark_text_on_light"))

with open(os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-light.svg"), "w", encoding="utf-8") as f:
    f.write(generate_horizontal_logo(mode="light_text_on_dark"))

with open(os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-mono-black.svg"), "w", encoding="utf-8") as f:
    f.write(generate_horizontal_logo(mode="mono_black"))

with open(os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-mono-white.svg"), "w", encoding="utf-8") as f:
    f.write(generate_horizontal_logo(mode="mono_white"))

# Write Icon SVGs
print("Writing Icon SVGs...")
for icon_name, icon_content in ICONS.items():
    path = os.path.join(ICONS_DIR, f"{icon_name}.svg")
    with open(path, "w", encoding="utf-8") as f:
        f.write(generate_icon_svg(icon_name, icon_content))

print("All SVGs successfully written.")

# -------------------------------------------------------------
# 4. Render High-Resolution PNGs using Chrome Headless & Pillow
# -------------------------------------------------------------
print("Rendering High-Resolution PNGs and JPEGs...")

def render_svg_to_png(svg_path, output_png_path, width, height, bg_color=None):
    """
    Renders an SVG file to a PNG via Chrome headless with optional background
    """
    bg_style = f"background-color: {bg_color};" if bg_color else "background-color: transparent;"
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()

    # Wrap in HTML template
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{
    width: {width}px;
    height: {height}px;
    {bg_style}
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  svg {{
    width: 100%;
    height: 100%;
  }}
</style>
</head>
<body>
{svg_content}
</body>
</html>"""

    temp_html = output_png_path + ".temp.html"
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        f"--screenshot={output_png_path}",
        f"--window-size={width},{height}",
        temp_html
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(temp_html):
        os.remove(temp_html)

# List of render targets
renders = [
    # Transparent PNGs
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-dark.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-primary-dark.png"), 1800, 2160, None),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-light.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-primary-light.png"), 1800, 2160, None),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-dark.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-horizontal-dark.png"), 2640, 660, None),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-light.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-horizontal-light.png"), 2640, 660, None),
    (os.path.join(LOGO_SVG_DIR, "milet-symbol-amber-darkbg.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-symbol-amber.png"), 1500, 1500, None),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-mono-black.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-primary-mono-black.png"), 1800, 2160, None),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-mono-white.svg"),
     os.path.join(LOGO_PNG_TRANSPARENT, "milet-logo-primary-mono-white.png"), 1800, 2160, None),

    # Solid PNGs with brand colors (#F7F3EA Marfim & #1A1A1A Carvão)
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-dark.svg"),
     os.path.join(LOGO_PNG_SOLID, "milet-logo-primary-marfim.png"), 1800, 2160, "#F7F3EA"),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-primary-light.svg"),
     os.path.join(LOGO_PNG_SOLID, "milet-logo-primary-carvao.png"), 1800, 2160, "#1A1A1A"),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-dark.svg"),
     os.path.join(LOGO_PNG_SOLID, "milet-logo-horizontal-marfim.png"), 2640, 660, "#F7F3EA"),
    (os.path.join(LOGO_SVG_DIR, "milet-logo-horizontal-light.svg"),
     os.path.join(LOGO_PNG_SOLID, "milet-logo-horizontal-carvao.png"), 2640, 660, "#1A1A1A"),
]

for svg_p, png_p, w, h, bg in renders:
    try:
        render_svg_to_png(svg_p, png_p, w, h, bg)
        print(f"Rendered: {os.path.basename(png_p)}")
    except Exception as e:
        print(f"Error rendering {png_p}: {e}")

# -------------------------------------------------------------
# 5. Extract 3D Realistic Amber Symbol from Hero image
# -------------------------------------------------------------
try:
    hero_path = os.path.join(BASE_DIR, "assets", "imagery", "milet-hero-amber-loop.jpg")
    if os.path.exists(hero_path):
        hero = Image.open(hero_path)
        hw, hh = hero.size
        # The loop is centrally placed: approx 400..980 in x, 100..680 in y
        crop_box = (int(hw * 0.28), int(hh * 0.12), int(hw * 0.72), int(hh * 0.88))
        loop_crop = hero.crop(crop_box)
        loop_crop.save(os.path.join(LOGO_PNG_SOLID, "milet-symbol-3d-photorealistic.jpg"), quality=95)
        print("Generated photorealistic 3D symbol crop.")
except Exception as e:
    print(f"Error extracting 3D symbol: {e}")

# -------------------------------------------------------------
# 6. Generate Favicon & App Icons
# -------------------------------------------------------------
try:
    sym_png = os.path.join(LOGO_PNG_SOLID, "milet-logo-primary-carvao.png")
    if os.path.exists(sym_png):
        base_icon = Image.open(sym_png)
        # Create square icon from top part of primary logo
        iw, ih = base_icon.size
        square_crop = base_icon.crop((int(iw*0.1), int(ih*0.05), int(iw*0.9), int(ih*0.65)))
        for size in [512, 192, 64, 32, 16]:
            resized = square_crop.resize((size, size), Image.Resampling.LANCZOS)
            icon_name = f"favicon-{size}x{size}.png" if size <= 64 else f"app-icon-{size}x{size}.png"
            resized.save(os.path.join(LOGO_PNG_SOLID, icon_name))
        print("Favicons and app icons generated.")
except Exception as e:
    print(f"Error creating favicons: {e}")

print("Brand Asset Generation Completed Successfully!")
