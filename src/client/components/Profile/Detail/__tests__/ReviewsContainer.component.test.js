/**
 * @file testing the ReviewContainer component
 */

// Libraries
import React from 'react';
import sd from 'skin-deep';
import {assert} from 'chai';
import sinon from 'sinon';

// Components
import ReviewsContainer from '../ReviewsContainer.component';

// Mocks
import {reviewsMockJSON as reviewsMock} from './reviews.mock';

describe('Testing the ReviewContainer component', () => {
  const emptyReviews = [];
  const emptyWorksMetadata = {};
  const emptyObject = {};
  const user = {};
  const noop = () => {
  };

  it('Should render empty div container', () => {
    const expectedHTML = '<div class="reviews-container-component"><div class="reviews-container-component--reviews"></div></div>';
    const tree = sd.shallowRender(
      <ReviewsContainer
        reviews={emptyReviews}
        user={user}
        activeUser={user}
        likeActions={emptyObject}
        getWorksAction={noop}
        worksMetadata={emptyWorksMetadata}
      />
    );

    assert.equal(tree.toString(), expectedHTML, 'Found expected HTML');
  });

  it('Should render reviews', () => {
    let count = 0;

    // getWorksAction mock method
    const getWorksAction = (pids) => {
      count = pids.length;
    };

    const tree = sd.shallowRender(
      <ReviewsContainer
        reviews={reviewsMock}
        user={user}
        activeUser={user}
        likeActions={emptyObject}
        getWorksAction={getWorksAction}
        worksMetadata={emptyWorksMetadata}
      />
    );

    const instance = tree.getMountedInstance();
    const spy = sinon.spy(instance, 'requestMetadata');
    assert.isFalse(spy.called, 'Component haven\'t rendered yet so requestMetadata should not have been called yet');

    // render reviews
    const rendered = instance.renderReviewRows();

    assert.isArray(rendered, 'Got array of pids');
    assert.equal(rendered.length, reviewsMock.length, `${reviewsMock.length} reviews was rendered`);
    assert.isTrue(spy.called, 'After first render requestMetadata should have benn called');
    assert.equal(count, instance.state.limit + 10, `Got a request containing ${instance.state.limit + 10} pids`);

    spy.restore();
  });

  it('Should render 10 reviews in the container component', () => {
    const tree = sd.shallowRender(
      <ReviewsContainer
        reviews={reviewsMock}
        user={user}
        activeUser={user}
        likeActions={emptyObject}
        getWorksAction={noop}
        worksMetadata={emptyWorksMetadata}
      />
    );

    const instance = tree.getMountedInstance();
    const rendered = tree.getRenderOutput();

    assert.equal(rendered.props.className, 'reviews-container-component');
    assert.equal(rendered.props.children[0].props.children.length, instance.state.limit, 'Number of children equals the components state.limit');
  });
});
