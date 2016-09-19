import React from 'react';
import sd from 'skin-deep';
import {assert} from 'chai';
import sinon from 'sinon';

import RenewLoanButton from '../RenewLoanButton.component';

describe('Testing the RenewLoanButton Component', () => {
  const noop = () => {
  };

  it('Should display an error message', () => {
    const newUserstatusState = {
      renewLoan: {
        loanid: {
          error: true
        }
      },
      userStatus: {}
    };

    const tree = sd.shallowRender(
      <RenewLoanButton
        loanId={'loanid'}
        materialTitle={'title'}
        renewLoanAction={noop}
        userstatusState={newUserstatusState}
        messageCreatedEpoch={0}
      />
    );

    const inst = tree.getMountedInstance();
    inst.componentWillReceiveProps({userstatusState: newUserstatusState});

    const rendered = tree.getRenderOutput();

    const displayName = rendered.props.children[0].type.displayName;
    const expectedDisplayName = 'RoundedButton.a.component';
    assert.equal(displayName, expectedDisplayName);
    assert.equal(rendered.props.children[1].props.children, 'Der skete en fejl. Prøv igen.');
  });

  it('Should return loan based on props.loanId', () => {
    const userstatusResponse = {
      loans: [
        {
          loanId: 'loanid'
        },
        {
          loanId: 'another-loanid'
        }
      ]
    };

    const tree = sd.shallowRender(
      <RenewLoanButton
        loanId={'loanid'}
        materialTitle={'title'}
        renewLoanAction={noop}
        userstatusState={{}}
        messageCreatedEpoch={0}
      />
    );

    const instance = tree.getMountedInstance();
    const result = instance.getLoan(userstatusResponse);

    assert.isObject(result);
    assert.equal(result.loanId, 'loanid');
  });

  it('Should return null userstatus.loans is undefined', () => {
    const userstatusResponse = {};

    const tree = sd.shallowRender(
      <RenewLoanButton
        loanId={'loanid'}
        materialTitle={'title'}
        renewLoanAction={noop}
        userstatusState={{}}
        messageCreatedEpoch={0}
      />
    );

    const instance = tree.getMountedInstance();
    const result = instance.getLoan(userstatusResponse);

    assert.isNull(result);
  });

  it('Should return null userstatus.loans is not an array', () => {
    const userstatusResponse = {
      loans: 42
    };

    const tree = sd.shallowRender(
      <RenewLoanButton
        loanId={'loanid'}
        materialTitle={'title'}
        renewLoanAction={noop}
        userstatusState={{}}
        messageCreatedEpoch={0}
      />
    );

    const instance = tree.getMountedInstance();
    const result = instance.getLoan(userstatusResponse);

    assert.isNull(result);
  });

  it('Should return null userstatus.loans is an empty array', () => {
    const userstatusResponse = {
      loans: 42
    };

    const tree = sd.shallowRender(
      <RenewLoanButton
        loanId={'loanid'}
        materialTitle={'title'}
        renewLoanAction={noop}
        userstatusState={{}}
        messageCreatedEpoch={0}
      />
    );

    const instance = tree.getMountedInstance();
    const result = instance.getLoan(userstatusResponse);

    assert.isNull(result);
  });

  it('Should not invoke renewLoanAction when state.pending is true', () => {
    const renewLoanAction = () => {};
    const sandbox = sinon.sandbox.create();
    const spy = sandbox.spy(renewLoanAction);
    const tree = sd.shallowRender(
      <RenewLoanButton
        loanId={'loanid'}
        materialTitle={'title'}
        renewLoanAction={renewLoanAction}
        userstatusState={{}}
        messageCreatedEpoch={0}
      />
    );

    const event = {
      preventDefault: () => {}
    };

    const instance = tree.getMountedInstance();
    instance.state.pending = true;
    instance.handleClick(event);
    assert.isFalse(spy.called);
    sandbox.restore();
  });

  it('Should display message upon successful renewal', () => {
    const materialTitle = 'material-title';
    const tree = sd.shallowRender(
      <RenewLoanButton
        loanId={'loanid'}
        materialTitle={materialTitle}
        renewLoanAction={() => {}}
        userstatusState={{}}
        messageCreatedEpoch={0}
      />
    );

    const instance = tree.getMountedInstance();
    instance.state.success = true;

    const rendered = instance.render();
    assert.equal(rendered.props.className, 'renew-loan-button--msg--success');
    assert.equal(rendered.props.children[0], 'Du har lånt ');
    assert.equal(rendered.props.children[1], materialTitle);
    assert.equal(rendered.props.children[2], ' igen. ');
  });
});
