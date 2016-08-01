import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {expect, assert} from 'chai';
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
  let defaultComponent = null;

  let reviewActions = {};
  let uiActions = {};
  let flagActions = {};
  let likeActions = {};

  beforeEach(() => {
    defaultComponent = TestUtils.renderIntoDocument(
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
  });

  it('it should render form', () => {
    const component = defaultComponent;
    let form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    const method = ReactDOM.findDOMNode(form).method.toUpperCase();
    expect(method).to.equal('POST');

    let inputContent = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputContent.length).to.be.eql(9);
    let submit = TestUtils.findRenderedDOMComponentWithTag(component, 'button');
    expect(submit.type).to.be.eql('submit');
  });

  it('onSubmit method should add an error if content is empty', () => {
    const component = TestUtils.renderIntoDocument(
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

    const form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    TestUtils.Simulate.submit(form);
    TestUtils.findRenderedDOMComponentWithClass(component, 'message');
  });

  it('onSubmit method should add an error if rating is not set', () => {
    const component = TestUtils.renderIntoDocument(
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

    const form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    TestUtils.Simulate.submit(form);
    TestUtils.findRenderedDOMComponentWithClass(component, 'message');
  });

  it('it should add textarea value to state', () => {
    let textarea = TestUtils.findRenderedDOMComponentWithTag(defaultComponent, 'textarea');
    textarea.value = 'some test value';
    TestUtils.Simulate.change(textarea);
    expect(defaultComponent.state.content).to.be.equal(textarea.value);
  });

  it('should not be able to submit if the user is not logged in', () => {
    profile.userIsLoggedIn = false;

    const component = TestUtils.renderIntoDocument(
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

    const form = TestUtils.scryRenderedDOMComponentsWithTag(component, 'form');
    assert(form.length === 0);
  });

  it('should submit form on a submit event', () => {
    profile.userIsLoggedIn = true;
    const component = TestUtils.renderIntoDocument(
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

    const form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    TestUtils.Simulate.submit(form);
    assert(component.state.isLoading); // we expect an error here (existing reviewownerid + pid
  });

  it('should throw an error on duplicate reviews', (done) => {
    profile.userIsLoggedIn = true;
    const component = TestUtils.renderIntoDocument(
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

    const mockContent = {
      status: 500,
      data: {
        error: {
          name: 'Error',
          status: 500,
          message: 'Eksisterende anmeldelse',
          stack: 'Error: Eksisterende anmeldelse',
          existingReviewId: 1
        }
      }
    };

    const xhrMock = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-undef
    xhrMock.onCreate = (xhr) => {
      setTimeout(() => xhr.respond(500, {'Content-Type': 'application/json'}, JSON.stringify(mockContent)), 0);
    };

    const form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    TestUtils.Simulate.submit(form);

    assert(component.state.isLoading); // we expect an error here (existing reviewownerid + pid
    done();
  });

});
