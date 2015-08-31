'use strict';

import React from 'react';
import Reflux from 'reflux';

// Components
import AutoCompleteContainer from '../autocomplete/AutocompleteContainer.component.js';
import {TokenSearchField} from 'dbc-react-components';

// Actions
import LibrarySuggestAction from '../../actions/LibrarySuggest.action.js';
import QueryActions from '../../actions/QueryUpdate.action.js';
import InputFieldActions from '../../actions/InputField.actions.js';

// Stores
import QueryStore from '../../stores/QueryStore.store.js';
import InputFieldStore from '../../stores/InputField.store.js';
import LibrarySuggestStore from '../../stores/LibrarySuggest.store.js';

const LibrarySuggestComponent = React.createClass({
  displayName: 'LibrarySuggest.component',

  propTypes: {},

  mixins: [
    Reflux.connect(LibrarySuggestStore, 'suggest'),
    Reflux.connect(InputFieldStore, 'input'),
    Reflux.connect(QueryStore, 'query')
  ],

  render() {
    let query = [];

    return (
      <div className='searchfield' >
        <TokenSearchField
          change={InputFieldActions.change}
          focus={InputFieldActions.focus}
          pending={this.state.suggest.pending}
          placeholder='Søg efter bibliotek'
          query={query}
          update={QueryActions.update}
          />
        <AutoCompleteContainer actions={LibrarySuggestAction} input={this.state.input} store={this.state.suggest} />
      </div>
    );
  }
});

export default LibrarySuggestComponent;
