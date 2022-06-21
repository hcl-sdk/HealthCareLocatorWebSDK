#!/bin/bash

custom_registry_url=http://localhost:4873
original_npm_registry_url=`npm get registry`
original_yarn_registry_url=`yarn config get registry`
default_verdaccio_package=verdaccio@5.6.0

set -e

function buildPkg {
  cd $1
  yarn build
}

function updateWebDependency {
  cd "$root_path"/packages/hcl-sdk-web-ui
  PKG_VERSION=$(grep '"version"' package.json | cut -d '"' -f 4 | head -n 1)
  sed -i.bak -E 's@\"version\" *\: *\"[0-9]+\.[0-9]+\.[0-9]+\" *, *@\"version\": \"'"$PKG_VERSION"-next'\",@' package.json && rm -rf package.json.bak


  local  __pkg_version=$1
  eval $__pkg_version="'$PKG_VERSION'-next"
}

function updateAngularDependency {
  cd "$root_path"/packages/hcl-sdk-web-ui-angular/projects/hcl-sdk
  PKG_VERSION=$(grep '"version"' package.json | cut -d '"' -f 4 | head -n 1)
  sed -i.bak -E 's@\"version\" *\: *\"[0-9]+\.[0-9]+\.[0-9]+\" *, *@\"version\": \"'"$PKG_VERSION"-next'\",@' package.json && rm -rf package.json.bak
  sed -i.bak -E 's@\"\@healthcarelocator\/sdk-web\" *\: *\"(\^|\~)?[0-9]+\.[0-9]+\.[0-9]+\" *, *@\"\@healthcarelocator\/sdk-web\": \"'"$1"'\",@' package.json && rm -rf package.json.bak
}

function startLocalRegistry {
  # Start local registry
  tmp_registry_log=`mktemp`
  echo "Registry output file: $tmp_registry_log"
  (nohup npx ${VERDACCIO_PACKAGE:-$default_verdaccio_package} --config $1 &>$tmp_registry_log &)

  # Wait for Verdaccio to boot
  echo "Wait for Verdaccio to boot"
  grep -q 'http address' <(tail -f $tmp_registry_log)

  # Set registry to local registry
  echo "Set npm registry to local"
  npm set --no-workspaces registry "$custom_registry_url"
  echo "Set yarn registry to local"
  yarn config set registry "$custom_registry_url"
}

function stopLocalRegistry {    
  # Restore the original NPM and Yarn registry URLs and stop Verdaccio
  echo "Restore registry: $original_npm_registry_url"
  npm set registry "$original_npm_registry_url"
  yarn config set registry "$original_yarn_registry_url"
}

function publishToLocalRegistry {
  # git clean -df
  cd $1
  echo "Publish to local registry"
  npm --registry $custom_registry_url publish --tag next
}

root_path=$PWD

echo `npm get registry`
echo `yarn config get registry`

yarn install

updateWebDependency WEB_UI_VERSION

buildPkg "$root_path"/packages/hcl-sdk-web-ui 

startLocalRegistry "$root_path"/scripts/verdaccio.yml

publishToLocalRegistry "$root_path"/packages/hcl-sdk-web-ui

echo "Updating dependency @healthcarelocator/web $WEB_UI_VERSION"

updateAngularDependency $WEB_UI_VERSION

buildPkg "$root_path"/packages/hcl-sdk-web-ui-angular

publishToLocalRegistry "$root_path"/packages/hcl-sdk-web-ui-angular/dist/hcl-sdk

cd "$root_path"/examples/web/angular 

yarn --registry $custom_registry_url

yarn --registry $custom_registry_url add @healthcarelocator/sdk-web@next

yarn --registry $custom_registry_url add @healthcarelocator/sdk-angular@next

stopLocalRegistry

yarn build
