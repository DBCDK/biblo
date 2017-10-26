// Autogenerated!
/* eslint-disable */
const nock = require('nock');
module.exports = function sixteen_top_tracks_review(times) {
  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/work/')
    .times(times)
    .reply(200, {
      "statusCode": 200,
      "data": [{
        "dcTitle": ["16 top tracks"], "dcTitleFull": ["16 top tracks"], "titleSeries": ["CD diamond series"],
        "publisher": ["RCA"], "description": ["Indspilninger publiceret 1956-1963"], "format": ["1 cd, Mono og stereo"],
        "collection": ["870970-basis:07909276"], "collectionDetails": [{
          "accessType": ["physical"], "creator": ["Harry Belafonte"], "pid": ["870970-basis:07909276"],
          "title": ["16 top tracks"], "titleFull": ["16 top tracks"], "type": ["Cd (musik)"], "workType": ["music"]
        }], "accessType": ["physical"], "audience": ["voksenmaterialer"], "subjectDK5": ["78.797:863"],
        "subjectDK5Text": ["Viser. Evergreens. Schlagere"], "creator": ["Harry Belafonte"],
        "dcCreator": ["Harry Belafonte"], "creatorSort": ["Belafonte, Harry"], "workType": ["music"],
        "type": ["Cd (musik)"]
      }]
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/count')
    .times(times)
    .query({"access_token": "", "where": "{\"markedAsDeleted\":null,\"id\":\"291762\"}"})
    .reply(200, {"count": 1});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/count')
    .times(times)
    .query({"access_token": "", "where": "{\"id\":{\"neq\":\"291762\"},\"markedAsDeleted\":null,\"pid\":\"870970-basis:07909276\"}"})
    .reply(200, {"count": 1});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/')
    .times(times)
    .query({"filter": "{\"skip\":0,\"limit\":10,\"order\":\"created DESC\",\"include\":[\"likes\",\"image\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}},{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}}],\"where\":{\"id\":{\"neq\":\"291762\"},\"markedAsDeleted\":null,\"pid\":\"870970-basis:07909276\"}}"})
    .reply(200, [{
      "pid": "870970-basis:07909276",
      "libraryid": "100451",
      "worktype": "music",
      "content": "asdasdasdasd",
      "created": "2017-07-12T12:05:06.000Z", "modified": "2017-07-12T12:05:06.000Z", "rating": 6,
      "markedAsDeleted": null, "palleid": null, "id": 291762, "reviewownerid": 9, "likes": [], "owner": {
        "username": "abcdef", "displayName": "😎👍💩👻🎅👑🌯🚀🕹💣🛋",
        "favoriteLibrary": {"libraryId": "123456", "pincode": "1234", "loanerId": "1234"},
        "description": "Udvikler på Biblo.dk\r\n", "email": "", "phone": "", "created": "2016-03-16T09:51:50.344Z",
        "lastUpdated": "2016-03-16T09:51:50.344Z", "hasFilledInProfile": true, "birthday": "1970-01-14T00:00:00.000Z",
        "fullName": "", "palleid": null, "id": 9, "image": {}
      }
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/')
    .times(times)
    .query({"filter": "{\"limit\":1,\"order\":\"created DESC\",\"include\":[\"likes\",\"image\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}},{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}}],\"where\":{\"markedAsDeleted\":null,\"id\":\"291762\"}}"})
    .reply(200, [{
      "pid": "870970-basis:07909276",
      "libraryid": "100451",
      "worktype": "music",
      "content": "asdasdasdasd",
      "created": "2017-07-12T12:05:06.000Z", "modified": "2017-07-12T12:05:06.000Z", "rating": 6,
      "markedAsDeleted": null, "palleid": null, "id": 291762, "reviewownerid": 9, "likes": [], "owner": {
        "username": "abcdef", "displayName": "😎👍💩👻🎅👑🌯🚀🕹💣🛋",
        "favoriteLibrary": {"libraryId": "123456", "pincode": "1234", "loanerId": "1234"},
        "description": "Udvikler på Biblo.dk\r\n", "email": "", "phone": "", "created": "2016-03-16T09:51:50.344Z",
        "lastUpdated": "2016-03-16T09:51:50.344Z", "hasFilledInProfile": true, "birthday": "1970-01-14T00:00:00.000Z",
        "fullName": "", "palleid": null, "id": 9, "image": {}
      }
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Campaigns?filter=%7B%22where%22%3A%7B%22type%22%3A%22review%22%7D%2C%22include%22%3A%5B%5D%7D')
    .times(times)
    .reply(200, [{
      "campaignName": "Sommerbogen 2016", "startDate": "2016-06-09T20:00:00.044Z",
      "endDate": "2016-08-21T04:00:00.044Z", "logos": {
        "svg": "/sommerbogen-logo.svg", "small": "/sommerbogen-logo.png", "medium": "/sommerbogen-logo.png",
        "large": "/sommerbogen-logo.png"
      }, "type": "review", "id": 1, "workTypes": [{"worktype": "book", "id": 1}, {"worktype": "audiobook", "id": 7}, {
        "worktype": "literature", "id": 10
      }]
    }]);
};
