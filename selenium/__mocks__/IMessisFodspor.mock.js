// Autogenerated!
/* eslint-disable */
const nock = require('nock');
module.exports = function IMessisFodspor(times) {
  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/count')
    .times(times)
    .query({"access_token": "", "where": "{\"markedAsDeleted\":null,\"id\":\"79285\"}"})
    .reply(200, {"count": 1});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Campaigns')
    .times(times)
    .query({"filter": "{\"where\":{\"type\":\"review\"},\"include\":[]}"})
    .reply(200, [{
      "campaignName": "Sommerbogen 2016", "startDate": "2016-06-09T20:00:00.044Z",
      "endDate": "2016-08-21T04:00:00.044Z", "logos": {
        "svg": "/sommerbogen-logo.svg", "small": "/sommerbogen-logo.png", "medium": "/sommerbogen-logo.png",
        "large": "/sommerbogen-logo.png"
      }, "type": "review", "id": 1, "workTypes": [{"worktype": "book", "id": 1}, {"worktype": "audiobook", "id": 7}, {
        "worktype": "literature", "id": 10
      }]
    }, {
      "campaignName": "Vild Med Film 2016", "startDate": "2016-07-15T22:00:00.000Z",
      "endDate": "2016-09-30T21:59:59.000Z", "logos": {
        "small": "http://admin.biblo.dk/sites/default/files/styles/small/public/campaigns/logos/img/VildmedfilmLOGO_no%20background.png?itok=BjJ1xzJ8",
        "medium": "http://admin.biblo.dk/sites/default/files/styles/medium/public/campaigns/logos/img/VildmedfilmLOGO_no%20background.png?itok=emXGcxp5",
        "large": "http://admin.biblo.dk/sites/default/files/styles/large/public/campaigns/logos/img/VildmedfilmLOGO_no%20background.png?itok=OyLHdCzn",
        "svg": "http://admin.biblo.dk/sites/default/files/campaigns/logos/svg/VildmedfilmLOGO%20solid.svg"
      }, "type": "review", "id": 2, "workTypes": [{"worktype": "movie", "id": 6}]
    }, {
      "campaignName": "Sommerbogen 2017", "startDate": "2017-06-12T22:00:00.000Z",
      "endDate": "2017-08-26T21:59:59.000Z", "logos": {
        "svg": "http://admin.biblo.dk/sites/default/files/campaigns/logos/svg/sommerbogen-logo.svg",
        "small": "http://admin.biblo.dk/sites/default/files/styles/small/public/campaigns/logos/img/Sommerbogen%20logo.png?itok=5f95nbCt",
        "medium": "http://admin.biblo.dk/sites/default/files/styles/medium/public/campaigns/logos/img/Sommerbogen%20logo.png?itok=aAgdIqi0",
        "large": "http://admin.biblo.dk/sites/default/files/styles/large/public/campaigns/logos/img/Sommerbogen%20logo.png?itok=kI0CJooV"
      }, "type": "review", "id": 10, "workTypes": [{"worktype": "book", "id": 1}, {"worktype": "other", "id": 4}, {
        "worktype": "audiobook", "id": 7
      }, {"worktype": "literature", "id": 10}]
    }, {
      "campaignName": "Vild med film 2017", "startDate": "2017-08-31T22:00:00.000Z",
      "endDate": "2017-09-21T21:59:59.000Z", "logos": {
        "svg": "http://admin.biblo.dk/sites/default/files/campaigns/logos/svg/VildmedfilmLOGO%20solid_0.svg",
        "small": "http://admin.biblo.dk/sites/default/files/styles/small/public/campaigns/logos/img/VildmedfilmLOGO_no%20background_0.png?itok=ovrp6MLC",
        "medium": "http://admin.biblo.dk/sites/default/files/styles/medium/public/campaigns/logos/img/VildmedfilmLOGO_no%20background_0.png?itok=ntb0gLew",
        "large": "http://admin.biblo.dk/sites/default/files/styles/large/public/campaigns/logos/img/VildmedfilmLOGO_no%20background_0.png?itok=Hs5ErkZ7"
      }, "type": "review", "id": 11, "workTypes": [{"worktype": "movie", "id": 6}]
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/')
    .times(times)
    .query({"filter": "{\"limit\":1,\"order\":\"created DESC\",\"include\":[\"likes\",\"image\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}},{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}}],\"where\":{\"markedAsDeleted\":null,\"id\":\"79285\"}}"})
    .reply(200, [{
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "book",
      "content": "det hele hele om en dreng som bliver kaldt    lopen.\r\nLopen er en dreng som elsker at spille fodbold.\r\nHans drøm er at blive en af de store klubber.\r\nmen han har en sygdom så han ikke kan vokse.\r\nog han bor sammen med sin mor og far og sine \r\nto brødre og bedstemor kommer tit hjem hos ham.\r\nmen lopen ville god komme på fodboldholdet \r\nmen træner siger at han er for lille til at spille med \r\nmen bedstemor giver ikke op.\r\nmen ind kampen er en af spillerne ikke\r\nkommet. Men kampen  skal til at gå i gang \r\nså kommer lopen en på banen lopen var god         \r\nhan drible hel hold.og han kom med på holdet \r\n   jeg synes den er god fordi  den er spæne og sjov og inspirerende og jeg kan andbefale den til dem der elsker fodbold  ",
      "created": "2016-11-28T13:55:22.000Z", "modified": "2017-03-27T08:12:58.000Z", "rating": 6,
      "markedAsDeleted": null, "palleid": null, "id": 79285, "reviewownerid": 123456, "likes": [{
        "item_id": null, "value": "1", "id": 18446, "profileId": 12345, "likeid": null, "reviewlikeid": 79285
      }], "owner": {}
    }]);

  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200, "data": [{
        "dcTitle": ["I Messis fodspor"], "dcTitleFull": ["I Messis fodspor : drengen med det gyldne venstre ben"],
        "publisher": ["Facet"], "extent": ["157 sider"],
        "collection": ["870970-basis:50911713", "870970-basis:51092376", "870970-basis:51778707"],
        "collectionDetails": [{
          "accessType": ["physical"], "creator": ["Dan Toft"], "pid": ["870970-basis:50911713"], "language": ["Dansk"],
          "title": ["I Messis fodspor"], "titleFull": ["I Messis fodspor : drengen med det gyldne venstre ben"],
          "type": ["Bog"], "workType": ["book"]
        }, {
          "accessType": ["online"], "creator": ["Dan Toft"], "pid": ["870970-basis:51092376"], "language": ["Dansk"],
          "title": ["I Messis fodspor"], "titleFull": ["I Messis fodspor : drengen med det gyldne venstre ben"],
          "type": ["Ebog"], "workType": ["book"]
        }, {
          "accessType": ["physical"], "creator": ["Dan Toft"], "pid": ["870970-basis:51778707"], "language": ["Dansk"],
          "title": ["I Messis fodspor"], "titleFull": ["I Messis fodspor : drengen med det gyldne venstre ben"],
          "type": ["Lydbog (cd-mp3)"], "workType": ["audiobook"]
        }],
        "dcLanguage": ["Dansk"], "accessType": ["physical"], "audienceAge": ["fra 10 år"],
        "audience": ["børnematerialer"], "subjectDK5": ["sk"], "subjectDK5Text": ["Skønlitteratur"],
        "subjectDBCN": ["for 10 år", "for 11 år", "for 12 år", "for 13 år", "let at læse"],
        "subjectDBCS": ["Lionel Andrés Messi", "familien", "fodbold", "talent"], "creator": ["Dan Toft"],
        "creatorAut": ["Dan Toft"], "creatorSort": ["Toft, Dan"],
        "abstract": ["Den fattige argentinske dreng, Loppen, drømmer om at spille på byens fodboldhold, men træneren mener han er for lille. Da der opstår en ledig plads på holdet, får Loppen chancen for at vise sit særlige talent, der gør ham til en af fodboldens verdensstjerner"],
        "workType": ["book"], "type": ["Bog"], "date": ["2014"]
      }]
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/count')
    .times(times)
    .query({
      "access_token": "",
      "where": "{\"id\":{\"neq\":\"79285\"},\"markedAsDeleted\":null,\"pid\":\"870970-basis:50911713\"}"
    })
    .reply(200, {"count": 14});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/')
    .times(times)
    .query({"filter": "{\"skip\":0,\"limit\":10,\"order\":\"created DESC\",\"include\":[\"likes\",\"image\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}},{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}}],\"where\":{\"id\":{\"neq\":\"79285\"},\"markedAsDeleted\":null,\"pid\":\"870970-basis:50911713\"}}"})
    .reply(200, [{
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "book",
      "content": "Bogen handler om en dreng, der kaldes Loppen. Loppens bedstemor har lagt mærke til, at han kan noget helt særligt med en fodbold. Den lokale fodboldtræner synes at Loppen er alt for lille til at spille, men Bedste får ham til sidst overtalt, og derefter går det stærkt for Loppen. \r\nJeg synes at bogen er rigtig spændende og jeg kan varmt anbefale enhver fodboldinteresserede at læse den. \r\n- 6 stjerner for den medrivende handling.",
      "created": "2017-08-13T10:14:40.000Z", "modified": "2017-08-13T10:14:40.000Z", "rating": 6,
      "markedAsDeleted": null, "palleid": null, "id": 91731, "reviewownerid": 123456, "likes": [], "owner": {}
    }, {
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "book",
      "content": "Loppen er en lille fattig dreng, som er rigtigt god til fodbold. Men Loppen må ikke, starte på holdet for sin træner. Men hans bedstemor får træneren overtalt, til at han spiller en kamp, men han er så god, så han får lov til at starte alligevel. Det går rigtigt godt, så Loppen skal til optagelseprøve, på holdet Store N. Han bliver optaget, det går endnu bedre, end hos sin gamle klub. Loppen vokser, og bliver en endnu bedre, han får muligheden for at komme til FC Barcelona. \r\nJeg synes bogen er god, men der er lidt for mange kedelige tidspunkter. Den får 4/6 stjerner fordi at den er god, men lidt for kedelig.",
      "created": "2017-08-07T13:54:52.000Z", "modified": "2017-08-07T13:54:52.000Z", "rating": 4,
      "markedAsDeleted": null, "palleid": null, "id": 90237, "reviewownerid": 123456, "likes": [], "owner": {}
    }, {
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "book",
      "content": "Loppen er en dreng der ikke er så høj. Da han er 13 år gammel kommer han på fodboldakademiet i Barcelona. Her spiller han kamp mod sit gamle hold.\r\nJeg synes bogen er god og giver mig viden.",
      "created": "2017-06-28T09:18:03.000Z", "modified": "2017-06-28T09:18:03.000Z", "rating": 6,
      "markedAsDeleted": null, "palleid": null, "id": 82395, "reviewownerid": 123456, "likes": [], "owner": {}
    }, {
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "book",
      "content": "Den handler om en dreng som næsten er Messi", "created": "2016-08-17T07:12:27.000Z",
      "modified": "2016-08-17T07:12:27.000Z", "rating": 6, "markedAsDeleted": null, "palleid": null, "id": 77393,
      "reviewownerid": 123456, "likes": [{
        "item_id": null, "value": "1", "id": 13915, "profileId": 12345, "likeid": null, "reviewlikeid": 77393
      }, {
        "item_id": null, "value": "1", "id": 18440, "profileId": 12345, "likeid": null, "reviewlikeid": 77393
      }, {
        "item_id": null, "value": "1", "id": 18441, "profileId": 12345, "likeid": null, "reviewlikeid": 77393
      }, {
        "item_id": null, "value": "1", "id": 18442, "profileId": 12345, "likeid": null, "reviewlikeid": 77393
      }, {
        "item_id": null, "value": "1", "id": 18443, "profileId": 12345, "likeid": null, "reviewlikeid": 77393
      }, {"item_id": null, "value": "1", "id": 18444, "profileId": 12345, "likeid": null, "reviewlikeid": 77393}],
      "owner": {}
    }, {
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "book",
      "content": "den er god fordi at de fortætler om Messi da han var hel lille og hvordan han kom i mester klubben Fc Barcelona. og hvordan han kom til succes og er blevet kåret til den bedste fodbold spiller 5 gange",
      "created": "2016-08-12T07:08:34.000Z", "modified": "2016-08-12T07:08:34.000Z", "rating": 6,
      "markedAsDeleted": null, "palleid": null, "id": 76569, "reviewownerid": 123456, "likes": [], "owner": {}
    }, {
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "book",
      "content": "jeg synes at den er rigtig god. den handler om en dreng der bliver kaldt for loppen og han er meget lille så han må ikke spille på et hold men så er der en spille der bliver skadet og så må han godt spille med og så ser de hans talent og så må han spille med dem vær gang de skal træne og spille kamp  ",
      "created": "2016-08-11T11:29:09.000Z", "modified": "2016-08-11T11:29:09.000Z", "rating": 6,
      "markedAsDeleted": null, "palleid": null, "id": 76414, "reviewownerid": 123456, "likes": [], "owner": {}
    }, {
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "book",
      "content": "Bogen handler om en argentinsk dreng, Loppen der har et kæmpe fodboldtalent. Han er ikke så høj og derfor for han ikke lov til at spille på et hold. Der er en spiller som er skadet og så kommer han til at spille en kamp får dem og bagefter kommer han på holdet. Senere kom han til en klub som hedder store N som er en konkurrence om hvem der bliver der og kan blive sendt til en stor klub. Da han så bliver 13 år bliver han sendt til Barcelona for at spille der. ",
      "created": "2016-07-31T08:50:49.000Z", "modified": "2016-07-31T08:50:49.000Z", "rating": 5,
      "markedAsDeleted": null, "palleid": null, "id": 73678, "reviewownerid": 123456, "likes": [], "owner": {}
    }, {
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "book",
      "content": "I Messis fodspor følger du drengen messi/loppen starten handler om messi som gerne vil spille fodbold men hans mor synes han er for ung men hans bedste ven også kanldt hans bedste mor hun synes ikke man kan være for. ung senere møder han flere udfordringer både i familien og på banen. bogen giver en løst til af spille fodbold og læse videre.kan kun sigde en rigtig god bog.",
      "created": "2016-06-13T14:49:02.000Z", "modified": "2016-06-13T14:49:02.000Z", "rating": 6,
      "markedAsDeleted": null, "palleid": null, "id": 64944, "reviewownerid": 123456,
      "likes": [{"item_id": null, "value": "1", "id": 2494, "profileId": 12345, "likeid": null, "reviewlikeid": 64944}],
      "owner": {}
    }, {
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "literature",
      "content": "Bogen handler om en dreng ved navn Messi. Han har altid været lille. Han havde en bedstemor, hun støttede ham i alt det han lavede.\nEn dag kommer hans bedstemor, hun siger at han skal begynde til fodbold. Hun har nemlig set ham spille sammen med de andre drenge på gaden. Hun tager ham med til træning, men træneren siger at han er for lille og spinkel. Bedstemoren siger til træneren ”Det kommer du til at fortryde. ” De kommer igen da de skal spille kamp. Han må ikke spille. Han kommer alligevel til at spille da en ikke kommer fra holdet. Slutresultatet er 2-0 til deres hold. De er vildt begejstret over at han er så god til fodbold. Træneren kommer hen til bedstemoren og siger der er træning næste dag. Han flytter senere til Store N og bliver topscore, det er den største klub i landet. Det spredes hurtig at der er en god spiller. Pludselig kommer der et brev fra Barcelonas akademi. I brevet stå at han skal til prøvetræning i næste uge..\nLÆS og find ud af om Messi kommer til Barcelona.",
      "created": "2015-08-06T22:00:00.000Z", "modified": "2015-08-06T22:00:00.000Z", "rating": 5,
      "markedAsDeleted": null, "palleid": 1234, "id": 60610, "reviewownerid": 123456, "likes": [], "owner": {}
    }, {
      "pid": "870970-basis:50911713", "libraryid": "123456", "worktype": "literature",
      "content": "Bogen handler om loppen som er Messi, som stort ikke tænker på andet at spille fodbold. når de store dreng træner og spiller kamp på fodboldbanen, kigger han på med sin bedstemor, som kender til loppens talent, plager ofte træneren om, at loppen kan få lov til at spille med.\nDet er en fodbold bog som er skrevet af Dan Toft. Den er let at læse \nDen er for børn i 4 til 5 klasse. Det er en realistisk bog.\nJeg synes bog er bog er god fordi det er en realistisk bog, og det er godt fordi det lyder, til at det er sket i virkeligheden. Tema er en fodbold bog. . Loppen er god til fodbold træneren snakker med hans far de snakkede om hans talent, og hvor han kunne komme til at spille henne. De snakkede om at han kunne komme til Barcelona.\nJeg synes den skal have fire ud af fem stjerner.   \n",
      "created": "2014-11-05T23:00:00.000Z", "modified": "2014-11-05T23:00:00.000Z", "rating": 5,
      "markedAsDeleted": null, "palleid": 1234, "id": 50415, "reviewownerid": 123456, "likes": [], "owner": {}
    }]);
};
