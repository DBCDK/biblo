/**
 * @file: This file contains a transform to get the top reviews and populate them with briefdisplay and coverImage.
 */

const getTopReviewsTransform = {

  event() {
    return 'getTopReviews';
  },

  requestTransform(event, {size, age, ratingParameter, countsParameter, worktypes}) {
    // Get the top works from the community service.
    return this.callServiceClient('community', 'topWorksFromReviews', {
      size,
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
      const works = JSON.parse(topWorksResponse.body);

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
    let errors = [];

    try {
      let seenPids = [];

      // Create an array containing unique works by filtering out seen pids.
      data = [].concat.apply([], response
        .map(res => JSON.parse(res.body).data))
        .filter(el => {
          const seen = el.collection.filter(pid => seenPids.indexOf(pid) >= 0).length === 0;
          seenPids = seenPids.concat(el.collection);
          return seen;
        });
    }
    catch (err) {
      // Handle errors kinda nicely.
      errors.push(err);
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
