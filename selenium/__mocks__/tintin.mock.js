// Autogenerated!
/* eslint-disable */
const nock = require('nock');
module.exports = function krigerkattene(times) {
  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "dcTitle": ['"Enhjørningen"s hemmelighed'], "dcTitleFull": ['Enhjørningen"s hemmelighed'],
        "titleSeries": ["Tintins oplevelser ; 11", "Carlsen minicomics"], "publisher": ["Carlsen"],
        "descriptionSeries": ['Samhørende: "Enhjørningen"s hemmelighed ; Rackham den Rødes skat'],
        "extent": ["62 sider"], "format": ["alle illustreret i farver"],
        "collection": ["870970-basis:29693544", "870970-basis:28873697", "870970-basis:27252540", "870970-basis:26346924", "870970-basis:05053994"],
        "collectionDetails": [{
          "accessType": ["physical"], "creator": ["Hergé"], "pid": ["870970-basis:29693544"], "language": ["Dansk"],
          "title": ['"Enhjørningen"s hemmelighed'], "titleFull": ['"Enhjørningen"s hemmelighed'],
          "type": ["Tegneserie"], "workType": ["book"]
        }, {
          "accessType": ["physical"], "creator": ["Hergé"], "pid": ["870970-basis:28873697"], "language": ["Dansk"],
          "title": ['"Enhjørningen"s hemmelighed'], "titleFull": ['"Enhjørningen"s hemmelighed'],
          "type": ["Tegneserie"], "workType": ["book"]
        }, {
          "accessType": ["physical"], "creator": ["Hergé"], "pid": ["870970-basis:27252540"], "language": ["Dansk"],
          "title": ['"Enhjørningen"s hemmelighed'], "titleFull": ['"Enhjørningen"s hemmelighed'],
          "type": ["Tegneserie"], "workType": ["book"]
        }, {
          "accessType": ["physical"], "creator": ["Hergé"], "pid": ["870970-basis:26346924"], "language": ["Dansk"],
          "title": ['"Enhjørningen"s hemmelighed'], "titleFull": ['"Enhjørningen"s hemmelighed'],
          "type": ["Tegneserie"], "workType": ["book"]
        }, {
          "accessType": ["physical"], "creator": ["Hergé"], "pid": ["870970-basis:05053994"], "language": ["Dansk"],
          "title": ['"Enhjørningen"s hemmelighed'], "titleFull": ['"Enhjørningen"s hemmelighed'],
          "type": ["Tegneserie"], "workType": ["book"]
        }],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=27252540&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=28a18e117e91f39483e5"],
        "dcLanguage": ["Dansk"], "accessType": ["physical"], "audienceAge": ["fra 10 år"],
        "audience": ["børnematerialer"], "subjectDK5": ["sk"], "subjectDK5Text": ["Skønlitteratur"],
        "subjectDBCN": ["for 10 år", "for 11 år", "for 12 år"], "creator": ["Hergé"], "creatorAut": ["Hergé"],
        "creatorSort": ["Hergé"], "abstract": ["Tegneserie hvor Tintin finder et budskab om en skjult sørøverskat"],
        "workType": ["book"], "type": ["Tegneserie"], "date": ["2008"]
      }]
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/count')
    .times(times)
    .query({"access_token":"","where":"{\"and\":[{\"markedAsDeleted\":null},{\"or\":[{\"pid\":\"870970-basis:29693544\"}]}]}"})
    .reply(200, {"count":0});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/')
    .times(times)
    .query({"filter":"{\"skip\":0,\"limit\":10,\"order\":\"created DESC\",\"include\":[\"likes\",\"image\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}},{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}}],\"where\":{\"and\":[{\"markedAsDeleted\":null},{\"or\":[{\"pid\":\"870970-basis:29693544\"}]}]}}"})
    .reply(200, []);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Campaigns')
    .times(times)
    .query({"filter":"{\"where\":{\"type\":\"review\"},\"include\":[]}"})
    .reply(200, [{"campaignName":"Sommerbogen 2016","startDate":"2016-06-09T20:00:00.044Z","endDate":"2016-08-21T04:00:00.044Z","logos":{"svg":"/sommerbogen-logo.svg","small":"/sommerbogen-logo.png","medium":"/sommerbogen-logo.png","large":"/sommerbogen-logo.png"},"type":"review","id":1,"workTypes":[{"worktype":"book","id":1},{"worktype":"audiobook","id":7},{"worktype":"literature","id":10}]}]);

  // Mocking request/response for contents in "Alle bøger i serien Tintins oplevelser"-container
  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/search/?q=%28%22%2A%22%29%20AND%20%28phrase.titleSeries%3D%22Tintins%20oplevelser%22%29&fields%5B0%5D=pid&fields%5B1%5D=coverUrlFull&fields%5B2%5D=dcTitle&fields%5B3%5D=titleSeries&fields%5B4%5D=workType&limit=18&offset=0&sort=solr_numberInSeries_ascending')
    .times(times)
    .reply(200, {"statusCode":200,"data":[{"pid":["870970-basis:52000602"],"coverUrlFull":["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=52000602&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=16ae391a3e0a51f8fb4c"],"dcTitle":["Faraos cigarer"],"titleSeries":["Tintins oplevelser"],"workType":["book"]},{"pid":["870970-basis:29394393"],"coverUrlFull":["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29394393&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=2544df996d2c85794ac7"],"dcTitle":["Den mystiske stjerne"],"titleSeries":["Tintins oplevelser"],"workType":["book"]},{"pid":["870970-basis:29693544"],"dcTitle":['"Enhjørningen"s hemmelighed'],"titleSeries":["Tintins oplevelser ; 11"],"workType":["book"]},{"pid":["870970-basis:29068623"],"coverUrlFull":["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29068623&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=869df4bbd3358ca2a811"],"dcTitle":["De 7 krystalkugler"],"titleSeries":["Tintins oplevelser ; 13"],"workType":["book"]},{"pid":["870970-basis:26913063"],"dcTitle":['Tintin, reporteren fra "Petit vingtième", i Sovjetunionen'],"titleSeries":["Tintins oplevelser ; 1","Carlsen minicomics"],"workType":["book"]},{"pid":["870970-basis:26913098"],"dcTitle":["Tintin i Congo"],"titleSeries":["Tintins oplevelser ; 2","Carlsen minicomics"],"workType":["book"]}]});

  // Mocking request/response for contents in "Carlsen minicomics"-container
  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/search/?q=%28%22%2A%22%29%20AND%20%28phrase.titleSeries%3D%22Carlsen%20minicomics%22%29&fields%5B0%5D=pid&fields%5B1%5D=coverUrlFull&fields%5B2%5D=dcTitle&fields%5B3%5D=titleSeries&fields%5B4%5D=workType&limit=6&offset=0&sort=solr_numberInSeries_ascending')
    .times(times)
    .reply(200, {"statusCode":200,"data":[{"pid":["870970-basis:52000602"],"coverUrlFull":["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=52000602&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=16ae391a3e0a51f8fb4c"],"dcTitle":["Faraos cigarer"],"titleSeries":["Tintins oplevelser"],"workType":["book"]},{"pid":["870970-basis:29394393"],"coverUrlFull":["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29394393&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=2544df996d2c85794ac7"],"dcTitle":["Den mystiske stjerne"],"titleSeries":["Tintins oplevelser"],"workType":["book"]},{"pid":["870970-basis:29693544"],"dcTitle":['"Enhjørningen"s hemmelighed'],"titleSeries":["Tintins oplevelser ; 11"],"workType":["book"]},{"pid":["870970-basis:29068623"],"coverUrlFull":["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29068623&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=869df4bbd3358ca2a811"],"dcTitle":["De 7 krystalkugler"],"titleSeries":["Tintins oplevelser ; 13"],"workType":["book"]},{"pid":["870970-basis:26913063"],"dcTitle":['Tintin, reporteren fra "Petit vingtième", i Sovjetunionen'],"titleSeries":["Tintins oplevelser ; 1","Carlsen minicomics"],"workType":["book"]},{"pid":["870970-basis:26913098"],"dcTitle":["Tintin i Congo"],"titleSeries":["Tintins oplevelser ; 2","Carlsen minicomics"],"workType":["book"]}]});

  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/search/?q=%28%22%2A%22%29%20AND%20%28phrase.titleSeries%3D%22Carlsen%20minicomics%22%29&fields%5B0%5D=pid&fields%5B1%5D=coverUrlFull&fields%5B2%5D=dcTitle&fields%5B3%5D=titleSeries&fields%5B4%5D=workType&limit=18&offset=0&sort=solr_numberInSeries_ascending')
    .times(times)
    .reply(200, {
      "statusCode": 200,
      "data": [],
      "timings": {
        "total": 164,
        "external": 159
      }
    });
};
