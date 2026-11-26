#!/bin/bash
# stage_split.sh SRC DESTDIR  -> s_0 + p_NNN parts
F=$1; D=$2; rm -rf $D; mkdir -p $D
{ printf X; head -c 12582912 "$F"; } > $D/s_0
tail -c +12582913 "$F" | split -b 25M -d -a 3 - $D/p_
md5sum "$F" | cut -d' ' -f1 > $D/md5
ls $D
