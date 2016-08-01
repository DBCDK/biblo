// Autogenerated!
/* eslint-disable */
const nock = require('nock');
module.exports = function aboutpage(times) {
  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/fileContainers/uxdev-biblo-content-article/download/om-biblo%2Fsettings.json')
    .times(times)
    .reply(200, {
      "title": "Om Biblo",
      "mainContent": "<div><h2>Om Biblo</h2><h3>Biblo er et online fællesskab for børn</h3><p>Her kan børn under 14 år dele interesser med hinanden i online &aring;bne grupper. Grupperne kan handle om alt, og de kan oprettes b&aring;de af b&oslash;rn og bibliotekarer. Hver gruppe handler om noget specielt, som man diskuterer i den gruppe. Vil man diskutere noget andet, kan man enten finde en gruppe, der passer bedre, lave sin egen gruppe eller sp&oslash;rge i gruppen &quot;Sp&oslash;rg Biblo&quot;.</p><p>Alle, der har et Unilogin kan se, skrive, uploade og deltage i konkurrencer p&aring; Biblo.</p><p>Man kan også l&aring;ne b&oslash;ger, film og spil p&aring; Biblo - lige som man kan p&aring; sit bibliotek.</p><p>Biblo er skabt og k&oslash;res af de danske folkebiblioteker.</p><p>Biblo overv&aring;ges af voksne bibliotekarer.</p><h3>Biblo kan bruges både i skolen og i fritiden - med sikkerhed</h3><p>Mange b&oslash;rn vil bruge Biblo b&aring;de b&aring;de i og uden for skoletiden. Man kan deltage i konkurrencer, der ofte laves i et samarbejde mellem skoler og det lokale bibliotek. For eksempel er &quot;Sommerbogen&quot; Danmarks st&oslash;rste l&aelig;se-konkurrence med omkring 4.000 deltagere hver sommer.</p><p>Biblo bliver overv&aring;get og modereret af bibliotekarer, og b&oslash;rnene vil altid kunne komme i kontakt med en voksen. Desuden kr&aelig;ver Biblo.dk et UNILogin fra alle, der vil oprette sig som bruger.</p><p>Se hvordan man kontakter Biblo under &quot;Kontakt&quot; herunder.</p></div>",
      "headerImageUrl": "https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-article/om-biblo/header.jpg"
    });
};
