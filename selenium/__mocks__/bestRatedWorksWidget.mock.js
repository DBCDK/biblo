// Autogenerated!
const nock = require('nock');
module.exports = function bestRatedWorksWidget(times) {
  nock('http://localhost:3000', {encodedQueryParams: true})
    .get('/api/Reviews/search')
    .times(times)
    .query({
      "limit": "1",
      "q": "{\"size\":1,\"aggs\":{\"range\":{\"date_range\":{\"field\":\"created\",\"format\":\"MM-yyy\",\"ranges\":[{\"from\":\"now-365d\"}]},\"aggs\":{\"pids\":{\"terms\":{\"field\":\"pid.raw\",\"size\":2},\"aggs\":{\"avg_rate\":{\"avg\":{\"field\":\"rating\"}},\"pid_score\":{\"bucket_script\":{\"buckets_path\":{\"avg_rate\":\"avg_rate\",\"pids\":\"_count\"},\"script\":{\"inline\":\"(log10(pids) * 1) * (avg_rate * 1)\",\"lang\":\"expression\"}}}}}}}}}"
    })
    .reply(200, ["870970-basis:25915690"]);

  nock('http://platform-i01.dbc.dk:8080', {encodedQueryParams: true})
    .post('/v1/work/')
    .times(times)

    .reply(200, {
      "statusCode": 200,
      "data": [{
        "dcTitle": ["Alle elsker Sigge"],
        "collection": ["870970-basis:25915690", "870970-basis:25771923"],
        "coverUrlFull": ["//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=25915690&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=77a9ec5ddc586613a5ea"],
        "workType": ["book"]
      }]
    });
};