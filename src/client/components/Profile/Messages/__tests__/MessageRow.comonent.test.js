import React from 'react';
import sd from 'skin-deep';
import {assert} from 'chai';
import sinon from 'sinon';

import MessageRow from '../MessageRow.component';

describe('Testing the MessageRow Component', () => {
  const agencies = {};
  const agencyActions = {};
  const message = {
    read: false
  };

  const noop = () => {
  };
  const readAction = () => {
  };

  it('Should render unread message', () => {
    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={message}
        readAction={readAction}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const rendered = tree.getRenderOutput();

    assert.equal(rendered.props.children.props.className, 'message-row--container unread ');
  });

  it('Should render read message', () => {
    const _message = Object.assign({}, message);
    _message.read = true;

    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={_message}
        readAction={readAction}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const rendered = tree.getRenderOutput();

    assert.equal(rendered.props.children.props.className, 'message-row--container ');
  });

  it('Should invoke props.readAction in onVisibilityChanged when given true as parameter', () => {
    const spy = sinon.spy();
    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={message}
        readAction={spy}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const instance = tree.getMountedInstance();

    assert.isFalse(spy.called, 'The callback have not yet been invoked');

    instance.onVisibilityChanged(true);

    assert.isTrue(spy.called, 'The callback was invoked');
  });

  it('Should not invoke props.readAction in onVisibilityChanged when given false as parameter', () => {
    const spy = sinon.spy();
    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={message}
        readAction={spy}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const instance = tree.getMountedInstance();

    assert.isFalse(spy.called, 'The callback have not yet been invoked');

    instance.onVisibilityChanged(false);

    assert.isFalse(spy.called, 'The callback have not been invoked');
  });
});

describe('Testing the getMessageImage method', () => {
  const agencies = {};
  const agencyActions = {};
  const message = {
    read: false
  };

  const noop = () => {
  };
  const readAction = () => {
  };

  it('Should return default image', () => {
    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={message}
        readAction={readAction}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const instance = tree.getMountedInstance();

    const imgUrl = instance.getMessageImage();
    const expected = '/images/covers/other.png';

    assert.equal(imgUrl, expected);
  });

  it('Should return image matching type-orderExpiresSoon', () => {
    const _message = Object.assign({}, message);
    _message.type = 'type-orderExpiresSoon';

    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={_message}
        readAction={readAction}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const instance = tree.getMountedInstance();

    const imgUrl = instance.getMessageImage();
    const expected = '/images/messages/default-afleveres.png';

    assert.equal(imgUrl.props.src, expected);
  });

  it('Should return image matching type-orderIsReady', () => {
    const _message = Object.assign({}, message);
    _message.type = 'type-orderIsReady';

    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={_message}
        readAction={readAction}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const instance = tree.getMountedInstance();

    const imgUrl = instance.getMessageImage();
    const expected = '/images/messages/default-afhentes.png';

    assert.equal(imgUrl.props.src, expected);
  });

  it('Should return image matching type Fine', () => {
    const _message = Object.assign({}, message);
    _message.type = 'Fine';

    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={_message}
        readAction={readAction}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const instance = tree.getMountedInstance();

    const imgUrl = instance.getMessageImage();
    const expected = '/images/messages/default-boede.png';

    assert.equal(imgUrl.props.src, expected);
  });

  it('Should return image matching type Fine', () => {
    const _message = Object.assign({}, message);
    _message.type = 'Reservation Charge';

    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={_message}
        readAction={readAction}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const instance = tree.getMountedInstance();

    const imgUrl = instance.getMessageImage();
    const expected = '/images/messages/default-boede.png';

    assert.equal(imgUrl.props.src, expected);
  });

  it('Should return image matching type Fine', () => {
    const _message = Object.assign({}, message);
    _message.type = 'type-commentWasAdded';

    const tree = sd.shallowRender(
      <MessageRow
        agencies={agencies}
        agencyActions={agencyActions}
        message={_message}
        readAction={readAction}
        groupActions={{}}
        groupState={{}}
        deleteAction={noop}
      />
    );
    const instance = tree.getMountedInstance();

    const imgUrl = instance.getMessageImage();
    const expected = '/no_profile.png';

    assert.equal(imgUrl.props.children.props.src, expected);
    assert.equal(imgUrl.props.className, 'profileimage');
  });
});
