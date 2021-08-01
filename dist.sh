rm -rf dist &&
  mkdir dist &&
  # Ensure system.json is inside dist for release
  cp src/system.json dist/system.json &&
  # Ensure template.json is inside the system.zip source
  cp src/template.json build/template.json &&
  cd build &&
  zip -vr ../dist/system.zip . -x ".DS_Store"
