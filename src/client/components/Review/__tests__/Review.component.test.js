import React from 'react';
import sd from 'skin-deep';
import {assert} from 'chai';
import sinon from 'sinon';

import Review from '../Review.component';
import {profileMock} from '../../__mocks__/profile.mock.js';

describe('Test of Review Component ', () => {

  const profile = profileMock;
  const work = {
    id: 1,
    workType: 'book',
    collection: ['test-hest']
  };

  const noop = () => { };
  let uiActions = {openModalWindow: () => {}};
  let flagActions = {};
  let likeActions = {};
  let reviewActions = {
    asyncShowReview: () => {},
    asyncShowWorkReviews: () => {}
  };

  it('onSubmit method should add an error if content is empty', () => {
    const component = sd.shallowRender(
        <Review
            isEditing={true}
            toggleReview={noop}
            profile={profile}
            owner={profile}
            pid={work.id}
            worktype={work.workType}
            pids={work.collection}
            reviewActions={reviewActions}
            uiActions={uiActions}
            flagActions={flagActions}
            likeActions={likeActions}
            content=''
            rating={1}
        />);

    let instance = component.getMountedInstance();
    instance.processContent()
      .then(()=> {
        assert.isNotFalse(component.subTree('Message'));
      })
      .catch(()=> {
      });
  });

  it('should add an error if rating is not set', () => {
    const component = sd.shallowRender(
      <Review
        isEditing={true}
        toggleReview={noop}
        profile={profile}
        owner={profile}
        pid={work.id}
        worktype={work.workType}
        pids={work.collection}
        reviewActions={reviewActions}
        uiActions={uiActions}
        flagActions={flagActions}
        likeActions={likeActions}
        content='test hest'
        rating={0}
    />);
    let instance = component.getMountedInstance();
    instance.validate();
    assert.isNotFalse(component.subTree('Message'), 'error message was not found');
  });

  it('should not be able to submit if the user is not logged in', () => {
    profile.userIsLoggedIn = false;
    const component = sd.shallowRender(
      <Review
        isEditing={true}
        toggleReview={noop}
        profile={profile}
        owner={profile}
        pid={work.id}
        worktype={work.workType}
        pids={work.collection}
        reviewActions={reviewActions}
        uiActions={uiActions}
        flagActions={flagActions}
        likeActions={likeActions}
        content='test hest'
        rating={1}
      />);

    assert.isFalse(component.subTree('form'));
  });

  it('should open a modal on a duplicate review for a work', (done) => {
    try {
      profile.userIsLoggedIn = true;
      const component = sd.shallowRender(

      <Review
        isEditing={true}
        toggleReview={noop}
        profile={profile}
        owner={profile}
        pid={work.id}
        worktype={work.workType}
        pids={work.collection}
        reviewActions={reviewActions}
        uiActions={uiActions}
        flagActions={flagActions}
        likeActions={likeActions}
        content='test hest'
        rating={5}
      />);

      let instance = component.getMountedInstance();
      const mockContent = {
        status: 500, // biblo.dk transport
        data: {
          error: {
            name: 'Error',
            status: 500, // community server transport
            message: 'Eksisterende anmeldelse',  //
            stack: 'Error: Eksisterende anmeldelse',
            existingReviewId: 1
          }
        }
      };

      const xhrMock = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-undef
      xhrMock.onCreate = (xhr) => {
        setTimeout(() => xhr.respond(500, {'Content-Type': 'application/json'}, JSON.stringify(mockContent)), 0);
      };

      const spy = sinon.spy(instance, 'overwriteReview');
      instance.processContent()
        .then(() => {
          assert.isTrue(spy.called);
          done();
          xhrMock.restore();
        })
        .catch((err) => {
          console.warn('procesContent failed:', err);  // eslint-disable-line no-console
          assert.isTrue(false, 'processContent failed');
          done();
          xhrMock.restore();
        });
    }
    catch (err) {
      assert.isTrue(false, 'failed to wait for overwriteReview modal');
      console.warn('failed to wait for overwriteReview modal:', err); // eslint-disable-line no-console
      done();
    }

  });
});
