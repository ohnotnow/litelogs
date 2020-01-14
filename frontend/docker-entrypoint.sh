#!/bin/sh

exit_nginx () {
    echo 'Exiting...'
    nginx -s quit
}
trap exit_nginx SIGINT SIGTERM

if [ -z "$LITELOG_API_KEY" ];
then
    echo "Warning - no LITELOG_API_KEY set..."
fi
if [ -z "$LITELOG_API_SERVER" ];
then
    echo "Warning - no LITELOG_API_SERVER set..."
fi

cat <<APIJS > ./api.js
window.API_KEY = "${LITELOG_API_KEY}"
window.API_SERVER = "${LITELOG_API_SERVER}"
APIJS

exec nginx -g "daemon off;"