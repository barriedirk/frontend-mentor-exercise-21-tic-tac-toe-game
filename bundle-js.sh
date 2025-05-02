#!/bin/bash

# v
# JS bundler script
echo "Bundling JS files..."
esbuild main.js --bundle --minify --outfile=bundle.js
echo "✅ JS bundled into bundle.js"

# chmod +x bundle-js.sh
# ./bundle-js.sh