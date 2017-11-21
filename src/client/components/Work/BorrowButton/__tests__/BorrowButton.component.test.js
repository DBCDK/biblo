/**
 * @file: Unittests of BorrowButton component.
 */

// Libs
import React from 'react';
import {mount} from 'enzyme';
import {expect} from 'chai';

// Import components
import BorrowButton from '../BorrowButton.component';

// Get data
import krigerkattene from './krigerkattene.mock.js';

describe('Test Borrow Button (in work detail)', () => {
  it('should render borrow options when presented with an online material regardless of user status (Logged in or not)', () => {
    const noop = () => {};
    const collectionDetails = krigerkattene;

    const component = (
      <BorrowButton
        buttonTitle="Lån på eReolen"
        modalButtonTitle="Gå til eReolen"
        buttonIcon={null}
        itemDescription="Katten Ildpote"
        collectionDetails={collectionDetails}
        coverUrl="http://i.imgur.com/l99Rjc8.jpg"
        title="collectionDetails"
        type="online"
        orderMaterialAction={noop}
        saveProfileAction={noop}
        unselectLibraryFunction={noop}
        searchForLibraryAction={noop}
        librarySearchResults={[]}
        checkAvailabilityAction={noop}
        resetOrderState={noop}
        getWorkOnlineAccessAction={noop}
      />
    );

    const expected = 'Lydbog (net) (bind 4)';

    const wrapper = mount(component);
    wrapper.find('.borrow--button').simulate('click');
    const innerHtml = wrapper.find('.modal-window--borrow--types').first().text();

    expect(innerHtml).to.include(expected);
  });
});
