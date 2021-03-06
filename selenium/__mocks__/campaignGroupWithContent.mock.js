// Autogenerated!
/* eslint-disable */
const nock = require('nock');
module.exports = function campaignGroupWithContent(times) {
  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Campaigns')
    .times(times)
    .query({"filter": "{\"where\":{\"type\":\"review\"},\"include\":[]}"})
    .reply(200, [{
      "campaignName": "Sommerbogen 2016",
      "startDate": "2016-06-09T20:00:00.044Z",
      "endDate": "2016-08-21T04:00:00.044Z",
      "logos": {
        "svg": "/sommerbogen-logo.svg",
        "small": "/sommerbogen-logo.png",
        "medium": "/sommerbogen-logo.png",
        "large": "/sommerbogen-logo.png"
      },
      "type": "review",
      "id": 1,
      "workTypes": [{"worktype": "book", "id": 1}, {"worktype": "audiobook", "id": 7}, {
        "worktype": "literature",
        "id": 10
      }]
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Posts/')
    .times(times)
    .query({"filter": "{\"limit\":5,\"skip\":0,\"counts\":\"comments\",\"where\":{\"groupid\":\"2\",\"markedAsDeleted\":null},\"order\":\"timeCreated DESC\",\"include\":[\"image\",{\"owner\":[\"image\"]},\"pdf\",\"likes\",{\"relation\":\"review\",\"scope\":{\"include\":[\"image\",\"likes\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}}]}},{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}}]}"})
    .reply(200, [{
      "title": " ",
      "content": "asdasd",
      "timeCreated": "2016-07-22T07:02:49.000Z",
      "markedAsDeleted": null,
      "id": 2,
      "postownerid": 1,
      "postcontainergroupid": 2,
      "postid": null,
      "groupid": 2,
      "attachedReviewId": 0,
      "commentsCount": 0,
      "owner": {},
      "likes": []
    }, {
      "title": " ",
      "content": "halløj!",
      "timeCreated": "2016-07-21T13:28:11.000Z",
      "markedAsDeleted": null,
      "id": 1,
      "postownerid": 1,
      "postcontainergroupid": 2,
      "postid": null,
      "groupid": 2,
      "attachedReviewId": 0,
      "commentsCount": 1,
      "owner": {},
      "likes": []
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Campaigns')
    .times(times)
    .query({"filter": "{\"where\":{\"type\":\"group\"},\"include\":\"group\"}"})
    .reply(200, [{
      "campaignName": "fjolle kampagne",
      "startDate": "2016-07-20T00:00:00.000Z",
      "endDate": "2016-07-22T00:00:00.000Z",
      "logos": {
        "svg": "/sommerbogen-logo.svg",
        "small": "/sommerbogen-logo.png",
        "medium": "/sommerbogen-logo.png",
        "large": "/sommerbogen-logo.png"
      },
      "type": "group",
      "id": 2,
      "workTypes": [],
      "group": {
        "name": "Skriv din egen historie",
        "description": "Dette er en test kampagne gruppe!",
        "colour": "blue",
        "timeCreated": "2016-07-25T09:03:23.000Z",
        "id": 136,
        "groupownerid": 323,
        "campaignGroupFK": 2,
        "campaign": {
          "campaignName": "fjolle kampagne",
          "startDate": "2016-07-20T00:00:00.000Z",
          "endDate": "2016-07-22T00:00:00.000Z",
          "logos": {
            "svg": "/sommerbogen-logo.svg",
            "small": "/sommerbogen-logo.png",
            "medium": "/sommerbogen-logo.png",
            "large": "/sommerbogen-logo.png"
          },
          "type": "group",
          "id": 2,
          "workTypes": []
        }
      }
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Groups/2/members')
    .query((actualQueryObject) => true) // return all memebers on all requests as some parameteres are being randomized @see https://github.com/node-nock/nock#specifying-request-query-string
    .times(times)
    .reply(200, [{
      "username": "bobby_hansen",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 2
    }, {
      "username": "jona341k",
      "displayName": "Llama",
      "favoriteLibrary": {"libraryId": "714700"},
      "description": "",
      "email": "",
      "phone": "",
      "created": "2016-07-21T13:15:38.943Z",
      "lastUpdated": "2016-07-21T13:15:38.943Z",
      "hasFilledInProfile": true,
      "birthday": null,
      "fullName": "",
      "palleid": null,
      "id": 1
    }, {
      "username": "user_3",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 3
    }, {
      "username": "user_4",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 4
    }, {
      "username": "user_5",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 5
    }, {
      "username": "user_6",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 6
    }, {
      "username": "user_7",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 7
    }, {
      "username": "user_8",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 8
    }, {
      "username": "user_9",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 9
    }
    ]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Groups/2/members?filter=%7B%22include%22%3A%22image%22%2C%22limit%22%3Anull%2C%22offset%22%3Anull%7D')
    .times(times)
    .reply(200, [{
      "username": "bobby_hansen",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 2
    }, {
      "username": "jona341k",
      "displayName": "Llama",
      "favoriteLibrary": {"libraryId": "714700"},
      "description": "",
      "email": "",
      "phone": "",
      "created": "2016-07-21T13:15:38.943Z",
      "lastUpdated": "2016-07-21T13:15:38.943Z",
      "hasFilledInProfile": true,
      "birthday": null,
      "fullName": "",
      "palleid": null,
      "id": 1
    }, {
      "username": "user_3",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 3
    }, {
      "username": "user_4",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 4
    }, {
      "username": "user_5",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 5
    }, {
      "username": "user_6",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 6
    }, {
      "username": "user_7",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 7
    }, {
      "username": "user_8",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 8
    }, {
      "username": "user_9",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 9
    }, {
      "username": "user_10",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 10
    }, {
      "username": "user_11",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 11
    }, {
      "username": "user_12",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 12
    }, {
      "username": "user_13",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 13
    }, {
      "username": "user_14",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 14
    }, {
      "username": "user_15",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 15
    }, {
      "username": "user_16",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 16
    }, {
      "username": "user_17",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 17
    }, {
      "username": "user_18",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 18
    }, {
      "username": "user_19",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 19
    }, {
      "username": "user_20",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 20
    }, {
      "username": "user_21",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 21
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Groups/2')
    .times(times)
    .query({"filter": "{\"counts\":[\"posts\",\"members\"],\"include\":[{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}},{\"relation\":\"coverImage\"}]}"})
    .reply(200, {
      "name": "string",
      "description": "string",
      "colour": "blue",
      "timeCreated": "2016-07-21T00:00:00.000Z",
      "id": 2,
      "groupownerid": 1,
      "campaignGroupFK": 2,
      "postsCount": 2,
      "membersCount": 21,
      "campaign": {
        "campaignName": "fjolle kampagne",
        "startDate": "2016-07-20T00:00:00.000Z",
        "endDate": "2016-07-22T00:00:00.000Z",
        "logos": {
          "svg": "/sommerbogen-logo.svg",
          "small": "/sommerbogen-logo.png",
          "medium": "/sommerbogen-logo.png",
          "large": "/sommerbogen-logo.png"
        },
        "type": "group",
        "id": 2,
        "workTypes": []
      },
      "members": [],
      "owner": {}
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Comments/')
    .times(times)
    .query({"filter": "{\"limit\":1,\"skip\":0,\"order\":\"timeCreated DESC\",\"include\":[\"image\",\"review\",{\"owner\":[\"image\"]},{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}}],\"where\":{\"postid\":2}}"})
    .reply(200, []);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Comments/')
    .times(times)
    .query({"filter": "{\"limit\":1,\"skip\":0,\"order\":\"timeCreated DESC\",\"include\":[\"image\",\"review\",{\"owner\":[\"image\"]},{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}}],\"where\":{\"postid\":1}}"})
    .reply(200, [{
      "content": "adsf",
      "timeCreated": "2016-07-21T13:31:42.000Z",
      "id": 1,
      "commentownerid": 1,
      "commentcontainerpostid": 1,
      "postid": 1,
      "attachedReviewId": 0,
      "owner": {}
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/imageCollections/1/download/small')
    .times(times)

    .reply(200, {
      "container": "uxdev-biblo-imagebucket",
      "name": "8cd9a57753bb-4c58-9444-eea3c04aa0a7.jpg",
      "type": "image/jpeg",
      "url": "https://uxdev-biblo-imagebucket.s3-eu-west-1.amazonaws.com/8cd9a57753bb-4c58-9444-eea3c04aa0a7.jpg",
      "id": 1,
      "resolutionImageFileId": 1,
      "resolutionVideoFileId": null
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Campaigns')
    .times(times)
    .query({"filter": "{\"where\":{\"type\":\"review\"},\"include\":[]}"})
    .reply(200, [{
      "campaignName": "Sommerbogen 2016",
      "startDate": "2016-06-09T20:00:00.044Z",
      "endDate": "2016-08-21T04:00:00.044Z",
      "logos": {
        "svg": "/sommerbogen-logo.svg",
        "small": "/sommerbogen-logo.png",
        "medium": "/sommerbogen-logo.png",
        "large": "/sommerbogen-logo.png"
      },
      "type": "review",
      "id": 1,
      "workTypes": [{"worktype": "book", "id": 1}, {"worktype": "audiobook", "id": 7}, {
        "worktype": "literature",
        "id": 10
      }]
    }]);

  /*
  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Groups/2/members?filter=%7B%22include%22%3A%22image%22%7D')
    .times(times)
    .reply(200, [{
      "username": "bobby_hansen",
      "displayName": null,
      "favoriteLibrary": null,
      "description": null,
      "email": null,
      "phone": null,
      "created": "2016-07-22T09:24:55.650Z",
      "lastUpdated": "2016-07-22T09:24:55.650Z",
      "hasFilledInProfile": null,
      "birthday": null,
      "fullName": null,
      "palleid": null,
      "id": 2
    }, {
      "username": "jona341k",
      "displayName": "Llama",
      "favoriteLibrary": {"libraryId": "714700"},
      "description": "",
      "email": "",
      "phone": "",
      "created": "2016-07-21T13:15:38.943Z",
      "lastUpdated": "2016-07-21T13:15:38.943Z",
      "hasFilledInProfile": true,
      "birthday": null,
      "fullName": "",
      "palleid": null,
      "id": 1
    }]);
    */

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Campaigns')
    .times(times)
    .query({"filter": "{\"where\":{\"type\":\"group\"},\"include\":\"group\"}"})
    .reply(200, [{
      "campaignName": "fjolle kampagne",
      "startDate": "2016-07-20T00:00:00.000Z",
      "endDate": "2016-07-22T00:00:00.000Z",
      "logos": {
        "svg": "/sommerbogen-logo.svg",
        "small": "/sommerbogen-logo.png",
        "medium": "/sommerbogen-logo.png",
        "large": "/sommerbogen-logo.png"
      },
      "type": "group",
      "id": 2,
      "workTypes": [],
      "group": {
        "name": "Skriv din egen historie",
        "description": "Dette er en test kampagne gruppe!",
        "colour": "blue",
        "timeCreated": "2016-07-25T09:03:23.000Z",
        "id": 136,
        "groupownerid": 323,
        "campaignGroupFK": 2,
        "campaign": {
          "campaignName": "fjolle kampagne",
          "startDate": "2016-07-20T00:00:00.000Z",
          "endDate": "2016-07-22T00:00:00.000Z",
          "logos": {
            "svg": "/sommerbogen-logo.svg",
            "small": "/sommerbogen-logo.png",
            "medium": "/sommerbogen-logo.png",
            "large": "/sommerbogen-logo.png"
          },
          "type": "group",
          "id": 2,
          "workTypes": []
        }
      }
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Posts/')
    .times(times)
    .query({"filter": "{\"limit\":5,\"skip\":0,\"counts\":\"comments\",\"where\":{\"groupid\":\"2\",\"markedAsDeleted\":null},\"order\":\"timeCreated DESC\",\"include\":[\"image\",{\"owner\":[\"image\"]},\"pdf\",\"likes\",{\"relation\":\"review\",\"scope\":{\"include\":[\"image\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}}]}},{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}}]}"})
    .reply(200, [{
      "title": " ",
      "content": "asdasd",
      "timeCreated": "2016-07-22T07:02:49.000Z",
      "markedAsDeleted": null,
      "id": 2,
      "postownerid": 1,
      "postcontainergroupid": 2,
      "postid": null,
      "groupid": 2,
      "attachedReviewId": 0,
      "commentsCount": 0,
      "owner": {},
      "likes": []
    }, {
      "title": " ",
      "content": "halløj!",
      "timeCreated": "2016-07-21T13:28:11.000Z",
      "markedAsDeleted": null,
      "id": 1,
      "postownerid": 1,
      "postcontainergroupid": 2,
      "postid": null,
      "groupid": 2,
      "attachedReviewId": 0,
      "commentsCount": 1,
      "owner": {},
      "likes": []
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Groups/2')
    .times(times)
    .query({"filter": "{\"counts\":[\"posts\",\"members\"],\"include\":[{\"relation\":\"members\",\"scope\":{\"order\":\"id DESC\",\"include\":[\"image\"]}},{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}},{\"relation\":\"coverImage\"}]}"})
    .reply(200, {
      "name": "string",
      "description": "string",
      "colour": "blue",
      "timeCreated": "2016-07-21T00:00:00.000Z",
      "id": 2,
      "groupownerid": 1,
      "campaignGroupFK": 2,
      "postsCount": 2,
      "membersCount": 2,
      "campaign": {
        "campaignName": "fjolle kampagne",
        "startDate": "2016-07-20T00:00:00.000Z",
        "endDate": "2016-07-22T00:00:00.000Z",
        "logos": {
          "svg": "/sommerbogen-logo.svg",
          "small": "/sommerbogen-logo.png",
          "medium": "/sommerbogen-logo.png",
          "large": "/sommerbogen-logo.png"
        },
        "type": "group",
        "id": 2,
        "workTypes": []
      },
      "members": [],
      "owner": {}
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Comments/')
    .times(times)
    .query({"filter": "{\"limit\":1,\"skip\":0,\"order\":\"timeCreated DESC\",\"include\":[\"image\",\"review\",{\"owner\":[\"image\"]},{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}}],\"where\":{\"postid\":2}}"})
    .reply(200, []);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Comments/')
    .times(times)
    .query({"filter": "{\"limit\":1,\"skip\":0,\"order\":\"timeCreated DESC\",\"include\":[\"image\",\"review\",{\"owner\":[\"image\"]},{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}}],\"where\":{\"postid\":1}}"})
    .reply(200, [{
      "content": "adsf",
      "timeCreated": "2016-07-21T13:31:42.000Z",
      "id": 1,
      "commentownerid": 1,
      "commentcontainerpostid": 1,
      "postid": 1,
      "attachedReviewId": 0,
      "owner": {}
    }]);
};
