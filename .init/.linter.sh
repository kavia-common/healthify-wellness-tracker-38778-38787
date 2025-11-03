#!/bin/bash
cd /home/kavia/workspace/code-generation/healthify-wellness-tracker-38778-38787/healthify_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

