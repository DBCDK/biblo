import React from 'react';
import sd from 'skin-deep';
import {assert} from 'chai';

import MessageContainer from '../MessagesContainer.component';

describe('Testing the MessageContainer.component', () => {
  const noop = () => {
  };
  const emptyObj = {};
  it('Should increase state.limit by 15', () => {
    const tree = sd.shallowRender(
      <MessageContainer
        messages={[]}
        agencies={emptyObj}
        agencyActions={emptyObj}
        readAction={noop}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );

    const instance = tree.getMountedInstance();

    assert.equal(instance.state.limit, 15);
    instance.onClickShowMore();
    assert.equal(instance.state.limit, 30);
  });
});
