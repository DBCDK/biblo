/**
 * @file Testing the Tabs component
 */

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
    const tree = sd.shallowRender(<Tabs tabs={tabs}/>);

    assert.equal(tree.subTree('.tabs').props.children.length, tabs.length, 'Found equal number of rendered tabs as given as props');
    assert.isFalse(isEmpty(tree.text()), 'tabs container is not empty');
    assert.equal(tree.props.className, 'tabs-container', 'tabs-container class was found');
  });

  it('Default selection should be 0', () => {
    const tree = sd.shallowRender(<Tabs />);
    assert.equal(tree.getMountedInstance().props.selected, 0, 'Default selcted is 0');
  });

  it('Should override default seleceted when passed as prop', () => {
    const selected = 10;
    const tree = sd.shallowRender(<Tabs selected={selected}/>);
    assert.equal(tree.getMountedInstance().props.selected, selected, `Default selcted is ${selected}`);
  });
});
