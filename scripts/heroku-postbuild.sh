#!/bin/bash

# https://stackoverflow.com/a/26240420
pids=""
RESULT=0

( npm install --only=dev && npm install && npm run build )&
pids="$pids $!"

( cd frontend/ && npm install --only=dev && npm install && npm run build )&
pids="$pids $!"

( cd admin-frontend/ && npm install --only=dev && npm install && npm run build)&
pids="$pids $!"

for pid in $pids; do
    wait $pid || let "RESULT=1"
done

if [ "$RESULT" == "1" ];
    then
       exit 1
fi
