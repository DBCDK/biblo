/**
 * @file
 * Testing the ReviewRow component
 */

import React from 'react';
import sd from 'skin-deep';
import {assert} from 'chai';
import sinon from 'sinon';

import ReviewRow from '../ReviewRow.component';

describe('Testing the ReviewRow component', () => {
  const review = {};
  const activeUser = {};
  const likeActions = {};
  const metadata = {};

  // Testing the getTitle method
  it('Title should be Henter data when no metadata is given', () => {
    const tree = sd.shallowRender(
      <ReviewRow review={review} metadata={metadata} activeUser={activeUser} likeActions={likeActions} />);
    const instance = tree.getMountedInstance();

    assert.equal(instance.getTitle(), 'Henter data');
  });

  it('Title should be dcTitle when dcFullTitle is undefined', () => {
    const _metadata = {dcTitle: 'dcTitle'};
    const tree = sd.shallowRender(
      <ReviewRow review={review} metadata={_metadata} activeUser={activeUser} likeActions={likeActions} />);
    const instance = tree.getMountedInstance();

    instance.props.metadata.dcTitle = 'dcTitle';
    assert.equal(instance.getTitle(), 'dcTitle');
  });

  it('Title should be dcTitle - even if dcFullTitle is set', () => {
    const _metadata = {dcTitle: 'dcTitle', dcFullTitle: 'dcFullTitle'};
    const tree = sd.shallowRender(
      <ReviewRow review={review} metadata={_metadata} activeUser={activeUser} likeActions={likeActions} />);
    const instance = tree.getMountedInstance();

    instance.props.metadata.dcTitle = 'dcTitle';
    instance.props.metadata.dcFullTitle = 'dcFullTitle';
    assert.equal(instance.getTitle(), 'dcTitle');
  });

  it('Should set title to dcFullTitle', () => {
    const _metadata = {dcFullTitle: 'dcFullTitle'};
    const tree = sd.shallowRender(
      <ReviewRow review={review} metadata={_metadata} activeUser={activeUser} likeActions={likeActions} />);
    const instance = tree.getMountedInstance();

    assert.equal(instance.getTitle(), 'dcFullTitle');
  });

  // Testing the getCoverUrl method
  it('Should return dummy cover url', () => {
    const tree = sd.shallowRender(
      <ReviewRow review={review} metadata={metadata} activeUser={activeUser} likeActions={likeActions} />);
    const instance = tree.getMountedInstance();

    assert.equal(instance.getCoverUrl(), '/images/covers/other.png');
  });

  it('Should return the given cover url', () => {
    const _metadata = {coverUrl: 'some/cover/path.jpg'};
    const tree = sd.shallowRender(
      <ReviewRow review={review} metadata={_metadata} activeUser={activeUser} likeActions={likeActions} />);
    const instance = tree.getMountedInstance();

    assert.equal(instance.getCoverUrl(), 'some/cover/path.jpg');
  });

  it('Should return the given cover url', () => {
    const _metadata = {coverUrl: 'some/cover/path.jpg', workType: 'book'};
    const tree = sd.shallowRender(
      <ReviewRow review={review} metadata={_metadata} activeUser={activeUser} likeActions={likeActions} />);
    const instance = tree.getMountedInstance();

    assert.equal(instance.getCoverUrl(), 'some/cover/path.jpg');
  });

  it('Should return the URL for material cover when cover URL is missing', () => {
    const _metadata = {workType: 'book'};
    const tree = sd.shallowRender(
      <ReviewRow review={review} metadata={_metadata} activeUser={activeUser} likeActions={likeActions} />);
    const instance = tree.getMountedInstance();

    assert.equal(instance.getCoverUrl(), '/images/covers/book.png');
  });

  // Testing the likeReview method
  it('Should update call likeActions.likeReview and update state', () => {
    const _review = {id: 1};
    const _activeUser = {id: 1};
    const _likeActions = {
      likeReview: () => {
      }
    };

    const spy = sinon.spy(_likeActions, 'likeReview');
    const tree = sd.shallowRender(
      <ReviewRow review={_review} metadata={metadata} activeUser={_activeUser} likeActions={_likeActions} />);
    const instance = tree.getMountedInstance();

    assert.equal(instance.state.likes.length, 0, 'Likes is empty');
    instance.likeReview();
    assert.equal(instance.state.likes.length, 1, 'Likes has one item');
    assert.equal(instance.state.likes[0], _review.id, 'Content of state.likes matches given review');
    assert.isTrue(spy.called, 'likeActions.likeReview was called');
  });

  // Testing the unlikeReview method
  it('Should update call likeActions.unlikeReview and update state', () => {
    const _review = {id: 1, rating: 5};
    const _activeUser = {id: 1};
    const _likeActions = {
      unlikeReview: () => {
      }
    };

    const spy = sinon.spy(_likeActions, 'unlikeReview');
    const tree = sd.shallowRender(
      <ReviewRow review={_review} metadata={metadata} activeUser={_activeUser} likeActions={_likeActions} />);
    const instance = tree.getMountedInstance();
    instance.state.likes = [1];

    assert.equal(instance.state.likes.length, 1, 'Likes is n0t empty');
    instance.unlikeReview();
    assert.equal(instance.state.likes.length, 0, 'Likes has one item');
    assert.isTrue(spy.called, 'likeActions.likeReview was called');
  });

  // Testing the rendered output of the ReviewRow.component
  it('Should render a proper ReviewRow component', () => {
    const _review = {
      content: 'review-test-content'
    };
    const tree = sd.shallowRender(
      <ReviewRow
        review={_review}
        metadata={metadata}
        activeUser={activeUser}
        likeActions={likeActions}
      />);

    const renderedContainer = tree.getRenderOutput();

    assert.equal(renderedContainer.type, 'div');
    assert.equal(renderedContainer.props.className, 'review--container');

    // Assert that the review.content is present in the ree
    const content = tree.dive(['.review--content']).props.dangerouslySetInnerHTML.__html;
    assert.equal(content, _review.content);

    // Assert that the Rating component is present in tree (found by its displayName property)
    const RatingsFunc = () => tree.dive(['Rating.component']);
    assert.doesNotThrow(RatingsFunc, 'Rating component was found in tree');

    // Assert that the SimpleButton component is present in tree
    const SimpleButtonFunc = () => tree.dive(['SimpleButton']);
    assert.doesNotThrow(SimpleButtonFunc, 'SimpleButton component was found in tree');
  });
});
