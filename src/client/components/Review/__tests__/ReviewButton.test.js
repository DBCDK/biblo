/**
 * @file
 * Unittesting methods in ReviewButton.test.js
 */

import React from 'react';
import {mount} from 'enzyme';
import {ReviewButton} from './../ReviewButton';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

import ProfileLibraryInfoModalContainer from './../../Profile/Edit/ProfileLibraryInfoModalContainer.component';

describe('Testing ReviewButton.test.js - not logged in', () => {
  const mockStore = configureStore();

  it('Should replace button with message', () => {
    const initialState = {
      profileReducer: {
        userIsLoggedIn: false,
        favoriteLibrary: {}
      },
      entitySuggestReducer: {
        query: 'test',
        test: []
      }
    };
    const store = mockStore(initialState);
    const clickFunction = jest.fn();

    const wrapper = mount(
      <Provider store={store}><ReviewButton clickFunction={clickFunction} profile={initialState.profileReducer} loginRequired={true} /></Provider>);

    wrapper.find(ReviewButton).simulate('click');
    expect(wrapper.text()).toEqual('Log ind for at skrive en anmeldelse');
  });

  it('It should render a ProfileLibraryInfoModalContainer', () => {
    const initialState = {
      profileReducer: {
        userIsLoggedIn: true,
        favoriteLibrary: {}
      },
      entitySuggestReducer: {
        query: 'test',
        test: []
      }
    };
    const store = mockStore(initialState);
    const clickFunction = jest.fn();
    const wrapper = mount(
      <Provider store={store}><ReviewButton clickFunction={clickFunction} profile={initialState.profileReducer} loginRequired={true} /></Provider>);

    wrapper.find(ReviewButton).simulate('click');
    expect(wrapper.find(ProfileLibraryInfoModalContainer)).toHaveLength(1);
  });

  it('It should invoke clickFunction when favoriteLibrary is set and not render ProfileLibraryInfoModalContainer', () => {
    const initialState = {
      profileReducer: {
        userIsLoggedIn: true,
        favoriteLibrary: {
          libraryId: '123456',
          loanerId: '1234',
          pincode: '0000'
        }
      },
      entitySuggestReducer: {
        query: 'test',
        test: []
      }
    };
    const store = mockStore(initialState);
    const clickFunction = jest.fn();
    const wrapper = mount(
      <Provider store={store}><ReviewButton clickFunction={clickFunction} profile={initialState.profileReducer} loginRequired={true} /></Provider>);

    wrapper.find(ReviewButton).simulate('click');
    expect(wrapper.find(ProfileLibraryInfoModalContainer)).toHaveLength(0);
    expect(clickFunction.mock.calls).toHaveLength(1);
  });
});
