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

# name | original file | crop | widths | focus
# crop "6:7" cuts the largest 6:7 frame from the original: the hero arch is
# aspect 6/7, so the frame and the image share an aspect and nothing is
# cover-cropped (the sizes value in Photo.tsx is the rendered width). focus is
# the vertical centre of that frame as a fraction of the original height; 0.55
# keeps the cookie and its salt flakes in the middle of the arch.
# crop "none" keeps the original frame.
photos=(
  "hero|PXL_20241205_134705256.PORTRAIT.ORIGINAL.jpg|6:7|480 720 960 1440|0.55"
)

for row in "${photos[@]}"; do
  IFS='|' read -r name file crop widths focus <<<"$row"
  for w in $widths; do
    args=(-auto-orient)
    if [ "$crop" = 6:7 ]; then
      cw="floor(min(w,h*6/7))"
      ch="floor(min(h,w*7/6))"
      args+=(-crop "%[fx:$cw]x%[fx:$ch]+%[fx:floor((w-$cw)/2)]+%[fx:floor(max(0,min(h-$ch,${focus:-0.5}*h-$ch/2)))]" +repage)
    fi
    args+=(-resize "${w}x" -strip -colorspace sRGB)
    magick "$src/$file" "${args[@]}" -quality 50 "$out/$name-$w.avif"
    magick "$src/$file" "${args[@]}" -quality 78 -sampling-factor 4:2:0 -interlace JPEG "$out/$name-$w.jpg"
  done
done

ls -l "$out"
