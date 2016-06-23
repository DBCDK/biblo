
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
      }),
      this.callServiceClient('community', 'groupSuggest', {q})
    ]);
  },

  responseTransform(response, {q}) {
    const total = 6;

    const workSuggestions = JSON.parse(response[1].body);
    const creatorSuggestions = JSON.parse(response[0].body);
    const groupSuggestions = JSON.parse(response[2].body);

    let suggestResponse = {
      data: [],
      errors: [],
      q: q
    };

    let index = 0;
    while (suggestResponse.data.length < total && index < total) {
      if (workSuggestions.data && workSuggestions.data.length > index) {
        const suggestion = workSuggestions.data[index];
        suggestResponse.data.push({str: suggestion.term, type: 'work', typeIndex: 1});
      }

      // disable author suggest until the service is able to handle biblo.
      if (creatorSuggestions.data && creatorSuggestions.data.length > index && false) { // eslint-disable-line no-constant-condition
        const suggestion = creatorSuggestions.data[index];
        suggestResponse.data.push({str: suggestion.term, type: 'creator', typeIndex: 2});
      }

      if (groupSuggestions.options && groupSuggestions.options.length > index) {
        const suggestion = groupSuggestions.options[index];
        suggestResponse.data.push({str: suggestion.text, type: 'group', typeIndex: 3});
      }

      index += 1;
    }

    suggestResponse.data = suggestResponse.data.slice(0, total).map(suggestion => {
      suggestion.str = suggestion.str.replace('Ꜳ', 'Aa').replace('ꜳ', 'aa');
      suggestion.href = `/find?q=${encodeURIComponent(suggestion.str)}`;
      return suggestion;
    });

    suggestResponse.data.sort((a, b) => {
      return a.typeIndex - b.typeIndex;
    });

    return suggestResponse;
  }
};

export default SuggestTransform;
