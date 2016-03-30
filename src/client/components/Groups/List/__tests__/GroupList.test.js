'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import GroupList from '../GroupList.component';
import expect from 'expect';


describe('Test of GroupList', () => {

  it('Should render followers count on screen', () => {
    const data = {
      groups: [
        {id: 1, name: 'heste test', membersCount: 1}
      ],
      groupsLimit: 15
    };

    const comp = TestUtils.renderIntoDocument(<GroupList groups={data.groups}/>);
    expect(ReactDOM.findDOMNode(comp).textContent)
      .toEqual('heste test 1 følger '); // we currently expect followers count on screen
  });
});
