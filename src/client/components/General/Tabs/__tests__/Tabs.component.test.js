/**
 * @file Testing the Tabs component
 */

import React from 'react';
import sd from 'skin-deep';
import {assert} from 'chai';
import Tabs from '../Tabs.component.js';

import {isEmpty} from 'lodash';

describe('Testing the Tabs component', () => {
  it('Should render empty tabs container', () => {
    const tree = sd.shallowRender(<Tabs />);
    const expectedMarkup = '<div class="tabs-container"></div>';

    assert.isTrue(isEmpty(tree.text()), 'tabs container is empty');
    assert.isFalse(tree.subTree('.tabs'), 'No tabs was found');
    assert.equal(tree.props.className, 'tabs-container', 'tabs-container class was found');
    assert.equal(tree.toString(), expectedMarkup, 'Expected markup was rendered');
  });

  it('Should render on tab', () => {
    const tabs = [
      {
        label: 'test',
        content: 'TestHest'
      }
    ];
    const tree = sd.shallowRender(<Tabs tabs={tabs} />);

    assert.equal(tree.subTree('.tabs').props.children.length, tabs.length, 'Found equal number of rendered tabs as given as props');
    assert.isFalse(isEmpty(tree.text()), 'tabs container is not empty');
    assert.equal(tree.props.className, 'tabs-container', 'tabs-container class was found');
  });

  it('Default selection Should be 0', () => {
    const tree = sd.shallowRender(<Tabs />);
    assert.equal(tree.getMountedInstance().state.selected, 0, 'Default selcted is 0 when props.selected is undefined');
  });

  it('Should override default seleceted when passed as prop', () => {
    const selected = 10;
    const tree = sd.shallowRender(<Tabs selected={selected} />);
    assert.equal(tree.getMountedInstance().props.selected, selected, `Default selcted is ${selected}`);
  });

  it('Should set state.selected appropriately', () => {
    const tree = sd.shallowRender(<Tabs />);
    const instance = tree.getMountedInstance();

    assert.equal(instance.state.selected, 0, 'default selected is 0');
    instance.onClicked(1);
    assert.equal(instance.state.selected, 1, 'after invoking onClicked method state.selected is 1');
  });

  it('Should set state.selected appropriately when clicked', () => {
    const tabs = [
      {
        label: 'tab_1',
        content: 'Tab1Content'
      },
      {
        label: 'tab_2',
        content: 'Tab2Content'
      }
    ];
    const tree = sd.shallowRender(<Tabs tabs={tabs} />);
    const instance = tree.getMountedInstance();
    assert.equal(instance.state.selected, 0, 'default selected is 0');

    tree.everySubTree('.tab')[1].props.children[1].props.onClick(); // click the second tab
    assert.equal(instance.state.selected, 1, 'after invoking onClicked state.selected is 1');
  });

  it('Should not display a notification count', () => {
    const tabs = [
      {
        label: 'tab_1',
        content: 'Tab1Content'
      }
    ];
    const tree = sd.shallowRender(<Tabs tabs={tabs} />);

    assert.isFalse(tree.everySubTree('.tab')[0].props.children[0]);
  });

  it('Should not display a notification count', () => {
    const tabs = [
      {
        label: 'tab_1',
        content: 'Tab1Content',
        counter: null
      }
    ];
    const tree = sd.shallowRender(<Tabs tabs={tabs} />);

    assert.isFalse(tree.everySubTree('.tab')[0].props.children[0]);
  });

  it('Should display a notification count', () => {
    const count = 10;
    const tabs = [
      {
        label: 'tab_1',
        content: 'Tab1Content',
        counter: count
      }
    ];
    const tree = sd.shallowRender(<Tabs tabs={tabs} />);

    assert.isNotFalse(tree.everySubTree('.tab')[0].props.children[0]);
    assert.equal(tree.everySubTree('.tab')[0].props.children[0].props.children, count);
  });
});
