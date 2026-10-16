#!/usr/bin/env bash
# Build web-sized, metadata-free photo variants into public/images/.
#
#   scripts/optimize-images.sh <dir-with-originals>
#
# Originals never go in public/ or in git: camera files carry GPS and device
# EXIF, and this repo and site are public. Every output is stripped.
# Needs ImageMagick 7 with AVIF and WebP support (brew install imagemagick), and
# for cutouts macOS 14+ with swift (Xcode command line tools).
set -euo pipefail

src=${1:?usage: scripts/optimize-images.sh <dir-with-originals>}
here="$(cd "$(dirname "$0")" && pwd)"
out="$(cd "$here/.." && pwd)/public/images"
mkdir -p "$out"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

# name | original file | mode | widths | grade
# mode "cutout" lifts the subject off its background with scripts/lift-subject.swift
# and keeps the transparency, so the page shows the cookie itself with no frame; the
# image is cropped to the cookie, so the sizes value in Photo.tsx is the cookie's
# rendered width. mode "none" keeps the original frame.
# grade is ImageMagick operators applied to the full-size master before resizing
# (empty for none). The hero grade was chosen by eye on parchment: a gentle S-curve,
# lifted mids, a warmer, richer crust and a little less blue, so the cookie reads
# bright and golden instead of dark and moody.
photos=(
  "hero|PXL_20241205_134705256.PORTRAIT.ORIGINAL.jpg|cutout|480 720 960 1440|-channel RGB +sigmoidal-contrast 3,30% -level 0%,90%,1.18 -modulate 107,115,99 -channel B -evaluate multiply 0.96 +channel"
)

for row in "${photos[@]}"; do
  IFS='|' read -r name file mode widths grade <<<"$row"
  master="$work/$name.png"
  if [ "$mode" = cutout ]; then
    swift "$here/lift-subject.swift" "$src/$file" "$work/$name-raw.png"
    # The mask's soft edge still carries the grey plate behind the cookie, which reads
    # as a grey rim on parchment. Every pixel under 99% opacity takes the colour of the
    # nearby opaque cookie instead (a normalised blur of that core); alpha is kept.
    magick "$work/$name-raw.png" -write mpr:src +delete \
      \( mpr:src -alpha extract -threshold 99% -write mpr:core +delete \) \
      \( mpr:src -alpha off mpr:core -compose Multiply -composite -blur 0x12 \) \
      \( mpr:core -blur 0x12 \) -compose Divide_Dst -composite \
      \( mpr:src -alpha off \) mpr:core -compose Over -composite \
      \( mpr:src -alpha extract \) -alpha off -compose CopyOpacity -composite \
      "$work/$name-lift.png"
  else
    magick "$src/$file" -auto-orient "$work/$name-lift.png"
  fi
  read -ra ops <<<"$grade"
  magick "$work/$name-lift.png" ${ops[@]+"${ops[@]}"} "$master"

  # AVIF (served first) and WebP, both with alpha; JPEG has none. Fully transparent
  # pixels take the parchment colour, which only makes the AVIF smaller.
  for w in $widths; do
    args=(-resize "${w}x" -strip -colorspace sRGB)
    magick "$master" "${args[@]}" -background '#FBF5EA' -alpha background -quality 45 "$out/$name-$w.avif"
    magick "$master" "${args[@]}" -quality 78 -define webp:alpha-quality=80 -define webp:method=6 "$out/$name-$w.webp"
  done
done

ls -l "$out"
