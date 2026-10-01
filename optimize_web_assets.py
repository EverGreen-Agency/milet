"""Build lightweight WebP presentation assets without touching master files."""

from pathlib import Path

from PIL import Image, ImageEnhance


SOURCE_DIR = Path("assets/imagery")
OUTPUT_DIR = Path("assets/web")

ASSETS = [
    "milet-hero-rocha-ambar-polida.png",
    "milet-hero-rocha-ambar-mineral-sol.png",
    "milet-master-brand-board.jpg",
    "milet-norma-01-area-de-protecao.png",
    "milet-norma-02-reducao-minima.png",
    "milet-norma-03-fundos-permitidos.png",
    "milet-norma-04-usos-incorretos.png",
    "milet-motion-sequencia-completa-6-etapas.png",
    "milet-motion-stage-01-arco-eletrico.png",
    "milet-motion-stage-02-senoide-ac.png",
    "milet-motion-stage-03-wireframe-triangular.png",
    "milet-motion-stage-04-circuito-fechado.png",
    "milet-motion-stage-05-volume-torsao-mobius.png",
    "milet-motion-stage-06-simbolo-vivo-ambar.png",
    "milet-mockup-livro-marca-hardcover.png",
    "milet-mockup-cartoes-visita-duo.png",
    "milet-mockup-papel-timbrado.png",
    "milet-mockup-crachas-lanyard.png",
    "milet-universo-loop-montanha-sol.png",
]


def build() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for name in ASSETS:
        source = SOURCE_DIR / name
        target = OUTPUT_DIR / f"{source.stem}.webp"

        with Image.open(source) as image:
            frame = image.convert("RGB")
            frame.save(target, "WEBP", quality=84, method=6)

        before_kb = source.stat().st_size / 1024
        after_kb = target.stat().st_size / 1024
        reduction = 100 * (1 - after_kb / before_kb)
        print(f"{name}: {before_kb:.0f} KB -> {after_kb:.0f} KB ({reduction:.0f}% menor)")

    build_motion_lab_frames()


def build_motion_lab_frames() -> None:
    """Reframe the vertical storyboard slices for the standalone widescreen player."""

    for index in range(1, 7):
        pattern = f"milet-motion-stage-{index:02d}-*.png"
        source = next(SOURCE_DIR.glob(pattern))

        with Image.open(source) as image:
            frame = image.convert("RGB")
            frame = frame.crop((0, 0, min(310, frame.width), frame.height))
            grayscale = frame.convert("L")
            mask = grayscale.point(lambda value: 255 if value > 18 else 0)
            bounds = mask.getbbox() or (0, 0, frame.width, frame.height)
            content = frame.crop(bounds)
            content = ImageEnhance.Contrast(content).enhance(1.04)

            canvas = Image.new("RGB", (1200, 720), "#030302")
            scale = min(900 / content.width, 560 / content.height)
            resized = content.resize(
                (max(1, round(content.width * scale)), max(1, round(content.height * scale))),
                Image.Resampling.LANCZOS,
            )
            position = ((canvas.width - resized.width) // 2, (canvas.height - resized.height) // 2)
            canvas.paste(resized, position)

        target = OUTPUT_DIR / f"motion-lab-stage-{index:02d}.webp"
        canvas.save(target, "WEBP", quality=88, method=6)
        print(f"{target.name}: {target.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    build()
