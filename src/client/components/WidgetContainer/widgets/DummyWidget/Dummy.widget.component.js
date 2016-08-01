/**
 * @file: Dummy widget used for tests, and an example of the simplest widget possible
 */

import React from 'react';
import {AbstractWidget} from '../../AbstractWidget.component';

// A widget is just a normal react component, with a specific subset of props.
// It can inherit from AbstractWidget, but it's not required.
// AbstractWidget just provides a few sane defaults and helper methods.
// Generally a widget should get all initial data from the CMS that controls it,
// And request whatever remains, via our actions.
// All data received after the CMS data, for a specific widget should be namespaced in the reducer to the widget name.
export class DummyWidget extends AbstractWidget {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <span className="dummy-widget">This is a dummy widget!</span>
    );
  }
}

DummyWidget.displayName = 'DummyWidget';
