set STANDARD_CACHE_TIME=1
set COMMUNITY_SERVICE_URL=http://uxscrum-i02.dbc.dk:3002/

concurrent.cmd "npm run start:watch -s" "npm run serve -s"
