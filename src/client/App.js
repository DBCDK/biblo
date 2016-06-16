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

/**
 * Wraps a component in a provider with the store, and all middlewares.
 * @param {React.Component} Comp
 * @param {PlainObject} initialState
 * @returns {{store: Object, component: XML}}
 */
export function wrapComponentInProvider(Comp, initialState = {}) { // eslint-disable-line react/display-name
  const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
  const component = (
    <Provider store={store}>
      <Comp />
    </Provider>
  );

  return {
    state: store.getState(),
    component
  };
}

/**
 * Renders a component wrapped in a provider with the stores.
 * @param {React.Component} Comp - The react component you want to render.
 * @param {String} target - The html id of the target you want to render into.
 */
export function renderComponent(Comp, target) {
  let initialState = {};
  if (typeof window !== 'undefined') {
    let jsonData = document.getElementById('initialState');
    if (jsonData && jsonData.innerHTML && jsonData.innerHTML.length > 0) {
      initialState = JSON.parse(jsonData.innerHTML);
    }
  }

  ReactDOM.render(
    wrapComponentInProvider(Comp, initialState).component,
    document.getElementById(target)
  );
}
