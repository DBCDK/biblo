'use strict';

/**
 * @file: Tests for groups container.
 */

import expect from 'expect';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {GroupsContainer} from '../GroupsContainer.component';


describe('GroupsContainer component tests', () => {
  it('should test groups container can render', () => {

    var groups = [
      {id: 1, name: 'heste test', membersCount: 1}
    ];

    const comp = TestUtils.renderIntoDocument(<GroupsContainer groups={groups}/>);

    expect(ReactDOM.findDOMNode(comp).children[1].children[1].textContent).toEqual('Velkommen til grupper!heste test 1 følger ');

  });
});
