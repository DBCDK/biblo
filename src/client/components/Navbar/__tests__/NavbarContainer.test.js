/**
 * @file
 */

import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {assert} from 'chai';

import NavbarContainer from '../NavbarContainer.component.js';

describe('Test NavbarContainer Component', () => {

  it('Assert className navbar--container', () => {
    const render = TestUtils.createRenderer();
    render.render(<NavbarContainer />);

    const rendered = render.getRenderOutput();

    const result = rendered.props.className;
    const expected = 'navbar';
    assert.equal(result, expected, 'Found className navbar');
  });

  it('Assert hide unhide menu', (done) => {
    const searchState = {
      isSearchBoxVisible: false,
      groupSearchResults: [],
      groupSearchResultsPending: true,
      materialSearchResults: [],
      materialSearchResultsPending: true,
      workSuggestions: {},
      workSuggestionsPending: false,
      selectedWorkSuggestion: -1,
      initialQuery: '',
      query: '',
      isLoadingResults: false
    };

    let dom = TestUtils.renderIntoDocument(<NavbarContainer searchState={searchState} />);
    let menuButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'navbar--toggle');
    let menu = TestUtils.findRenderedDOMComponentWithClass(dom, 'menu');

    assert.isFalse(menu.classList.contains('is-active'), 'menu is not active');
    TestUtils.Simulate.click(menuButton);
    setTimeout(() => {
      assert.isTrue(menu.classList.contains('is-active'), 'menu is active');
      assert.isTrue(menuButton.classList.contains('is-active'), 'menu button is active');
      TestUtils.Simulate.click(menuButton);
      setTimeout(() => {
        assert.isFalse(menu.classList.contains('is-active'), 'menu is not active');
        assert.isFalse(menuButton.classList.contains('is-active'), 'menu button is not active');
        done();
      });
    }, 0);
  });

  it('Assert hide unhide profile dropdown', (done) => {
    const searchState = {
      isSearchBoxVisible: false,
      groupSearchResults: [],
      groupSearchResultsPending: true,
      materialSearchResults: [],
      materialSearchResultsPending: true,
      workSuggestions: {},
      workSuggestionsPending: false,
      selectedWorkSuggestion: -1,
      initialQuery: '',
      query: '',
      isLoadingResults: false
    };

    let dom = TestUtils.renderIntoDocument(<NavbarContainer searchState={searchState} searchActions={{toggleSearchBox: () => {}}} />);
    let menuButton = TestUtils.scryRenderedDOMComponentsWithClass(dom, 'navbar--profile')[0];
    let toggleButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'navbar--toggle');

    assert.isFalse(toggleButton.classList.contains('is-active'), 'menu is not active');
    done();

    console.log(menuButton);

    TestUtils.Simulate.click(menuButton);
    setTimeout(() => {
      assert.isTrue(toggleButton.classList.contains('is-active'), 'menu is active');
      assert.isTrue(toggleButton.classList.contains('is-active'), 'menu close button is active');
      TestUtils.Simulate.click(toggleButton);
      setTimeout(() => {
        assert.isFalse(toggleButton.classList.contains('is-active'), 'menu is not active');
        done();
      });
    });

  });

  it('Assert click overlay', (done) => {
    const searchState = {
      isSearchBoxVisible: false,
      groupSearchResults: [],
      groupSearchResultsPending: true,
      materialSearchResults: [],
      materialSearchResultsPending: true,
      workSuggestions: {},
      workSuggestionsPending: false,
      selectedWorkSuggestion: -1,
      initialQuery: '',
      query: '',
      isLoadingResults: false
    };

    let dom = TestUtils.renderIntoDocument(<NavbarContainer searchState={searchState} />);
    let menuButton = TestUtils.findRenderedDOMComponentWithClass(dom, 'navbar--toggle');
    let menu = TestUtils.findRenderedDOMComponentWithClass(dom, 'menu');
    let clickOverlay = TestUtils.findRenderedDOMComponentWithClass(dom, 'click-overlay');

    TestUtils.Simulate.click(menuButton);
    setTimeout(() => {
      assert.isTrue(menu.classList.contains('is-active'), 'menu is active');
      assert.isTrue(menuButton.classList.contains('is-active'), 'menu button is active');
      assert.isTrue(clickOverlay.classList.contains('is-active'), 'clickOverlay is active');
      TestUtils.Simulate.click(clickOverlay);
      setTimeout(() => {
        assert.isFalse(menu.classList.contains('is-active'), 'menu is not active');
        assert.isFalse(menuButton.classList.contains('is-active'), 'menu button is not active');
        assert.isFalse(clickOverlay.classList.contains('is-active'), 'clickOverlay is not active');
        done();
      });
    });
  });
});
