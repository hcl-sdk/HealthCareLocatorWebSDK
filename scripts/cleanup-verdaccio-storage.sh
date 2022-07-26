#!/bin/bash

find . -name "storage" -type d -prune -exec rm -rf '{}' +

npm set registry https://registry.npmjs.org
yarn config set registry https://registry.yarnpkg.com