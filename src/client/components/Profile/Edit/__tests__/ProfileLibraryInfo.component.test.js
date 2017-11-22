/**
 * @file
 * Unittesting methods in ProfileLibraryInfo.component.js
 */

import React from 'react';
import {assert} from 'chai';
import sinon from 'sinon';
import {mount, shallow} from 'enzyme';

import {ProfileLibraryInfo} from '../ProfileLibraryInfo.component';

describe('Unittesting methods in ProfileLibraryInfo.component.js', () => {
  const noop = () => {
  };
  const emptyObj = {};

  /**
   * @var {ProfileLibraryInfo}
   */
  let instance;
  let component;
  let searchElements = [];

  beforeEach(() => {
    component = shallow(
      <ProfileLibraryInfo
        favoriteLibrary={emptyObj}
        unselectLibraryFunction={noop}
        searchAction={noop}
        libraryId={''}
        loanerIdChangeFunc={noop}
        pincodeChangeFunc={noop}
        searchElements={searchElements}
      />
    );

    instance = component.instance();
  });

  afterEach(() => {
    component = Object.create(null);
    instance = Object.create(null);
    searchElements = []; // eslint-disable-line
  });

  it('Should set state.visible to false', () => {
    instance.state.visible = true;
    assert.isTrue(instance.state.visible);
    instance.escapeKeyPressed();
    assert.isFalse(instance.state.visible);
  });

  it('Should set state.visible to false', () => {
    const nextProps = {
      searchElements: ['a', 'b', 'c']
    };

    assert.isFalse(instance.state.visible);
    instance.componentWillReceiveProps(nextProps);
    assert.isTrue(instance.state.visible);
  });

  it('Should call arrowKeyPressed with true', () => {
    const sandbox = sinon.sandbox.create();
    const spy = sandbox.spy(instance, 'arrowKeyPressed');

    assert.isFalse(spy.called);
    instance.onKeyDownHandler({key: 'ArrowUp'});

    assert.isTrue(spy.called);
    assert.isTrue(spy.args[0][0]);
    sandbox.restore();
  });

  it('Should call arrowKeyPressed with false', () => {
    const sandbox = sinon.sandbox.create();
    const spy = sandbox.spy(instance, 'arrowKeyPressed');

    assert.isFalse(spy.called);
    instance.onKeyDownHandler({key: 'ArrowDown'});

    assert.isTrue(spy.called);
    assert.isFalse(spy.args[0][0]);
    sandbox.restore();
  });

  it('Should call escapeKeyPressed', () => {
    const sandbox = sinon.sandbox.create();
    const spy = sandbox.spy(instance, 'escapeKeyPressed');

    assert.isFalse(spy.called);
    instance.onKeyDownHandler({key: 'Escape'});

    assert.isTrue(spy.called);
    sandbox.restore();
  });

  it('Should call elements clickFunc', (done) => {
    // Manipulate props to contain some searchElements
    instance.props.searchElements.push({
      clickFunc: () => {
        done();
      }
    });

    const event = {
      key: 'Enter',
      preventDefault: () => {
      }
    };

    instance.state.selected = 0;
    instance.onKeyDownHandler(event);
  });

  it('Should set state.selected to 0', () => {
    // Manipulate props to contain some searchElements
    instance.props.searchElements.push('a');
    instance.props.searchElements.push('b');

    assert.equal(instance.state.selected, -1);
    instance.arrowKeyPressed(false);
    assert.equal(instance.state.selected, 0);
  });

  it('Should set state.selected to 0', () => {
    // Manipulate props to contain some searchElements
    instance.props.searchElements.push('a');
    instance.props.searchElements.push('b');

    instance.state.selected = 1;

    instance.arrowKeyPressed(true);
    assert.equal(instance.state.selected, 0);
  });

  it('Should toggle loanerId password field', () => {
    const wrapper = mount(<ProfileLibraryInfo
      favoriteLibrary={emptyObj}
      unselectLibraryFunction={noop}
      searchAction={noop}
      libraryId={''}
      loanerIdChangeFunc={noop}
      pincodeChangeFunc={noop}
      searchElements={searchElements}
    />);

    assert.equal('password', wrapper.find({name: 'loanerId'}).first().prop('type'));
    wrapper.find({type: 'checkbox'}).simulate('click');
    assert.equal('number', wrapper.find({name: 'loanerId'}).first().prop('type'));
    wrapper.find({type: 'checkbox'}).simulate('click');
    assert.equal('password', wrapper.find({name: 'loanerId'}).first().prop('type'));
  });

  it('Should toggle loanerId password field', () => {
    const wrapper = mount(<ProfileLibraryInfo
      favoriteLibrary={{loanerId: '1234123412', pincode: '1234'}}
      unselectLibraryFunction={noop}
      searchAction={noop}
      libraryId={'DK-1234'}
      loanerIdChangeFunc={noop}
      pincodeChangeFunc={noop}
      searchElements={searchElements}
    />);

    assert.equal('1234123412', wrapper.find({name: 'loanerId'}).first().prop('defaultValue'));
    assert.equal('1234', wrapper.find({name: 'pincode'}).first().prop('defaultValue'));
    assert.equal('DK-1234', wrapper.find({name: 'libraryId'}).first().prop('value'));
  });
});
