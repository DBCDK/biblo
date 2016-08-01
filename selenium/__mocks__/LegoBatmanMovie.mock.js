// Autogenerated!
/* eslint-disable */
const nock = require('nock');
module.exports = function LegoBatmanMovie(times) {
  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "dcTitle": ["Lego Batman - the movie"],
        "dcTitleFull": ["Lego Batman - the movie : DC super heroes unite"],
        "publisher": ["Warner Home Video Denmark"],
        "description": ["Produktion: Warner Premiere (USA), Tt Animation (Storbritannien), 2013", "Af indholdet: Special features"],
        "extent": ["ca. 67 min."],
        "format": ["1 dvd-video"],
        "collection": ["870970-basis:29992487", "870970-basis:29992460"],
        "collectionDetails": [{
          "accessType": ["physical"],
          "pid": ["870970-basis:29992487"],
          "title": ["Lego Batman - the movie"],
          "titleFull": ["Lego Batman - the movie : DC super heroes unite"],
          "type": ["Dvd"],
          "workType": ["movie"]
        }, {
          "accessType": ["physical"],
          "pid": ["870970-basis:29992460"],
          "title": ["Lego Batman - the movie"],
          "titleFull": ["Lego Batman - the movie : DC super heroes unite"],
          "type": ["Blu-ray"],
          "workType": ["movie"]
        }],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29992487&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=bb5130d5b55b6f5e1d14"],
        "dcLanguage": ["Flere sprog", "Engelsk"],
        "accessType": ["physical"],
        "audience": ["børnematerialer"],
        "audienceMedieraad": ["Mærkning: Tilladt for alle men frarådes børn under 7 år"],
        "subjectDK5": ["77.74"],
        "subjectDK5Text": ["Børnefilm"],
        "subjectDBCN": ["for 10 år", "for 11 år", "for 12 år", "for 7 år", "for 8 år", "for 9 år"],
        "subjectDBCO": ["amerikanske film", "engelske film"],
        "subjectDBCS": ["superhelte"],
        "creatorDrt": ["Jon Burton"],
        "creatorSort": ["Burton, Jon"],
        "abstract": ["Jokeren vil tage magten over Gotham City, og da han laver en alliance med Lex Luther, kommer Batman pludselig i problemer. Selvom han helst vil klare problemerne alene, må Batman erkende, at selv en superhelt kan have behov for hjælp"],
        "workType": ["movie"],
        "type": ["Dvd"],
        "date": ["2013"]
      }]
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/count')
    .times(times)
    .query({
      "access_token": "",
      "where": "{\"and\":[{\"markedAsDeleted\":null},{\"or\":[{\"pid\":\"870970-basis:29992487\"},{\"pid\":\"870970-basis:29992460\"}]}]}"
    })
    .reply(200, {"count": 0});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/')
    .times(times)
    .query({"filter": "{\"skip\":0,\"limit\":10,\"order\":\"created DESC\",\"include\":[\"likes\",\"image\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}},{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}}],\"where\":{\"and\":[{\"markedAsDeleted\":null},{\"or\":[{\"pid\":\"870970-basis:29992487\"},{\"pid\":\"870970-basis:29992460\"}]}]}}"})
    .reply(200, []);

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
};
