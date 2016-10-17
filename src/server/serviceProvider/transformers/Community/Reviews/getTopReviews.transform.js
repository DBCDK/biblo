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
    if (offset > 0) {
      offset += 1;
    }

    return this.callServiceClient('community', 'topWorksFromReviews', {
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
      if (worktypes.length > 0) {
        const aggs = works.aggregations;
        works = [];

        aggs.worktypes.buckets.forEach(bucket => {
          bucket.range.buckets.forEach(buck => {
            if (!Array.isArray(buck.pids.buckets)) {
              return Promise.reject('Unexpected response in getTopReviews!');
            }

            works = buck.pids.buckets.sort((a, b) => b.pid_score.value - a.pid_score.value).map(pid => pid.key);
          });
        });
      }

      // Validate the response
      if (!Array.isArray(works)) {
        return Promise.reject('Unexpected response in getTopReviews!');
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
      return Promise.all(pidBuckets.map(pids => this.callServiceClient('openplatform', 'work', {
        pids: pids,
        fields: [
          'dcTitle',
          'collection',
          'coverUrlFull',
          'workType'
        ]
      })));
    });
  },

  responseTransform(response) {
    let data = [];
    const errors = [];

    try {
      let seenPids = [];

      // Create an array containing unique works by filtering out seen pids.
      data = [].concat.apply([], response
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
      errors: errors
    };
  }
};

export default getTopReviewsTransform;
