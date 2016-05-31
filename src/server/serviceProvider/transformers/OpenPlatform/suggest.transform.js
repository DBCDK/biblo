
const SuggestTransform = {

  event() {
    return 'suggest';
  },

  requestTransform(event, {q}) {
    return Promise.all([
      this.callServiceClient('openplatform', 'suggest', {
        q: q,
        type: 'creator',
        limit: 6
      }),
      this.callServiceClient('openplatform', 'suggest', {
        q: q,
        type: 'title',
        limit: 6,
        fields: ['term', 'pid']
      })
    ]);
  },

  responseTransform(response, {q}) {
    let workSuggestions = JSON.parse(response[1].body);
    let creatorSuggestions = JSON.parse(response[0].body);

    let creatorTake = 3;
    let workTake = 3;

    workSuggestions.q = q;

    if (workSuggestions.data.length < 3) {
      creatorTake = 6 - workSuggestions.data.length;
    }

    if (creatorSuggestions.data.length < 3) {
      workTake = 6 - creatorSuggestions.data.length;
    }

    workSuggestions.data = workSuggestions.data.slice(0, workTake);
    creatorSuggestions.data = creatorSuggestions.data.slice(0, creatorTake);

    workSuggestions.data = workSuggestions.data.concat(creatorSuggestions.data).map((suggestion) => {
      suggestion.str = suggestion.term.replace('Ꜳ', 'Aa').replace('ꜳ', 'aa');
      if (suggestion.pid) {
        suggestion.href = `/materiale/${encodeURIComponent(suggestion.pid)}`;
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
