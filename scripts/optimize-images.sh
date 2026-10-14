#!/usr/bin/env bash
# Build web-sized, metadata-free photo variants into public/images/.
#
#   scripts/optimize-images.sh <dir-with-originals>
#
# Originals never go in public/ or in git: camera files carry GPS and device
# EXIF, and this repo and site are public. Every output is stripped.
# Needs ImageMagick 7 with AVIF support (brew install imagemagick).
set -euo pipefail

src=${1:?usage: scripts/optimize-images.sh <dir-with-originals>}
out="$(cd "$(dirname "$0")/.." && pwd)/public/images"
mkdir -p "$out"

# name | original file | crop | widths
# crop "square" center-crops to 1:1 (the hero frame is aspect-square with
# object-cover, so the crop matches what renders); "none" keeps the 3:4 frame.
photos=(
  "hero|PXL_20241205_134705256.PORTRAIT.ORIGINAL.jpg|square|480 960 1440"
  "chocolate-chip|20241205_084636_0.jpg|none|400 800 1200"
  "snickerdoodle|20241205_084639_0.jpg|none|400 800 1200"
  "artisan|PXL_20241128_140429762.PORTRAIT.ORIGINAL.jpg|none|400 800 1200"
  "oven|PXL_20241119_023700041.MP.jpg|none|400 800 1200"
)

for row in "${photos[@]}"; do
  IFS='|' read -r name file crop widths <<<"$row"
  for w in $widths; do
    args=(-auto-orient)
    if [ "$crop" = square ]; then
      args+=(-gravity center -crop "%[fx:min(w,h)]x%[fx:min(w,h)]+0+0" +repage)
    fi
    args+=(-resize "${w}x" -strip -colorspace sRGB)
    magick "$src/$file" "${args[@]}" -quality 50 "$out/$name-$w.avif"
    magick "$src/$file" "${args[@]}" -quality 78 -sampling-factor 4:2:0 -interlace JPEG "$out/$name-$w.jpg"
  done
done

ls -l "$out"
