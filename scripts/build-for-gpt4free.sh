#!/bin/bash

# rename config
mv src/global/store/config.ts src/global/store/config-old.ts
mv src/global/store/config-g4f.ts src/global/store/config.ts

# run build
pnpm build

# run cp build assets
./cp-build-assets.sh

# restore config
mv src/global/store/config.ts src/global/store/config-g4f.ts
mv src/global/store/config-old.ts src/global/store/config.ts

# if dir exist $HOME/Documents/gpt4free/.deps/gpt4dev/dist remove it
if [ -d "$HOME/Documents/gpt4free/.deps/gpt4dev/dist" ]; then
    rm -rf "$HOME/Documents/gpt4free/.deps/gpt4dev/dist"
fi

# copy   dist dir to $HOME/Documents/gpt4free/.deps/gpt4dev/dist
cp -r dist "$HOME/Documents/gpt4free/.deps/gpt4dev/dist"

# if dir exist $HOME/Documents/gpt4free/.deps/gpt4dev/dist remove it
# copy   dist dir to $HOME/Documents/gpt4free/.deps/gpt4dev/dist