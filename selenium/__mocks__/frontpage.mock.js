// Autogenerated!
const nock = require('nock');
module.exports = function frontpage(times) {
  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/fileContainers/uxdev-biblo-content-frontpage/download/frontpage_content.json')
    .times(times)

    .reply(200, {
      "FrontPageContent": [{
        "widgetName": "FullWidthBannerWidget",
        "widgetConfig": {
          "title": "",
          "description": "",
          "desktopImageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Sommerbogen16_webbanner.png",
          "tabletImageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Sommerbogen16_Tabletbanner.png",
          "mobileImageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Sommerbogen16_Mobilbanner.png",
          "linkUrl": "https://biblo.dk/sommerbogen/altomsommerbogen"
        }
      }, {
        "widgetName": "BestRatedWorksWidget",
        "widgetConfig": {
          "title": "De bedste værker på biblo!",
          "size": 24,
          "age": 800,
          "ratingParameter": 1,
          "countsParameter": 1,
          "worktypes": [],
          "backgroundColor": "#FF00FF",
          "backgroundImageUrl": "http://i.imgur.com/ls2fKsP.jpg",
          "showTitle": true
        }
      }, {
        "widgetName": "LatestReviewsWidget",
        "widgetConfig": {
          "displayTitle": "SENESTE ANMELDELSER",
          "reviewsToLoad": 15,
          "showTitle": true,
          "backgroundColor": "#e2e0f7"
        }
      }, {
        "widgetName": "ContentGridWidget",
        "widgetConfig": {
          "items": [{
            "id": 100,
            "title": "Vi er i gang med at fikse det",
            "text": "Vi har desværre nogle tekniske problemer her på biblo.dk. Det betyder, at det kan være svært at komme til at lave anmeldelser. Hvis du har problemer på siden, er det bedste du kan gøre nok at prøve igen i morgen.",
            "url": "",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/tekniske-problemer.png"
          }, {
            "id": 1,
            "title": "Sommerbogen er i gang!",
            "text": "Læs og anmeld mindst tre bøger inden den 20. august. Så er du med i de mange konkurrencer her på Biblo.dk, hvor du kan vinde en masse gode bøger og en Ipad, hvis du er dygtig og heldig. Læs alt om Sommerbogen her.",
            "url": "https://biblo.dk/sommerbogen/altomsommerbogen",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/AltomSommerbogen_boks_300x160.png"
          }, {
            "id": 2,
            "title": "Sommerbogens skolekonkurrence",
            "text": "Sommerbogen har også en speciel konkurrence for 4., 5. og 6. klasser. I kan vinde bøger og et besøg i klassen af forfatteren Nicole Boyle Rødtnes! Læs alt om Skolekonkurrencen her.",
            "url": "https://biblo.dk/sommerbogen/skolekonkurrence",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Skolekonkurrence_boks_300x160.png"
          }, {
            "id": 4,
            "title": "Har du vundet en præmie?",
            "text": "Se her om du har vundet en præmie i Sommerbogen. Der udtrækkes vindere hver dag helt til den 20. august.",
            "url": "https://biblo.dk/sommerbogen/vindere",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Se+alle+vindere_boks_300x160.png"
          }, {
            "id": 3,
            "title": "Gruppe: Bogklubben",
            "text": "Er du vild med at læse bøger? I denne gruppe kan du dele tips om fantastiske bøger med andre - og selv få gode ideer til oplevelser med bøger.",
            "url": "/grupper/14",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Bogklubben_300x160.png"
          }, {
            "id": 5,
            "title": "Gruppe: Spørg Biblo",
            "text": "Biblos videns-gruppe! Stil spørgsmål om alt og svar gerne selv på det, du kan. Hvad vil du vide mere om?",
            "url": "/grupper/1",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/sporg+biblo_300x160.png"
          }, {
            "id": 6,
            "title": "Gruppe: Minecraft i Palleland",
            "text": "Denne gruppe er til alle jer, der spiller Minecraft, eller gerne vil prøve det. Prøv for eksempel Minecraft-serveren Palleland, hvor der er konkurrencer og meget andet.",
            "url": "/grupper/4",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/kender+du+palleland_300x160.png"
          }, {
            "id": 7,
            "title": "Gruppe: Steam - de bedste spil!",
            "text": "Spiller du spil via Steam på din computer og er du altid på jagt efter de bedste spil? Vær med i spilgruppen og del de spil du synes er de bedste!",
            "url": "/grupper/211",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Steam275x147.png"
          }, {
            "id": 8,
            "title": "Det nye Biblo er åbnet!",
            "text": "Nu kan du låne og anmelde bøger, film og spil her på Biblo.dk. Bare søg øverst på siden og find det du vil låne eller anmelde. Du kan også lægge dine anmeldelser i en gruppe og finde dem på din profil.",
            "url": "/indhold/om-biblo",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Det-ny-biblo.png"
          }, {
            "id": 9,
            "title": "Vi taler pænt til hinanden på Biblo",
            "text": "På Biblo går vi meget op i den gode tone. Hvis du oplever noget, som gør dig ked af det eller vred, så tryk på det lille flag og send en anonym besked til moderatoren.",
            "url": "/indhold/vi-taler-paent-paa-biblo",
            "imageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/vi taler paent_300x160.png"
          }]
        }
      }]
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/')
    .times(times)
    .query({"filter": "{\"limit\":15,\"order\":\"id DESC\",\"include\":[\"likes\",\"image\",{\"relation\":\"video\",\"scope\":{\"include\":[{\"relation\":\"resolutions\",\"scope\":{\"include\":[\"video\"]}}]}},{\"relation\":\"owner\",\"scope\":{\"include\":[\"image\"]}}],\"where\":{\"markedAsDeleted\":null}}"})
    .reply(200, [{
      "pid": "870970-basis:29941513",
      "libraryid": "725900",
      "worktype": "book",
      "content": "Der er en dreng der hedder:Villads. han får gester på besøg. Det er :moster, fætter Noa, og  onkel og familie. Hans fætter har en fjernstyret båd. Villads og Noa vil prøve båden men de må ikke gå ud til søen uden en voksen. Villads vil så gerne prøve båden.\r\nHan gig ud til søen så prøver han båden. Til sidst sad båden fast. Så kommer hans far. Han ser sur ud. Han styrer båden over på den anden side. Det var en rigtig god bog.",
      "created": "2016-07-06T10:36:31.000Z",
      "modified": "2016-07-06T10:36:31.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69369,
      "reviewownerid": 47230,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:51781937",
      "libraryid": "775120",
      "worktype": "book",
      "content": "anne og lise er ude og gå en tur med en baby de ser en hund og en kat. De går ind i gården hvor der er en legeplads. Babyen sover så de kan gynge. de  bliver trætte og skal hjem, men lågen er låst og de kan ikke komme ud, de løfter babyen i barnevognen over lågen og bagefter kan de selv kravle over. så begynder babyen at græde og de vil hurtigt hjem",
      "created": "2016-07-06T10:30:42.000Z",
      "modified": "2016-07-06T10:30:42.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69368,
      "reviewownerid": 36576,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:22647016",
      "libraryid": "775120",
      "worktype": "book",
      "content": "palle holder jul sammen med sin far og de skal ha en and og den er i ovnen i for lang tid den var god",
      "created": "2016-07-06T10:17:54.000Z",
      "modified": "2016-07-06T10:17:54.000Z",
      "rating": 5,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69367,
      "reviewownerid": 36576,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:52009901",
      "libraryid": "779117",
      "worktype": "book",
      "content": "det var en sommer dag.  Otto og Jimmy var ikke hjemme, men på Uranus var turbo toilettet 2000. syntes i skal læse den den er bare rigtig god man kan bare ikke holde op med at læse. syntes jeg. derfor giver jeg den 6 stjerner",
      "created": "2016-07-06T10:17:24.000Z",
      "modified": "2016-07-06T10:17:24.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69366,
      "reviewownerid": 47232,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:52169615",
      "libraryid": "779117",
      "worktype": "book",
      "content": "den er virkelig god. teksten er let at forstå og billederene gør det faktisk os sjovere at læse den.  og det der vend-o-rama er super godt fundet på.  bogen handler om  Otto og Jimmys gymnastik lære. Hr. Nakkeknäcker. som er blevet super intelligent af en stor klump Zygo-gogozziel. Hr. Nakkeknäcker opfinder et serum der kan gøre alle børn i verden til artige små børn, der adlyder alle voksne. så må i selv finde ud af hvad der så sker. kan klart anbefales.   ",
      "created": "2016-07-06T10:13:32.000Z",
      "modified": "2016-07-06T10:13:32.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69365,
      "reviewownerid": 47232,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:51716086",
      "libraryid": "779117",
      "worktype": "book",
      "content": "Maja har to gode vendinder. Eva og Katrine. Eva er tynd og Katrine går op i sundhed. og en gang imellem kommer Katrine til at sige noget om kalorier til Maja så hun bliver lidt ked af det. Maja er selv lidt tyk syntes hun selv. Maja er helt vild med Tristan, så en dag da Tristan spørger om hun vil med til hans fest bliver hun vildt glad. hun siger seleføldig ja til at komme med til fest. så Maja går straks på udkig efter det perfekte fest-tøj. Majas forældre har lovet hende sit eget værelse, som ligger i kælderen. men moren har en gammel veninde ved navn Lisbeth , Lisbeth har rodet sig ud i problemer og det samme har Sylvester. så Sylvester skal have Majas værelse i kælderen, som hun sådan havde glædet sig til at få. Maja hader faktisk Sylvester. resten må i selv læse. kan klart anbefales. den er rigtig god og giver den derfor 5 ud af 6 stjerner    ",
      "created": "2016-07-06T10:02:56.000Z",
      "modified": "2016-07-06T10:02:56.000Z",
      "rating": 5,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69364,
      "reviewownerid": 47232,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:20988118",
      "libraryid": "779100",
      "worktype": "book",
      "content": "pige Liv er en super god bog, den handler om en pige ved navn Liv, på 15 år. Da Liv bliver teenager, får hun bare nok af hendes forældre, særligt hendes mor, som altid skal stikke sin næse i Livs ting. Moren kan aldrig  finde på at give Liv lidt privat liv.  Hendes far som altid skal serviceres af både Liv og hendes mor, og som altid skal snakke om sit åndssvage arbejde. pludselig en dag kommer der store familie problemer, og Liv rejser væk i et stykke tid.",
      "created": "2016-07-06T09:48:16.000Z",
      "modified": "2016-07-06T09:48:16.000Z",
      "rating": 5,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69363,
      "reviewownerid": 47223,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:26281180",
      "libraryid": "725900",
      "worktype": "book",
      "content": "Tors hammer er væk. han har ledt på hele slottet. han kan ikke finde den! Loke låner Frejas fjer-dragt. For så leder han efter hammeren i Udgård. Det er en sjov måde at de får hammeren igen.",
      "created": "2016-07-06T09:48:00.000Z",
      "modified": "2016-07-06T09:48:00.000Z",
      "rating": 5,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69362,
      "reviewownerid": 47230,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:23677466",
      "libraryid": "716900",
      "worktype": "book",
      "content": "Palles far er meget dårlig til at spille golf, hver gang han slår til golf bolden går der noget galt. Men den er meget sjov.",
      "created": "2016-07-06T09:39:43.000Z",
      "modified": "2016-07-06T09:39:43.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69361,
      "reviewownerid": 35571,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:52297788",
      "libraryid": "716900",
      "worktype": "book",
      "content": "Den bog var god. Bogen handler om Palles far der skal hen i Palles klasse for at vise et trylle nummer. Det er lige ved at gå galt, men Palle redder tryllenumre til sidst. Slut ",
      "created": "2016-07-06T09:37:14.000Z",
      "modified": "2016-07-06T09:37:14.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69360,
      "reviewownerid": 35571,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:29276188",
      "libraryid": "774600",
      "worktype": "book",
      "content": "Bogen følger puritanerpigen Beatrice, der lever i et faktions opdelt samfund. Som puritaner skal man være meget uselvisk og hjælpsom, men Beatrice har aldrig følt at hun passede ind. Da hun bliver 16 skal hun vælge den faktion hun vil tilbringe sit liv i, men først bliver hun testet så hun har en ide om hvor hun vil passe bedst ind. Beatrice finder i testen ud af at hun er en Divergent. Hun skjuler det, men da hun vælger skytsengle faktionen er hendes held udløbet. Til hendes held er hun ikke den eneste Divergent hos skytsenglene.\r\nDen første bog om Beatrice/Tris er vildt god. Jeg syntes den var lidt kedelig i starten, men man skal ikke særlig langt før man ikke kan stoppe igen. Den kan klart anbefales, hvis man er vild med Sci-fi. ",
      "created": "2016-07-06T09:30:34.000Z",
      "modified": "2016-07-06T09:30:34.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69359,
      "reviewownerid": 43058,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:07125321",
      "libraryid": "775120",
      "worktype": "book",
      "content": "Lucky Luke er en god tegneserie fordi historierne er spændende. Der er mange historier i tegneserien. Nogle gange ender det sjovt! Dalton-brødrene taler hele tiden grimt 😁 ",
      "created": "2016-07-06T09:26:09.000Z",
      "modified": "2016-07-06T09:26:09.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69358,
      "reviewownerid": 46529,
      "likes": [],
      "image": {
        "id": 5019,
        "profileImageCollection": null,
        "groupCoverImageCollectionId": null,
        "postImageCollection": null,
        "commentImageCollection": null,
        "reviewImageCollection": 69358
      },
      "owner": {}
    }, {
      "pid": "870970-basis:29205000",
      "libraryid": "716700",
      "worktype": "book",
      "content": "Bogen handler om fodboldspilleren ZLATAN.\r\nJeg syntes at bogen er ret god fordi at man lærer noget nyt om ZLATAN.\r\njeg giver bogen 4 ud af 6 stjerner.",
      "created": "2016-07-06T09:16:18.000Z",
      "modified": "2016-07-06T09:16:18.000Z",
      "rating": 4,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69357,
      "reviewownerid": 47228,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:28897723",
      "libraryid": "716700",
      "worktype": "book",
      "content": "Jeg syntes at bogen er god fordi, at den handler om fodbold.\r\nBogen handler om Diegos fodboldhold der vinder en fodboldkamp.\r\nJeg giver bogen 6 ud af 6 stjerner.",
      "created": "2016-07-06T09:13:11.000Z",
      "modified": "2016-07-06T09:13:11.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69356,
      "reviewownerid": 47228,
      "likes": [],
      "owner": {}
    }, {
      "pid": "870970-basis:51265130",
      "libraryid": "714700",
      "worktype": "book",
      "content": "God sommerferie Gyser.\r\nJazz er 17 år og lever en hverdag som USA´s største seriemorders søn. PLudeselig dukker et lig op og Jazz er desperat efter at opklare mordet. \r\n\r\nMorderen efterligner hans far og Jazz har få mistænkte, pludselig dukker morderen op og fanger Jazz, men hans venner hjælper ham og han kommer bag lås og slå,\r\nMen samtidig brød hans far ud og de måtte begynde forfra.\r\nJeg synts bogen er god fordi at man kommer tæt på folks følelser, og kan mærke hvordan de har det og hvor frygteligt det er.\r\nStjerner jeg giver bogen 5 ud af 5\r\nForfatter = Barry Lyga\r\n ",
      "created": "2016-07-06T09:12:48.000Z",
      "modified": "2016-07-06T09:12:48.000Z",
      "rating": 6,
      "markedAsDeleted": null,
      "palleid": null,
      "id": 69355,
      "reviewownerid": 47225,
      "likes": [],
      "owner": {}
    }]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/reviews/count')
    .times(times)
    .query({
      "access_token": "",
      "where": "{\"markedAsDeleted\":null}"
    })
    .reply(200, {"count": 69172});

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Reviews/search')
    .times(times)
    .query({
      "limit": "1",
      "q": "{\"size\":24,\"aggs\":{\"range\":{\"date_range\":{\"field\":\"created\",\"format\":\"MM-yyy\",\"ranges\":[{\"from\":\"now-800d\"}]},\"aggs\":{\"pids\":{\"terms\":{\"field\":\"pid.raw\",\"size\":48},\"aggs\":{\"avg_rate\":{\"avg\":{\"field\":\"rating\"}},\"pid_score\":{\"bucket_script\":{\"buckets_path\":{\"avg_rate\":\"avg_rate\",\"pids\":\"_count\"},\"script\":{\"inline\":\"(log10(pids) * 1) * (avg_rate * 1)\",\"lang\":\"expression\"}}}}}}}}}"
    })
    .reply(200, ["870970-basis:29560749", "870970-basis:22629344", "870970-basis:23672626", "870970-basis:51115155", "870970-basis:28290853", "870970-basis:24695751", "870970-basis:22677780", "870970-basis:29276188", "870970-basis:29570434", "870970-basis:28394438", "870970-basis:3543441", "870970-basis:26326591", "870970-basis:28506392", "870970-basis:25915690", "870970-basis:29570442", "870970-basis:51063376", "870970-basis:28183380", "870970-basis:29677824", "870970-basis:29859698", "870970-basis:50986942", "870970-basis:22995154", "870970-basis:28321597", "870970-basis:51263146", "870970-basis:29500800"]);

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/imageCollections/4681/download/small')
    .times(times)

    .reply(200, {
      "container": "uxprod-biblo-imagebucket-small",
      "name": "42978f9d411c-46e8-b130-45e01c691f96_small.jpg",
      "type": "image/jpeg",
      "url": "https://uxprod-biblo-imagebucket-small.s3-eu-west-1.amazonaws.com/42978f9d411c-46e8-b130-45e01c691f96_small.jpg",
      "id": 37302,
      "resolutionImageFileId": 37284,
      "resolutionVideoFileId": null
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=51781937&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d2a7262d8331df1eed79"],
        "collection": ["870970-basis:51781937"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29205000&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=30f4fe330f74cc724bd7"],
        "collection": ["870970-basis:29205000"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "collection": ["870970-basis:07125321"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=52169615&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=974faa955949f2cc2073"],
        "collection": ["870970-basis:52169615"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=52009901&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=cb0aeddc2d2fb522605e"],
        "collection": ["870970-basis:52009901"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=52297788&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=a91579a9ec915fc7af97"],
        "collection": ["870970-basis:52297788"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=28897723&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=5b3121d66bbc8687e681"],
        "collection": ["870970-basis:28897723"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=26281180&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b554cf39150ea59677c1"],
        "collection": ["870970-basis:26281180"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "collection": ["870970-basis:20988118", "870970-basis:06917070"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=51716086&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=2fbb62aa5528a06f2e52"],
        "collection": ["870970-basis:51716086", "870970-basis:52206243"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "collection": ["870970-basis:22647016", "870970-basis:52184320"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29941513&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=a5fd35444573ea4667ce"],
        "collection": ["870970-basis:29941513", "870970-basis:50730654"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "collection": ["870970-basis:23677466", "870970-basis:52174821"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29276188&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4e6227c48cab916d206a"],
        "collection": ["870970-basis:29276188", "870970-basis:50986942", "870970-basis:51453875"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=51265130&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=c57bf5b24b4b74684aae"],
        "collection": ["870970-basis:51265130", "870970-basis:50738310", "870970-basis:50738329", "870970-basis:51667905"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "dcTitle": ["Harry Potter og fangen fra Azkaban"],
        "collection": ["870970-basis:22995154", "870970-basis:22639862", "870970-basis:29317003", "870970-basis:51980220", "870970-basis:25197879", "870970-basis:26239699", "870970-basis:23227932", "870970-basis:22937758", "870970-basis:22937766", "870970-basis:22937774", "870970-basis:27639151"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22995154&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=f0b411b016a695418730"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Gummi-Tarzan"],
        "collection": ["870970-basis:05025184", "870970-basis:24334562", "870970-basis:28321597", "870970-basis:20557192", "870970-basis:24699285", "870970-basis:26752345", "870970-basis:51742699", "870970-basis:02475804"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=28321597&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=71d1e2e3fd0a0c2def80"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Maze runner - labyrinten"],
        "collection": ["870970-basis:51263146", "870970-basis:51314719", "870970-basis:52159571"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=51263146&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=fa840916b2e5b97967e3"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Hjerteveninder"],
        "collection": ["870970-basis:29500800", "870970-basis:50774643", "870970-basis:50591859", "870970-basis:29890633"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29500800&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=7a00b7abf2b8809ad5d0"],
        "workType": ["book"]
      }]
    });

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "dcTitle": ["En flænge i himlen"],
        "collection": ["870970-basis:51115155", "870970-basis:29560749", "870970-basis:51500776"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29560749&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b4d9884e04dca6baa1e0"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Harry Potter og De Vises Sten"],
        "collection": ["870970-basis:22629344", "870970-basis:51989252", "870970-basis:29317038", "870970-basis:22252852", "870970-basis:51980247", "870970-basis:25194853", "870970-basis:24168638", "870970-basis:23195151", "870970-basis:27638708", "870970-basis:22513354"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22629344&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=46563d4d495af52f9bf2"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Skammerens datter"],
        "collection": ["870970-basis:23672626", "870970-basis:29677824", "870970-basis:24335763", "870970-basis:22758454", "870970-basis:51616324", "870970-basis:28709633", "870970-basis:28709706", "870970-basis:23236850", "870970-basis:27221580"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=23672626&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=f5e7ce9ccdbcaa99bda2"],
        "workType": ["book"]
      }, {
        "dcTitle": ["En flænge i himlen"],
        "collection": ["870970-basis:51115155", "870970-basis:29560749", "870970-basis:51500776"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=51115155&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=2870de6fdc0021ded74b"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Dødsspillet"],
        "collection": ["870970-basis:28290853", "870970-basis:27896634", "870970-basis:51367510"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=28290853&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=66c767a135fc18fe3411"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Kaptajn Underhylers eventyr"],
        "collection": ["870970-basis:24695751"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=24695751&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b08604ae781462b0db4"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Harry Potter og Hemmelighedernes Kammer"],
        "collection": ["870970-basis:22677780", "870970-basis:29316945", "870970-basis:22375733", "870970-basis:51980239", "870970-basis:25197887", "870970-basis:25254031", "870970-basis:23227886", "870970-basis:22864416", "870970-basis:22864459", "870970-basis:22864467", "870970-basis:27639097"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Divergent"],
        "collection": ["870970-basis:29276188", "870970-basis:50986942", "870970-basis:51453875"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29276188&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4e6227c48cab916d206a"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Wimpy Kid"],
        "collection": ["870970-basis:29570434", "870970-basis:29570442", "870970-basis:50618382", "870970-basis:51063376", "870970-basis:51723740", "870970-basis:52430119"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29570434&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=95d715bfe570ddc7207c"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Vildheks"],
        "collection": ["870970-basis:28394438", "870970-basis:28693788", "870970-basis:28898274", "870970-basis:29622469", "870970-basis:50568024", "870970-basis:51362241", "870970-basis:29601151", "870970-basis:51967518", "870970-basis:51453700", "870970-basis:51453492", "870970-basis:51453654", "870970-basis:51650743", "870970-basis:51880897", "870970-basis:52045215"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=28394438&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=afe2cbb7ec1a47f6bc8c"],
        "workType": ["book"]
      }, {}, {
        "dcTitle": ["Lindormen"],
        "collection": ["870970-basis:26326591", "870970-basis:50845397"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Asta og det store flytterod"],
        "collection": ["870970-basis:28506392"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=28506392&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=be71e29ce75bd62ec93c"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Alle elsker Sigge"],
        "collection": ["870970-basis:25915690", "870970-basis:25771923"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=25915690&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=d85264e585e89ce71a57"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Wimpy Kid"],
        "collection": ["870970-basis:29570434", "870970-basis:29570442", "870970-basis:50618382", "870970-basis:51063376", "870970-basis:51723740", "870970-basis:52430119"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29570442&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=2dd5e1b9ca02bee669b5"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Wimpy Kid"],
        "collection": ["870970-basis:29570434", "870970-basis:29570442", "870970-basis:50618382", "870970-basis:51063376", "870970-basis:51723740", "870970-basis:52430119"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=51063376&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=dd595cae144ec5380ab3"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Hvem er hvem?"],
        "collection": ["870970-basis:28183380"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=28183380&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=a17f0a3c8eb2b48a86da"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Skammerens datter"],
        "collection": ["870970-basis:23672626", "870970-basis:29677824", "870970-basis:24335763", "870970-basis:22758454", "870970-basis:51616324", "870970-basis:28709633", "870970-basis:28709706", "870970-basis:23236850", "870970-basis:27221580"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29677824&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=8a1ccd6752381319ff16"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Elverskud - skæbnedans"],
        "collection": ["870970-basis:29859698", "870970-basis:52078164"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=29859698&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=e783523038a9c100f5ec"],
        "workType": ["book"]
      }, {
        "dcTitle": ["Divergent"],
        "collection": ["870970-basis:29276188", "870970-basis:50986942", "870970-basis:51453875"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=50986942&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=af21e024e5bfbd086076"],
        "workType": ["book"]
      }]
    });

  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Reviews/search')
    .times(times)
    .query({
      "limit": "1",
      "q": "{\"size\":1,\"aggs\":{\"range\":{\"date_range\":{\"field\":\"created\",\"format\":\"MM-yyy\",\"ranges\":[{\"from\":\"now-365d\"}]},\"aggs\":{\"pids\":{\"terms\":{\"field\":\"pid.raw\",\"size\":2},\"aggs\":{\"avg_rate\":{\"avg\":{\"field\":\"rating\"}},\"pid_score\":{\"bucket_script\":{\"buckets_path\":{\"avg_rate\":\"avg_rate\",\"pids\":\"_count\"},\"script\":{\"inline\":\"(log10(pids) * 1) * (avg_rate * 1)\",\"lang\":\"expression\"}}}}}}}}}"
    })
    .reply(200, ["870970-basis:22629344"]);
};
