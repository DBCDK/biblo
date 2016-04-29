
const SuggestTransform = {

  event() {
    return 'suggest';
  },

  requestTransform(event, {q}, connection) { // eslint-disable-line no-unused-vars
    return Promise.all([
      this.callServiceClient('openplatform', 'suggest', {
        q: q,
        type: 'creator',
        limit: 6
      }),
      this.callServiceClient('openplatform', 'suggest', {
        q: q,
        type: 'title',
        limit: 6
      })
    ]);
  },

  responseTransform(response, q, connection) { // eslint-disable-line no-unused-vars
    let workSuggestions = JSON.parse(response[1].body);
    let creatorSuggestions = JSON.parse(response[0].body);

    let creatorTake = 3;
    let workTake = 3;

    workSuggestions.q = q.q;

    if (workSuggestions.data.length < 3) {
      creatorTake = 6 - workSuggestions.data.length;
    }

    if (creatorSuggestions.data.length < 3) {
      workTake = 6 - creatorSuggestions.data.length;
    }

    workSuggestions.data = workSuggestions.data.slice(0, workTake);
    creatorSuggestions.data = creatorSuggestions.data.slice(0, creatorTake);

    workSuggestions.data = workSuggestions.data.concat(creatorSuggestions.data).map((suggestion) => {
      if (suggestion.id) {
        suggestion.href = `/vaerk/${encodeURIComponent(suggestion.id)}`;
      }
      else {
        suggestion.href = `/find?q=${encodeURIComponent(`term.creator="${suggestion.str}"`)}`;
      }

      return suggestion;
    });

    return workSuggestions;
  }
};

export default SuggestTransform;
