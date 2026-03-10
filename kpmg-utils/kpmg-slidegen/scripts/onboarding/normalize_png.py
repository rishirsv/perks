import argparse
from pathlib import Path

from PIL import Image


def main():
    parser = argparse.ArgumentParser(
        description="Normalize a PNG for onboarding compare while preserving native dimensions by default"
    )
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--resize", action="store_true")
    parser.add_argument("--width", type=int)
    parser.add_argument("--height", type=int)
    args = parser.parse_args()

    image = Image.open(args.input).convert("RGBA")
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    if args.resize:
        if args.width is None or args.height is None:
            raise SystemExit("--resize requires both --width and --height")
        image = image.resize((args.width, args.height), Image.Resampling.LANCZOS)
    elif args.width is not None or args.height is not None:
        raise SystemExit("--width/--height require --resize")
    image.save(output)


if __name__ == "__main__":
    main()
