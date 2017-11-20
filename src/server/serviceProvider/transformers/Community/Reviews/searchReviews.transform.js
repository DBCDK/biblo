import parseReview from '../../../parsers/review.parser';
import workParser from '../../../parsers/work.parser';
import {_} from 'lodash';

const SearchReviewsTransform = {
  event() {
    return 'searchReviews';
  },

  requestTransform(event, {elasticQuery}) {
    // eslint-disable-line no-unused-vars
    return new Promise((resolve, reject) => {
      Promise.all([
        this.callServiceClient('community', 'searchReviews', elasticQuery),
        this.callServiceClient('cached/standard/community', 'getReviewCampaigns')
      ])
        .then(response => {
          const responseParsed = JSON.parse(response[0].body);
          const total = responseParsed.hits.total;
          const reviews = responseParsed.hits.hits;
          const campaigns = response[1];
          const pids = _.uniq(reviews.map(review => review._source.pid));

          Promise.all(
            pids.map(pid =>
              this.callServiceClient('cached/standard/openplatform', 'work', {
                pids: [pid],
                fields: ['coverUrlThumbnail', 'dcTitle', 'dcTitleFull', 'pid', 'workType']
              })
            )
          )
            .then(workResponses => {
              const works = workResponses.map(workResponse => JSON.parse(workResponse.body).data[0]);
              resolve([reviews, campaigns, works, total]);
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  responseTransform(response) {
    const result = [];
    let reviews = response[0];
    const campaigns = response[1];
    const works = response[2].map(workParser);
    const total = response[3];
    const pidToWork = {};
    works.forEach(work => {
      pidToWork[work.pid] = work;
    });

    reviews =
      reviews.map(review => {
        const r = {
          pid: review._source.pid,
          libraryid: review._source.libraryid,
          worktype: review._source.worktype,
          content: review._source.content,
          created: review._source.created,
          modified: review._source.modified,
          rating: review._source.rating,
          markedAsDeleted: review._source.markedAsDeleted,
          palleid: review._source.palleid,
          id: review._source.id,
          reviewownerid: review._source.reviewownerid,
          owner: review._source.owner,
          likes: review._source.likes,
          image: review._source.image,
          video: review._source.video
        };
        return parseReview(r, campaigns, 150);
      }) || [];

    reviews.forEach(review => {
      if (pidToWork[review.pid]) {
        result.push({
          review: review,
          work: pidToWork[review.pid]
        });
      }
    });

    return {
      status: 200,
      data: result,
      total,
      errors: []
    };
  }
};

export default SearchReviewsTransform;
