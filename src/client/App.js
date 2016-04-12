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

export function wrapComponentInProvider(Comp) { // eslint-disable-line react/display-name
  const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
  const store = createStoreWithMiddleware(rootReducer);

  return (
    <Provider store={store}>
      <Comp />
    </Provider>
  );
}

export function renderComponent(Comp, target) {
  ReactDOM.render(
    wrapComponentInProvider(Comp),
    document.getElementById(target)
  );
}
