// Autogenerated!
const nock = require('nock'); module.exports = function frontpage () {
nock('http://localhost:3000', {"encodedQueryParams":true})
  .get('/api/fileContainers/uxdev-biblo-content-frontpage/download/frontpage_content.json')
  .reply(200, {"FrontPageContent":[{"widgetName":"FullWidthBannerWidget","widgetConfig":{"title":"","description":"","desktopImageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Sommerbogen16_webbanner.png","tabletImageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Sommerbogen16_Tabletbanner.png","mobileImageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Sommerbogen16_Mobilbanner.png","linkUrl":"https://biblo.dk/sommerbogen/altomsommerbogen"}},{"widgetName":"LatestReviewsWidget","widgetConfig":{"displayTitle":"SENESTE ANMELDELSER","reviewsToLoad":15}},{"widgetName":"ContentGridWidget","widgetConfig":{"items":[{"id":100,"title":"Vi er i gang med at fikse det","text":"Vi har desværre nogle tekniske problemer her på biblo.dk. Det betyder, at det kan være svært at komme til at lave anmeldelser. Hvis du har problemer på siden, er det bedste du kan gøre nok at prøve igen i morgen.","url":"","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/tekniske-problemer.png"},{"id":1,"title":"Sommerbogen er i gang!","text":"Læs og anmeld mindst tre bøger inden den 20. august. Så er du med i de mange konkurrencer her på Biblo.dk, hvor du kan vinde en masse gode bøger og en Ipad, hvis du er dygtig og heldig. Læs alt om Sommerbogen her.","url":"https://biblo.dk/sommerbogen/altomsommerbogen","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/AltomSommerbogen_boks_300x160.png"},{"id":2,"title":"Sommerbogens skolekonkurrence","text":"Sommerbogen har også en speciel konkurrence for 4., 5. og 6. klasser. I kan vinde bøger og et besøg i klassen af forfatteren Nicole Boyle Rødtnes! Læs alt om Skolekonkurrencen her.","url":"https://biblo.dk/sommerbogen/skolekonkurrence","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Skolekonkurrence_boks_300x160.png"},{"id":4,"title":"Har du vundet en præmie?","text":"Se her om du har vundet en præmie i Sommerbogen. Der udtrækkes vindere hver dag helt til den 20. august.","url":"https://biblo.dk/sommerbogen/vindere","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Se+alle+vindere_boks_300x160.png"},{"id":3,"title":"Gruppe: Bogklubben","text":"Er du vild med at læse bøger? I denne gruppe kan du dele tips om fantastiske bøger med andre - og selv få gode ideer til oplevelser med bøger.","url":"/grupper/14","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Bogklubben_300x160.png"},{"id":5,"title":"Gruppe: Spørg Biblo","text":"Biblos videns-gruppe! Stil spørgsmål om alt og svar gerne selv på det, du kan. Hvad vil du vide mere om?","url":"/grupper/1","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/sporg+biblo_300x160.png"},{"id":6,"title":"Gruppe: Minecraft i Palleland","text":"Denne gruppe er til alle jer, der spiller Minecraft, eller gerne vil prøve det. Prøv for eksempel Minecraft-serveren Palleland, hvor der er konkurrencer og meget andet.","url":"/grupper/4","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/kender+du+palleland_300x160.png"},{"id":7,"title":"Gruppe: Steam - de bedste spil!","text":"Spiller du spil via Steam på din computer og er du altid på jagt efter de bedste spil? Vær med i spilgruppen og del de spil du synes er de bedste!","url":"/grupper/211","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Steam275x147.png"},{"id":8,"title":"Det nye Biblo er åbnet!","text":"Nu kan du låne og anmelde bøger, film og spil her på Biblo.dk. Bare søg øverst på siden og find det du vil låne eller anmelde. Du kan også lægge dine anmeldelser i en gruppe og finde dem på din profil.","url":"/indhold/om-biblo","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/Det-ny-biblo.png"},{"id":9,"title":"Vi taler pænt til hinanden på Biblo","text":"På Biblo går vi meget op i den gode tone. Hvis du oplever noget, som gør dig ked af det eller vred, så tryk på det lille flag og send en anonym besked til moderatoren.","url":"/indhold/vi-taler-paent-paa-biblo","imageUrl":"https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-frontpage/images/vi taler paent_300x160.png"}]}}]}, { 'x-powered-by': 'Express',
  vary: 'Origin',
  'access-control-allow-credentials': 'true',
  'content-type': 'application/json',
  date: 'Thu, 23 Jun 2016 11:41:13 GMT',
  connection: 'close',
  'transfer-encoding': 'chunked' });
  
nock('http://localhost:3000', {"encodedQueryParams":true})
  .get('/api/reviews/count')
  .query({"access_token":"","where":"%7B%22markedAsDeleted%22:null%7D"})
  .reply(200, {"count":1}, { 'x-powered-by': 'Express',
  vary: 'Origin',
  'access-control-allow-credentials': 'true',
  'content-type': 'application/json; charset=utf-8',
  'content-length': '11',
  etag: 'W/"b-CxuxFwe2mm4IC62zgWSn6Q"',
  date: 'Thu, 23 Jun 2016 11:41:15 GMT',
  connection: 'close' });
  
nock('http://localhost:3000', {"encodedQueryParams":true})
  .get('/api/reviews/')
  .query({"filter":"%7B%22limit%22:15,%22order%22:%22id%20DESC%22,%22include%22:[%22likes%22,%22image%22,%7B%22relation%22:%22video%22,%22scope%22:%7B%22include%22:[%7B%22relation%22:%22resolutions%22,%22scope%22:%7B%22include%22:[%22video%22]%7D%7D]%7D%7D,%7B%22relation%22:%22owner%22,%22scope%22:%7B%22include%22:[%22image%22]%7D%7D],%22where%22:%7B%22markedAsDeleted%22:null%7D%7D"})
  .reply(200, [{"pid":"870970-basis:07058063","libraryid":"714700","worktype":"book","content":"Meget relevant læsning for børn i alle aldre!","created":"2016-06-21T11:30:08.000Z","modified":"2016-06-21T11:30:08.000Z","rating":4,"markedAsDeleted":null,"palleid":null,"id":2,"reviewownerid":39188,"likes":[],"owner":{"username":"jona341k","displayName":"Hyatt03","favoriteLibrary":{"libraryId":"714700","pincode":"4799","loanerId":"0312950677"},"description":"Jeg er medskaber af biblo.dk","email":"hyatt03@gmail.com","phone":"00","created":null,"lastUpdated":"2016-06-09T00:00:00.000Z","hasFilledInProfile":true,"birthday":"1995-12-03T00:00:00.000Z","fullName":"Jonas Peter Hyatt","palleid":47719,"id":39188,"image":{"id":57,"profileImageCollection":39188,"groupCoverImageCollectionId":null,"postImageCollection":null,"commentImageCollection":null,"reviewImageCollection":null}}}], { 'x-powered-by': 'Express',
  vary: 'Origin',
  'access-control-allow-credentials': 'true',
  'content-type': 'application/json; charset=utf-8',
  'content-length': '868',
  etag: 'W/"364-7sXGZUa+ecQ73SU/yh4UDw"',
  date: 'Thu, 23 Jun 2016 11:41:15 GMT',
  connection: 'close' });
  
nock('http://localhost:3000', {"encodedQueryParams":true})
  .get('/api/imageCollections/57/download/small')
  .reply(200, {"container":"uxdev-biblo-imagebucket-small","name":"2d79400a9c20-4bc9-86ba-9661f38bbffb_small.jpg","type":"image/jpeg","url":"https://uxdev-biblo-imagebucket-small.s3-eu-west-1.amazonaws.com/2d79400a9c20-4bc9-86ba-9661f38bbffb_small.jpg","id":470,"resolutionImageFileId":453,"resolutionVideoFileId":null}, { 'x-powered-by': 'Express',
  vary: 'Origin',
  'access-control-allow-credentials': 'true',
  'content-type': 'application/json; charset=utf-8',
  'content-length': '305',
  etag: 'W/"131-W18z5SAXjJ5y963rN2s9Fw"',
  date: 'Thu, 23 Jun 2016 11:41:15 GMT',
  connection: 'close' });
};