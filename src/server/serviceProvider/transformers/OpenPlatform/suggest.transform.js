
const SuggestTransform = {

  event() {
    return 'suggest';
  },

  requestTransform(event, {q}, connection) { // eslint-disable-line no-unused-vars
    return Promise.all([
      this.callServiceClient('openplatform', 'suggest', {
        q: q,
        type: 'creator',
        limit: 3
      }),
      this.callServiceClient('openplatform', 'suggest', {
        q: q,
        type: 'title',
        limit: 3
      })
    ]);
  },

  responseTransform(response, q, connection) { // eslint-disable-line no-unused-vars
    let suggestions = JSON.parse(response[1].body);
    suggestions.q = q.q;
    suggestions.data = suggestions.data.concat(
      JSON.parse(response[0].body).data
    ).map((suggestion) => {
      if (suggestion.id) {
        suggestion.href = `/vaerk/${encodeURIComponent(suggestion.id)}`;
      }
      else {
        suggestion.href = `/search?q=${encodeURIComponent(suggestion.str)}`;
      }

      return suggestion;
    });

    return suggestions;
  }
};

export default SuggestTransform;
