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
        "dcTitle": ["Krigerkattene"],
        "dcTitleFull": ["Krigerkattene. Bind 3, Hemmelighedernes skov"],
        "publisher": ["Sohn"],
        "extent": ["267 sider", "6 bind"],
        "collection": ["870970-basis:28949847", "870970-basis:29024707", "870970-basis:29283893", "870970-basis:29333793", "870970-basis:29496226", "870970-basis:29602352", "870970-basis:29227365", "870970-basis:29288658", "870970-basis:29227756", "870970-basis:29288623", "870970-basis:50926419", "870970-basis:50926400", "870970-basis:29614636", "870970-basis:29614857", "870970-basis:50926427", "870970-basis:50926443"],
        "collectionDetails": [{
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:28949847"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Bog (bind 1)"],
          "workType": ["book"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29024707"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Bog (bind 2)"],
          "workType": ["book"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29283893"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Bog (bind 3)"],
          "workType": ["book"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29333793"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Bog (bind 4)"],
          "workType": ["book"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29496226"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Bog (bind 5)"],
          "workType": ["book"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29602352"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Bog (bind 6)"],
          "workType": ["book"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29227365"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (cd) (bind 1)"],
          "workType": ["audiobook"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29288658"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (cd) (bind 2)"],
          "workType": ["audiobook"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29227756"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (cd-mp3) (bind 1)"],
          "workType": ["audiobook"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29288623"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (cd-mp3) (bind 2)"],
          "workType": ["audiobook"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:50926419"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (cd-mp3) (bind 3)"],
          "workType": ["audiobook"]
        }, {
          "accessType": ["physical"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:50926400"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (cd-mp3) (bind 4)"],
          "workType": ["audiobook"]
        }, {
          "accessType": ["online"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29614636"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (net) (bind 1)"],
          "workType": ["audiobook"]
        }, {
          "accessType": ["online"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:29614857"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (net) (bind 2)"],
          "workType": ["audiobook"]
        }, {
          "accessType": ["online"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:50926427"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (net) (bind 3)"],
          "workType": ["audiobook"]
        }, {
          "accessType": ["online"],
          "creator": ["Erin Hunter"],
          "pid": ["870970-basis:50926443"],
          "language": ["Dansk"],
          "title": ["Krigerkattene"],
          "titleFull": ["Krigerkattene"],
          "type": ["Lydbog (net) (bind 4)"],
          "workType": ["audiobook"]
        }],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29283893&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=45f1630cf18b32c4c617"],
        "dcLanguage": ["Dansk"],
        "accessType": ["physical"],
        "audienceAge": ["fra 7 år"],
        "audience": ["børnematerialer"],
        "subjectDK5": ["sk"],
        "subjectDK5Text": ["Skønlitteratur"],
        "subjectDBCN": ["for 10 år", "for 11 år", "for 7 år", "for 8 år", "for 9 år", "for højtlæsning"],
        "subjectDBCS": ["dyrefortællinger", "forræderi", "katte", "magtkamp", "venskab"],
        "creator": ["Erin Hunter"],
        "creatorAut": ["Erin Hunter"],
        "creatorSort": ["Hunter, Erin"],
        "abstract": ["Katten Ildhjerte er kriger i Tordenklanen. Efter en hård vinter må han og Grastribe komme Flodklanens katte til hjælp. Samtidig bærer de to venner på en hemmelighed, som truer deres venskab: Gråstribe mødes ulovligt med en hunkat fra Flodklanen"],
        "workType": ["book"],
        "type": ["Bog (bind 3)"],
        "date": ["2012"]
      }]
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
      "workTypes": [{"worktype": "book", "id": 1}, {"worktype": "book", "id": 1}, {
        "worktype": "audiobook",
        "id": 7
      }, {"worktype": "audiobook", "id": 7}, {"worktype": "literature", "id": 10}, {"worktype": "literature", "id": 10}]
    }, {
      "campaignName": "Vild Med Film",
      "startDate": "2016-07-16T22:00:00.000Z",
      "endDate": "2016-09-30T21:59:59.000Z",
      "logos": {
        "small": "http://admin.biblo.dk/sites/default/files/styles/small/public/campaigns/logos/img/VildmedfilmLOGO_no%20background.png?itok=BjJ1xzJ8",
        "medium": "http://admin.biblo.dk/sites/default/files/styles/medium/public/campaigns/logos/img/VildmedfilmLOGO_no%20background.png?itok=emXGcxp5",
        "large": "http://admin.biblo.dk/sites/default/files/styles/large/public/campaigns/logos/img/VildmedfilmLOGO_no%20background.png?itok=OyLHdCzn",
        "svg": "http://admin.biblo.dk/sites/default/files/campaigns/logos/svg/VildmedfilmLOGO%20solid.svg"
      },
      "type": "review",
      "id": 2,
      "workTypes": [{"worktype": "movie", "id": 6}]
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/count')
    .times(times)
    .query({
      "access_token": "",
      "where": "{\"and\":[{\"markedAsDeleted\":null},{\"or\":[{\"pid\":\"870970-basis:29283893\"}]}]}"
    })
    .reply(200, {"count": 10});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/')
    .times(times)
    .query({"filter": "{\"skip\":0,\"limit\":10,\"order\":\"created DESC\",\"include\":[\"likes\",\"image\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}},{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}}],\"where\":{\"and\":[{\"markedAsDeleted\":null},{\"or\":[{\"pid\":\"870970-basis:29283893\"}]}]}}"})
    .reply(200, [{
      "pid": "870970-basis:29283893",
      "libraryid": "762100",
      "worktype": "literature",
      "content": "Da vandet fra floden går over sine normale bredder, må krigerkatten Ildhjerte og hans ven, Gråstribe, igen redde en klan fra døden. Denne gang er det Flodklanen der skal reddes, og Gråstribe gør det gerne, da han hemmeligt mødes med en Flodklandronning.\nSelvom Gråstribe bryder Krigerloven, er Ildhjerte ikke meget bedre; han mødes med sin kælekat søster, Prinsesse.\nDe to venner bærer på endnu en hemmelighed; de ved, at klanens næstkommanderende, Tigerklo, er en forræder, og at han har dræbt klanens tidligere næstkommanderende. Kan Ildhjerte og Gråstribe holde på disse hemmeligheder? Vil en af hemmelighederne slippe ud?",
      "created": "2015-07-18T22:00:00.000Z",
      "modified": "2015-07-18T22:00:00.000Z",
      "rating": 5,
      "markedAsDeleted": null,
      "palleid": 63419,
      "id": 56902,
      "reviewownerid": 16240,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29283893",
      "libraryid": "740000",
      "worktype": "literature",
      "content": "den her bog handler om en huskat kat kaldet røde der kommer ud i vildmarken og skal kæmpe for at overleve, sammen med sin klan kæmper de mod tre andre klaner, men der er moske en forræder i bland krigerne og hvem kan han stole på?...\n\njeg giver den her bog fem stjerner fordi det var den første bog hvor jeg kunne læse i flere timer uden at blive træt af det, den har eventyr og fantasi indblandet der for er det en bog for de fleste.\n\nder er fjorden bøger i denne fantastiske serie men kun seks af dem er på dansk, de sidste bøger kommer på dansk i år 2016-2017.\n\nder er et rivende univers i den her bog og man kommer til at se verden fra en anden synsvinkel fordi verden kommer til at se mere farlig ud, og man ser hvordan tingende fungere uden for hjemmet.\n\n ",
      "created": "2014-08-15T22:00:00.000Z",
      "modified": "2014-08-15T22:00:00.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": 55541,
      "id": 49082,
      "reviewownerid": 29392,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29283893",
      "libraryid": "773000",
      "worktype": "literature",
      "content": "Jeg synes at denne bog er meget god, især fordi at der det meste af tiden er en god spænding.\n\nEfter en meget hård vinter med mangel på mad, er der kommet fred i skoven igen. Den brutale anfører, Blodstjerne, er blevet besejret og sneen er begyndt at smelte. Men smeltevandet får floden til at gå over sine bredder, og Ildhjerte og Gråstribe må hjælpe en klan igen. Samtidig er der en hemmelighed, som truer deres venskab. Gråstribe mødes stadig med Sølvfod. Hun er en hunkat fra flodklanen selvom det er forbudt, og da Sølvfod bliver gravid kan det kun ende galt... \n\nGod bog til 10+ årige og egner sig til dem, som kan li' at læse eventyr!",
      "created": "2014-07-11T22:00:00.000Z",
      "modified": "2014-07-11T22:00:00.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": 47850,
      "id": 41453,
      "reviewownerid": 25851,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29283893",
      "libraryid": "0",
      "worktype": "literature",
      "content": "Vinteren er ovre og floden går over sine breder, og så har Flodklanen svært ved at bytte så må Ildhjerte og Gråstribe komme dem til unsenting. Den hunkat Gråstribe mødes med er blevet gravid og der luger katastrofen. Tigerklo har lumske planer kan Ildhjerte nå at stoppe ham.   ",
      "created": "2013-08-06T22:00:00.000Z",
      "modified": "2013-08-06T22:00:00.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": 36797,
      "id": 30605,
      "reviewownerid": 20876,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29283893",
      "libraryid": "775100",
      "worktype": "literature",
      "content": "Syntes den er fantastisk. Læseren kan simpelthen ikke stoppe med at læse. Super god og spændende. Vil Tigerklo angribe? Hvis han vil, hvornår og hvordan? Bliver Gråstribe og Sølvflod's forhold blive opdaget? Jeg er helt vild med serien. Kan varmt anbefale den.",
      "created": "2013-08-02T22:00:00.000Z",
      "modified": "2013-08-02T22:00:00.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": 33742,
      "id": 29167,
      "reviewownerid": 20635,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29283893",
      "libraryid": "721000",
      "worktype": "literature",
      "content": "Jeg synes bogen er god fordi den er hele tiden efterlader en nervøsitet hos læseren. Man er hele tiden bange for om Tigerklos angreb går ud over flere Ildhjerte holder af og om man har krigere nok til at stoppe ham. Man er også bange for om de andre klaner går oprør mod Tordenklanen og om Gråstribe bliver smidt ud af klanen som forræder.\nSlutningen hvor Gråstribe forlader Ildhjerte er rørende og får en til at græde.\nDog er der lidt meget hvor der kun er opmærksomhed på jagt og klanmøder. Derfor 4 stjerner.",
      "created": "2013-07-04T22:00:00.000Z",
      "modified": "2013-07-04T22:00:00.000Z",
      "rating": 5,
      "markedAsDeleted": null,
      "palleid": 26008,
      "id": 21629,
      "reviewownerid": 18515,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29283893",
      "libraryid": "745000",
      "worktype": "literature",
      "content": "Ildhjerte og Gråstribe skal igennem en hård vinter og der er ikke meget mad. Ildhjerte og Gråstribe hjælper Flodklanen med at skaffe mad fordi tobenene har taget noget af floden og forgiftet fiskende.\nEn dag da de er ovre med frisk bytte til Flodklanen får Ildhjerte af vide at Gråstribe skal have killinger med Sølvflod, som er Flodklanens anføres datter. Men det går skidt hved fødslen så Sølvflod dør og Gråstribe må tage killingerne med tilbage til lejren. Ildhjerte hved at Tordenklanens næstkommanderende er en forrædder, og sidt i bogen angriber Tigerklo og de lovløse katte lejren. Tigerklo prøver at dræbe Blåstjerne men Ildhjerte redder hene og bliver udnævnt til næstkommanderende. Flodklanen har gjort krav på Gråstribes killinger, så Gråstribe og Ildhjerte tager sammen afsted for at aflevere dem, og Gråstribe følger med dem for det er det eneste han har tilbage fra Sølvflod.",
      "created": "2012-08-12T22:00:00.000Z",
      "modified": "2012-08-12T22:00:00.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": 19069,
      "id": 16461,
      "reviewownerid": 15971,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29283893",
      "libraryid": "716500",
      "worktype": "literature",
      "content": "den er super spenede og lidt sørgelig jeg lever mig helt ind i bogen jeg har det som om jeg er der som en af bipersonerne og jeg ved hvad de føle og tæker og kendeer til dæres dybeste hemeligheder¨.",
      "created": "2012-08-06T22:00:00.000Z",
      "modified": "2012-08-06T22:00:00.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": 17318,
      "id": 14829,
      "reviewownerid": 14940,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29283893",
      "libraryid": "785100",
      "worktype": "literature",
      "content": "Ildhjerte er blevet kriger og efter en hård vinter med kampe og magel på mad er, er der tilsyeladende fred i skoven. Skyggelkanen afører Blodstjerne er besejret og sneen er begyndt at smelteså alle klaerne nemmere, kan finde bytte. Men smeltevandet for floden til at gå over sine bredderog Ildhjerte og Gråstribe må igen komme en anden klan til hjælp. men Gråstribe er begyndt at ses med Sølvflod fra flod klanen og det er mod krigerloven. Men Ildhjerte ved at tordenklanens næstkomanderende, Tigerklo er en forræder og truer hele klanen, men Blåstjerne tror ham ikke...",
      "created": "2012-08-01T22:00:00.000Z",
      "modified": "2012-08-01T22:00:00.000Z",
      "rating": 5,
      "markedAsDeleted": null,
      "palleid": 16031,
      "id": 13613,
      "reviewownerid": 15279,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29283893",
      "libraryid": "765700",
      "worktype": "literature",
      "content": "så spændene!",
      "created": "2012-07-21T22:00:00.000Z",
      "modified": "2012-07-21T22:00:00.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": 13654,
      "id": 11391,
      "reviewownerid": 16222,
      "likes": [],
      "owner": {}
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/imageCollections/3815/download/small')
    .times(times)

    .reply(200, {
      "container": "uxprod-biblo-imagebucket-small",
      "name": "841a751e0c75-4afb-a197-d9cd056b1cf6_small.png",
      "type": "image/png",
      "url": "https://uxprod-biblo-imagebucket-small.s3-eu-west-1.amazonaws.com/841a751e0c75-4afb-a197-d9cd056b1cf6_small.png",
      "id": 30326,
      "resolutionImageFileId": 30308,
      "resolutionVideoFileId": null
    });

  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=28949847&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=f50945bea34c4d4bb911"],
        "pid": ["870970-basis:28949847"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29333793&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=09621c598b7e68408ec5"],
        "pid": ["870970-basis:29333793"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29283893&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=45f1630cf18b32c4c617"],
        "pid": ["870970-basis:29283893"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29602352&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=5c19353627fb39a762ff"],
        "pid": ["870970-basis:29602352"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29496226&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d581c2a58ba0873bc3fc"],
        "pid": ["870970-basis:29496226"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01:8080', {encodedQueryParams: true})
    .post('/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29024707&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d22448f18035d554a582"],
        "pid": ["870970-basis:29024707"],
        "workType": ["book"]
      }]
    });
};
