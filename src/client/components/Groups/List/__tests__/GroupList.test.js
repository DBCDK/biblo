'use strict';

import React from 'react';
import TestUtils from 'react-addons-test-utils';

import GroupList from '../GroupList.component';

describe('Test of GroupList', () => {

  it('Should render', () => {

    var data = {
      groups: [
        {id: 1, name: 'heste test', membersCount: 1}
      ],
      groupsLimit: 15
    };

    TestUtils.renderIntoDocument(<GroupList groups={data.groups}/>);
  });
});
