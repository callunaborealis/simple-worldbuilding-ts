rm -rf dist &&
  mkdir dist &&
  cp system.json ./dist/system.json && zip -vr dist/system.zip build -x '*.git*' -x ".DS_Store"
