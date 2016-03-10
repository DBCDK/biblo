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

    var data = {
      groups: [
        {id: 1, name: 'heste test', membersCount: 1}
      ],
      groupsLimit: 15
    };

    var actions = {
      asyncShowGroups: function () {
      }
    };

    const comp = TestUtils.renderIntoDocument(<GroupsContainer data={data} actions={actions}/>);
    expect(ReactDOM.findDOMNode(comp).children[1].children[1].textContent)
      .toEqual('Opret ny gruppeNyeste grupper heste test '); // we currently do not expect followers count on screen

  });
});
