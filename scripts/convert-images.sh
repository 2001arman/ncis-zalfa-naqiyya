#!/usr/bin/env bash
# Convert + compress Zalfa Naqiyya source images (HEIC/JPG/PNG) → web WebP.
# Requires: sips (macOS built-in), cwebp.
set -euo pipefail

SRC="$HOME/Downloads/WEBSITE"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/images"
CWEBP="${CWEBP:-/Applications/XAMPP/bin/cwebp}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

MAXDIM=1280
Q=80

mkdir -p "$OUT/logo" "$OUT/kids-growth" "$OUT/paud" "$TMP/q"

# photo: <input> <output.webp>
# HEIC: decode via qlmanage (bakes EXIF orientation correctly; sips drops it).
# JPG/PNG: sips resize→jpeg (orientation already upright), then cwebp.
photo() {
  local in="$1" out="$2" ext="${1##*.}"
  rm -f "$TMP/q/"*.png 2>/dev/null || true
  case "$ext" in
    heic|HEIC|heif|HEIF)
      qlmanage -t -s "$MAXDIM" -o "$TMP/q" "$in" >/dev/null 2>&1
      local thumb; thumb="$(ls "$TMP/q/"*.png 2>/dev/null | head -1)"
      "$CWEBP" -quiet -q "$Q" "$thumb" -o "$out"
      ;;
    *)
      sips -s format jpeg -Z "$MAXDIM" "$in" --out "$TMP/t.jpg" >/dev/null 2>&1
      "$CWEBP" -quiet -q "$Q" "$TMP/t.jpg" -o "$out"
      ;;
  esac
}

# convert a whole directory of mixed-extension photos → prefix-NN.webp (sorted)
convert_dir() {
  local dir="$1" outdir="$2" prefix="$3" n=0
  while IFS= read -r f; do
    n=$((n+1))
    printf -v idx '%02d' "$n"
    photo "$f" "$outdir/$prefix-$idx.webp"
    echo "  $prefix-$idx.webp  <-  $(basename "$f")"
  done < <(find "$dir" -maxdepth 1 -type f \
            \( -iname '*.heic' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) \
            ! -name '.*' | sort)
  echo "  -> $n files"
}

echo "Logo (transparent PNG → WebP):"
"$CWEBP" -quiet -q 90 -resize 400 0 \
  "$SRC/LOGO & BROSUR/LOGO Zalfa Naqiyya Psychology Center.png" \
  -o "$OUT/logo/logo.webp"
echo "  logo/logo.webp"

echo "Kids Growth:"
convert_dir "$SRC/Dokumentasi Kids Growth Program" "$OUT/kids-growth" "kg"

echo "Paud KB-TK:"
convert_dir "$SRC/Dokumentasi Paud - KB - TK" "$OUT/paud" "paud"

echo "Done. Output: $OUT"
du -sh "$OUT"
