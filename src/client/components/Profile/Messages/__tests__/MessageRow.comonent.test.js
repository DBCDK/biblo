import React from 'react';
import sd from 'skin-deep';
import {assert} from 'chai';

import MessageRow from '../MessageRow.component';

describe('Testing the MessageRow Component', () => {
  const agencies = {};
  const agencyActions = {};
  const message = {
    read: false
  };

  it('Should render unread message', () => {
    const tree = sd.shallowRender(<MessageRow agencies={agencies} agencyActions={agencyActions} message={message} />);
    const rendered = tree.getRenderOutput();

    assert.equal(rendered.props.className, 'message-row--container unread');
  });

  it('Should render read message', () => {
    const _message = Object.assign({}, message);
    _message.read = true;

    const tree = sd.shallowRender(<MessageRow agencies={agencies} agencyActions={agencyActions} message={_message} />);
    const rendered = tree.getRenderOutput();

    assert.equal(rendered.props.className, 'message-row--container');
  });
});
