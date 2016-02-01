'use strict';

/**
 * @file: Entrypoint for all JS
 * Export a function which renders react component in store context.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './Reducers/root.reducer';

export default function renderComponent(Comp, target) {
  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
  const store = createStoreWithMiddleware(rootReducer);

  ReactDOM.render(
    <Provider store={store}>
      <Comp />
    </Provider>,
    document.getElementById(target)
  );
}
