#!/bin/bash

# pass the image path, image name and threshold(used as a fuzz factor) to the bash script
IMGPATH=$1
IMGNAME=$2
THRESHOLD=$3

# start real
convert ${IMGPATH}${IMGNAME} \( +clone -fx 'p{0,0}' \)  -compose Difference  -composite   -modulate 100,0  +matte  ${IMGPATH}${IMGNAME}_difference.png

# remove the black, replace with transparency
convert ${IMGPATH}${IMGNAME}_difference.png -bordercolor white -border 1x1 -matte -fill none -fuzz 7% -draw 'matte 1,1 floodfill' -shave 1x1 ${IMGPATH}${IMGNAME}_removed_black.png
composite  -compose Dst_Over -tile pattern:checkerboard ${IMGPATH}${IMGNAME}_removed_black.png ${IMGPATH}${IMGNAME}_removed_black_check.png

# create the matte 
convert ${IMGPATH}${IMGNAME}_removed_black.png -channel matte -separate  +matte ${IMGPATH}${IMGNAME}_matte.png

# negate the colors
convert ${IMGPATH}${IMGNAME}_matte.png -negate -blur 0x1 ${IMGPATH}${IMGNAME}_matte-negated.png

# eroding matte(to remove remaining white border pixels from clipped foreground)
convert ${IMGPATH}${IMGNAME}_matte.png -morphology Erode Diamond ${IMGPATH}${IMGNAME}_erode_matte.png

# you are going for: white interior, black exterior
composite -compose CopyOpacity ${IMGPATH}${IMGNAME}_erode_matte.png ${IMGPATH}${IMGNAME} ${IMGPATH}${IMGNAME}_finished.png

#remove white border pixels
convert ${IMGPATH}${IMGNAME}_finished.png -bordercolor white -border 1x1 -matte -fill none -fuzz  ${THRESHOLD}% -draw 'matte 1,1 floodfill' -shave 1x1 ${IMGPATH}${IMGNAME}_final.png

#deleting extra files
rm ${IMGPATH}${IMGNAME}_difference.png
rm ${IMGPATH}${IMGNAME}_removed_black.png
rm ${IMGPATH}${IMGNAME}_removed_black_check.png
rm ${IMGPATH}${IMGNAME}_matte.png
rm ${IMGPATH}${IMGNAME}_matte-negated.png
rm ${IMGPATH}${IMGNAME}_finished.png
