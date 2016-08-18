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

    const comp = TestUtils.renderIntoDocument(
      <GroupList
        title={'test-title'}
        groups={data.groups}
      />
    );

    expect(ReactDOM.findDOMNode(comp).textContent)
      .toEqual('test-titleheste test1 følger'); // we currently expect followers count on screen
  });
});
