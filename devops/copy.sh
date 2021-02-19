#!/bin/sh

az storage blob upload-batch -d $CONTAINER --destination-path 'v1/hcl-sdk-web-ui' --account-name $AZURE_STORAGE_ACCOUNT --account-key $AZURE_STORAGE_ACCESS_KEY -s /dist/hcl-sdk-web-ui
az storage blob upload-batch -d $CONTAINER --destination-path 'v1/hcl-sdk-api' --account-name $AZURE_STORAGE_ACCOUNT --account-key $AZURE_STORAGE_ACCESS_KEY -s /dist/hcl-sdk-api

