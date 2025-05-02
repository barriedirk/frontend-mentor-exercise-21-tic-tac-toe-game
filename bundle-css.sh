#!/bin/bash

# CSS bundler script
echo "Bundling CSS files..."

cat reset.css main.css custom-radio.css  > bundleRaw.css
esbuild bundleRaw.css --bundle --minify --outfile=bundle.css --loader:.svg=file --loader:.ttf=file
rm bundleRaw.css

echo "✅ CSS bundled into bundle.css"

# chmod +x bundle-css.sh
# ./bundle-css.sh