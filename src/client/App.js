/**
 * @file: Entrypoint for all JS
 * Export a function which renders react component in store context.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import SocketClient from 'dbc-node-serviceprovider-socketclient';
import {callServiceProvider} from './Constants/action.constants';

import rootReducer from './Reducers/root.reducer';

const reduxLogger = createLogger({
  predicate: (getState, action) => false, // eslint-disable-line
  collapsed: (getState, action, logEntry) => true // eslint-disable-line
});

/**
 * Service Provider middleware for redux, use this to call the service provider from a plain action.
 * Once the response is received, it will dispatch a new action with the event name + 'Response'.
 *
 * It expects a request of the following format:
 * {type: 'callServiceProvider', data: {*}, event: {String}}
 *
 * And returns the following:
 * {type: {String}, data: {*}}
 *
 * @param dispatch
 * @param getState
 * @returns {function(): function()}
 */
export function serviceProviderReduxMiddleware({dispatch}) {
  // This object contains our existing clients to prevent listener overflows.
  let clients = {};

  return next => action => {
    // First we check that the action type is correct
    if (action.type === callServiceProvider) {

      // We then extract the request data or query from the action
      const requestData = action.data || {};

      // We ensure the action has the required properties.
      if (!action.event) {
        throw new Error('Cannot call service provider without an event.');
      }

      // And also ensure reuse of socketclients to prevent excess listeners.
      if (!clients[action.event]) {
        clients[action.event] = SocketClient(action.event);
        clients[action.event].response(function (data) {
          dispatch({type: `${action.event}Response`, data});
        });
      }

      // And finally we dispatch the request.
      clients[action.event].request(requestData);
    }

    return next(action);
  };
}

/**
 * Wraps a component in a provider with the store, and all middlewares.
 * @param {React.Component} Comp
 * @param {PlainObject} initialState
 * @returns {{store: Object, component: XML}}
 */
export function wrapComponentInProvider(Comp, initialState = {}) { // eslint-disable-line react/display-name
  const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(thunk, serviceProviderReduxMiddleware, reduxLogger)));
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
      let prepareState = JSON.parse(jsonData.innerHTML);
      // Delete initialState.profileReducer and initiate it from JSONDATA_USER_PROFILE.json in profile.reducer.js, if JSONDATA_USER_PROFILE.json exists
      let jsonUserData = document.getElementById('JSONDATA_USER_PROFILE');
      if (jsonUserData && jsonUserData.innerHTML && jsonUserData.innerHTML.length > 0) {
        delete prepareState.profileReducer;
      }
      initialState = prepareState;
    }
  }

  ReactDOM.hydrate(
    wrapComponentInProvider(Comp, initialState).component,
    document.getElementById(target)
  );
}
