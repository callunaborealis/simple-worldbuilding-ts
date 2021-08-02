manifest_url="https://github.com/callunaborealis/simple-worldbuilding-ts/releases/latest/download/system.json"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
gh release upload v0.1.0 $script_dir/../dist/system.json $script_dir/../dist/system.zip --clobber
echo $manifest_url
