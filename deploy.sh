#!/bin/bash

set -euo pipefail

if [ "$NODE_ENV" = "development" ]
then
    npm start
fi
