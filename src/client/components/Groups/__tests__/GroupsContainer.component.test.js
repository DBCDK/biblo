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
  it('should render Opret button and Nyeste grupper', () => {

    const data = {
      groups: [
      ],
      groupsLimit: 15
    };

    const actions = {
      asyncShowGroups: () => {
      }
    };

    const comp = TestUtils.renderIntoDocument(<GroupsContainer data={data} actions={actions}/>);
    expect(ReactDOM.findDOMNode(comp).children[1].children[1].textContent)
     .toEqual('Opret ny gruppeNyeste grupper'); //Expect group listing title to be "Nyeste grupper"

  });

});
