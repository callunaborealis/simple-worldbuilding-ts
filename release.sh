manifest_url="https://github.com/callunaborealis/simple-worldbuilding-ts/releases/latest/download/system.json"
gh release create v0.1.0 dist/system.json dist/system.zip \
  --notes "Link to manifest URL: $manifest_url" &&
  echo $manifest_url
