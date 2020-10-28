#! /bin/bash
if [ "$TRAVIS_OS_NAME" == osx ]; then
    # deploy on mac
    yarn build
    yarn dist
else
    # deploy on windows and linux
    docker run --rm -e GH_TOKEN -v "${PWD}":/project -v ~/.cache/electron:/root/.cache/electron -v ~/.cache/electron-builder:/root/.cache/electron-builder electronuserland/builder:wine /bin/bash -c "yarn --link-duplicates --pure-lockfile && yarn build && yarn dist --linux AppImage --win"
fi
