/**
 * @file
 * Unittesting the MoreInfo.comopenent.js
 */

import React from 'react';
import {assert} from 'chai';
import sd from 'skin-deep';

import {MoreInfo} from '../MoreInfo.component';

describe('Unittesting the MoreInfo.comopenent', () => {
  it('Should return null (getMoreInfoRow)', () => {
    const tree = sd.shallowRender(<MoreInfo />);
    const instance = tree.getMountedInstance();

    const result = instance.getMoreInfoRow('type', null, 'key');
    assert.isNull(result);
  });

  it('Should return element (getMoreInfoRow)', () => {
    const tree = sd.shallowRender(<MoreInfo />);
    const instance = tree.getMountedInstance();
    const type = 'type';
    const content = 'content';

    const result = instance.getMoreInfoRow('type', 'content', 'key');

    assert.equal(result.props.className, 'more-info--row');
    const children = result.props.children;

    assert.lengthOf(children, 2);

    assert.equal(children[0].props.className, 'more-info--type');
    assert.equal(children[0].props.children, type);

    assert.equal(children[1].props.className, 'more-info--content');
    assert.equal(children[1].props.children, content);
  });

  it('Should return null (getSubjects)', () => {
    const tree = sd.shallowRender(<MoreInfo />);
    const instance = tree.getMountedInstance();

    const result = instance.getSubjects();
    assert.isNull(result);
  });

  it('Should return list of rendered subjects (getSubjects)', () => {
    const tags = ['a', 'b', 'c'];
    const tree = sd.shallowRender(<MoreInfo tags={tags} />);
    const instance = tree.getMountedInstance();

    const result = instance.getSubjects();

    assert.isArray(result);
    assert.lengthOf(result, tags.length);

    assert.equal(result[0].props.href, '/find?emneord=a');
    assert.equal(result[1].props.href, '/find?emneord=b');
    assert.equal(result[2].props.href, '/find?emneord=c');
  });

  it('Should return null (getGenericList)', () => {
    const tree = sd.shallowRender(<MoreInfo />);
    const instance = tree.getMountedInstance();

    const result = instance.getGenericList('year');
    assert.isNull(result);
  });

  it('Should return list of rendered elements (getGenericList)', () => {
    const year = [2001, 1970];
    const tree = sd.shallowRender(<MoreInfo year={year} />);
    const instance = tree.getMountedInstance();

    const result = instance.getGenericList('year');

    assert.equal(result[0].props.children[0], year[0]);
    assert.equal(result[1].props.children[0], year[1]);
  });
});
