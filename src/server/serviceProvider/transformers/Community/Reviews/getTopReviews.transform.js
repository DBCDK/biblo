/**
 * @file: This file contains a transform to get the top reviews and populate them with briefdisplay and coverImage.
 */
import workParser from '../../../parsers/work.parser';

const getTopReviewsTransform = {

  event() {
    return 'getTopReviews';
  },

  requestTransform(event, {size, age, ratingParameter, countsParameter, worktypes, offset}) {
    // Get the top works from the community service.
    let more = false;
    return this.callServiceClient('cached/standard/community', 'topWorksFromReviews', {
      size: offset || size,
      age,
      ratingParameter,
      countsParameter,
      worktypes
    }).then((topWorksResponse) => {
      // Validate the response
      if (topWorksResponse.statusCode >= 400) {
        return Promise.reject(`Unexpected statuscode in getTopReviews: ${topWorksResponse.statusCode}`);
      }

      // Parse out the response from the community service.
      let works = JSON.parse(topWorksResponse.body);

      // Worktypes specified, we need to sort manually.
      if (worktypes && worktypes.length > 0) {
        const aggs = works.aggregations;
        works = [];

        aggs.worktypes.buckets.forEach(bucket => {
          bucket.range.buckets.forEach(buck => {
            if (!Array.isArray(buck.pids.buckets)) {
              return Promise.reject('Unexpected response in getTopReviews!');
            }

            works = works.concat(buck.pids.buckets);
          });
        });

        works = works.sort((a, b) => b.pid_score.value - a.pid_score.value).map(pid => pid.key).slice(0, offset || size);
      }

      // Validate the response
      if (!Array.isArray(works)) {
        return Promise.reject('Unexpected response in getTopReviews!');
      }

      if (works.length === (offset || size)) {
        more = true;
      }

      // Split the pids into bucket of 20, the maximum openplatform supports
      const pidBuckets = [];
      works.forEach((pid, idx) => {
        if (idx === 0 || idx % 20 === 0) {
          pidBuckets.push([]);
        }

        pidBuckets[pidBuckets.length - 1].push(pid);
      });

      // Send the requests in parrallel
      return Promise.all(pidBuckets.map(pids => this.callServiceClient('cached/standard/openplatform', 'work', {
        pids: pids,
        fields: [
          'dcTitle',
          'collection',
          'coverUrlFull',
          'workType'
        ]
      })));
    }).then(works => {
      return {
        works: works,
        more: more
      };
    }).catch(e => {
      if (e.message) {
        return e.message;
      }

      return e;
    });
  },

  responseTransform(response) {
    let data = [];
    const errors = [];

    try {
      let seenPids = [];

      // Create an array containing unique works by filtering out seen pids.
      data = [].concat.apply([], response.works
        .map(res => JSON.parse(res.body).data))
        .filter(el => {
          const seen = el.collection && (el.collection).filter(pid => seenPids.indexOf(pid) >= 0).length === 0;
          seenPids = seenPids.concat(el.collection);
          return seen;
        });

      data = data.map(workParser);

    }
    catch (err) {
      // Handle errors kinda nicely.
      errors.push(err.message ? err.message : err);
    }

    // send off the response.
    return {
      statusCode: response.statusCode,
      data: data,
      more: response.more,
      errors: errors
    };
  }
};

export default getTopReviewsTransform;
