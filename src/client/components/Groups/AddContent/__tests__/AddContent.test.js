'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import chai from 'chai';
let expect = chai.expect;
import AddContent from '../AddContent.component';

describe('Test of AddConent Component', () => {
  const profile = {
    userIsLoggedIn: true
  };
  const defaultComponent = TestUtils.renderIntoDocument(
    <AddContent profile={profile} parentId={1} type="test" redirectTo="some_url"/>);

  it('it should render form', () => {
    const component = defaultComponent;
    let form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    expect(ReactDom.findDOMNode(form).method).to.be.eql('post');
    let inputContent = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputContent.length).to.be.eql(6);
    expect(ReactDom.findDOMNode(inputContent[0]).type).to.be.eql('hidden');
    expect(ReactDom.findDOMNode(inputContent[1]).type).to.be.eql('hidden');
    expect(ReactDom.findDOMNode(inputContent[2]).type).to.be.eql('hidden');
    expect(ReactDom.findDOMNode(inputContent[3]).type).to.be.eql('hidden');
    expect(ReactDom.findDOMNode(inputContent[4]).type).to.be.eql('submit');
    expect(ReactDom.findDOMNode(inputContent[5]).type).to.be.eql('file');

  });
  it('it should render form with properties', () => {
    const component = defaultComponent;
    let form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    expect(ReactDom.findDOMNode(form).action).to.be.eql('/grupper/content/test');
    let input = TestUtils.findRenderedDOMComponentWithClass(component, 'redirect');
    expect(ReactDom.findDOMNode(input).value).to.be.eql('some_url');
  });

  it('it should add image to state + show exampleimage', () => {
    const component = TestUtils.renderIntoDocument(
      <AddContent profile={profile} parentId={1} type="test" redirectTo="some_url"/>);
    sinon.stub(component, 'readURL', () => { // eslint-disable-line no-undef
      component.setState({image: 'some_image_url'});
    });
    let fileInput = TestUtils.findRenderedDOMComponentWithClass(component, 'upload-content-image');
    expect(ReactDom.findDOMNode(fileInput).id).to.be.equal('upload-image-test-1');
    TestUtils.Simulate.change(fileInput);

    expect(component.state.image).to.be.equal('some_image_url');
    expect(component.readURL.called).to.be.equal(true);

    let image = TestUtils.findRenderedDOMComponentWithTag(component, 'img');
    expect(ReactDom.findDOMNode(image).src).to.contain('some_image_url');

  });
  it('it should add textarea value to state', () => {
    let textarea = TestUtils.findRenderedDOMComponentWithTag(defaultComponent, 'textarea');
    textarea.value = 'some test value';
    TestUtils.Simulate.change(textarea);
    expect(defaultComponent.state.text).to.be.equal(textarea.value);
  });


  it('it should call abort action', () => {
    const abort = sinon.spy(); // eslint-disable-line no-undef
    const component = TestUtils.renderIntoDocument(
      <AddContent profile={profile} parentId={1} type="test" redirectTo="some_url" abort={abort} />);
    let input = TestUtils.findRenderedDOMComponentWithClass(component, 'alert');
    expect(ReactDom.findDOMNode(input).value).to.be.eql('Fortryd');
    TestUtils.Simulate.click(input);
    expect(abort.called).to.be.equal(true);
  });


  it('it should be hidden if user not logged in', () => {
    profile.userIsLoggedIn = false;
    const component = TestUtils.renderIntoDocument(
      <AddContent profile={profile} parentId={1} type="test" redirectTo="some_url"/>);
    let form = TestUtils.scryRenderedDOMComponentsWithTag(component, 'form');
    expect(form.length).to.be.eql(0);
    let aTag = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
    expect(ReactDom.findDOMNode(aTag).href).to.contain('login');
  });

  it('it should be in edit mode if id is passed', () => {
    profile.userIsLoggedIn = true;
    profile.id=1;
    const owner ={
      id: 1
    };
    const component = TestUtils.renderIntoDocument(
      <AddContent owner={owner} profile={profile} parentId={1} text="text to test" image="some_url" type="test" redirectTo="some_url"/>);
    let form = TestUtils.scryRenderedDOMComponentsWithTag(component, 'form');
    expect(form.length).to.be.eql(1);
    let textarea = TestUtils.findRenderedDOMComponentWithTag(component, 'textarea');
    expect(textarea.value).to.be.equal('text to test');
    let image = TestUtils.findRenderedDOMComponentWithTag(component, 'img');
    expect(image.src).to.be.contain('some_url');
    let removeImage = TestUtils.findRenderedDOMComponentWithClass(component, 'remove-image');
    TestUtils.Simulate.click(removeImage);
    expect(() => TestUtils.findRenderedDOMComponentWithTag(component, 'img')).to.throw(Error);
  });
});
