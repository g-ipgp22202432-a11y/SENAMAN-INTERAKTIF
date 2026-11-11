#!/bin/bash
for name in boboiboy gopal yaya ying tok_aba ochobot; do
  convert public/assets/boboiboy/${name}_crop.png \
    \( +clone -alpha extract -draw "fill black polygon 0,0 0,25 25,0 fill white circle 25,25 25,0" \
       \( +clone -flip \) -compose Multiply -composite \
       \( +clone -flop \) -compose Multiply -composite \) \
    -alpha off -compose CopyOpacity -composite \
    -bordercolor "#facc15" -border 6 \
    public/assets/boboiboy/${name}_stand.png
done

# Full Kokotiam stand with rounded border
convert public/assets/boboiboy/kokotiam_kiosk.png \
  \( +clone -alpha extract -draw "fill black polygon 0,0 0,35 35,0 fill white circle 35,35 35,0" \
     \( +clone -flip \) -compose Multiply -composite \
     \( +clone -flop \) -compose Multiply -composite \) \
  -alpha off -compose CopyOpacity -composite \
  -bordercolor "#facc15" -border 8 \
  public/assets/boboiboy/kokotiam_full_stand.png
