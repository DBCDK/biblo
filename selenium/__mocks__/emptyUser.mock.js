// Autogenerated!
/* eslint-disable */
const nock = require('nock');
module.exports = function emptyUser(times) {
  nock('http://localhost:3000', {encodedQueryParams: true})
    .post('/api/Profiles/checkIfUserExists')
    .times(times)

    .reply(200, {"username": "bobby_hansen", "exists": true});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .post('/api/Profiles/unilogin')
    .times(times)

    .reply(200, {
      "id": "TBuuF2WcwPRGE5CkfJO7BO5lBKH4p0H2frwPkHtkBzC9IFT4KbtmNP9g7injFjXy",
      "ttl": 30000000,
      "created": "2016-09-13T09:39:12.951Z",
      "profileId": 1,
      "profile": {
        "username": "bobby_hansen",
        "displayName": null,
        "favoriteLibrary": null,
        "description": null,
        "email": null,
        "phone": null,
        "created": "2016-08-11T14:19:29.315Z",
        "lastUpdated": "2016-08-11T14:19:29.315Z",
        "hasFilledInProfile": null,
        "birthday": null,
        "fullName": null,
        "palleid": null,
        "id": 1
      }
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Quarantines/1/check-if-profile-is-quarantined')
    .times(times)

    .reply(200, {"quarantined": false});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Profiles/1')
    .times(times)
    .query({
      "filter": "{\"include\":[\"image\",\"communityRoles\"]}",
      "access_token": "TBuuF2WcwPRGE5CkfJO7BO5lBKH4p0H2frwPkHtkBzC9IFT4KbtmNP9g7injFjXy"
    })
    .reply(200, {
      "username": "bobby_hansen",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-08-11T14:19:29.315Z",
      "lastUpdated": "2016-08-11T14:19:29.315Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 1,
      "communityRoles": [{"name": "member", "id": 1}]
    });

  nock('https://dynamodb.eu-west-1.amazonaws.com:443', {encodedQueryParams: true})
    .post('/')
    .times(times)

    .reply(200, {"Count": 0, "Items": [], "ScannedCount": 80});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Quarantines/1/check-if-profile-is-quarantined')
    .times(times)

    .reply(200, {"quarantined": false});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Profiles/1')
    .times(times)
    .query({
      "filter": "{\"include\":[\"image\",\"communityRoles\"]}",
      "access_token": "TBuuF2WcwPRGE5CkfJO7BO5lBKH4p0H2frwPkHtkBzC9IFT4KbtmNP9g7injFjXy"
    })
    .reply(200, {
      "username": "bobby_hansen",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-08-11T14:19:29.315Z",
      "lastUpdated": "2016-08-11T14:19:29.315Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 1,
      "communityRoles": [{"name": "member", "id": 1}]
    });

  nock('https://dynamodb.eu-west-1.amazonaws.com:443', {encodedQueryParams: true})
    .post('/')
    .times(times)

    .reply(200, {"Count": 0, "Items": [], "ScannedCount": 80});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Quarantines/1/check-if-profile-is-quarantined')
    .times(times)

    .reply(200, {"quarantined": false});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Profiles/1')
    .times(times)
    .query({
      "filter": "{\"include\":[\"image\",\"communityRoles\"]}",
      "access_token": "TBuuF2WcwPRGE5CkfJO7BO5lBKH4p0H2frwPkHtkBzC9IFT4KbtmNP9g7injFjXy"
    })
    .reply(200, {
      "username": "bobby_hansen",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-08-11T14:19:29.315Z",
      "lastUpdated": "2016-08-11T14:19:29.315Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 1,
      "communityRoles": [{"name": "member", "id": 1}]
    });

  nock('https://dynamodb.eu-west-1.amazonaws.com:443', {encodedQueryParams: true})
    .post('/')
    .times(times)

    .reply(200, {"Count": 0, "Items": [], "ScannedCount": 80});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Quarantines/1/check-if-profile-is-quarantined')
    .times(times)

    .reply(200, {"quarantined": false});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Profiles/1')
    .times(times)
    .query({
      "filter": "{\"include\":[\"image\",\"communityRoles\"]}",
      "access_token": "TBuuF2WcwPRGE5CkfJO7BO5lBKH4p0H2frwPkHtkBzC9IFT4KbtmNP9g7injFjXy"
    })
    .reply(200, {
      "username": "bobby_hansen",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-08-11T14:19:29.315Z",
      "lastUpdated": "2016-08-11T14:19:29.315Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 1,
      "communityRoles": [{"name": "member", "id": 1}]
    });

  nock('https://dynamodb.eu-west-1.amazonaws.com:443', {encodedQueryParams: true})
    .post('/')
    .times(times)

    .reply(200, {"Count": 0, "Items": [], "ScannedCount": 80});

  nock('http://uxscrum-i02.dbc.dk:8889', {encodedQueryParams: true})
    .get('/frontpage')
    .times(times)
    .query({"_format": "json"})
    .reply(200, {
      "nid": "8",
      "type": "section_page",
      "title": "frontpage",
      "status": "1",
      "created": "1473759370",
      "changed": "1473759396",
      "field_content": [{
        "widgetName": "ContentPageTextWidget",
        "widgetConfig": {"content": "<p>This is the frontpage</p>"}
      }]
    });
};
