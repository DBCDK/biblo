/**
 * @file: WidgetContainer.component.js is the generic widget component which connect widgets to their data,
 * and renders them where they need to be rendered.
 *
 * @usage:
 * <WidgetContainer
 *   widgetLocationName="A string which describes the location"
 *   widgetState={[Object containing the output from the widgetReducer]}
 *   widgetActions{[Object containing all the methods related to widgets]}
 * />
 *
 */

import React, {Component, PropTypes} from 'react';
import widgetComponents from './widgets';

class WidgetContainer extends Component {
  render() {
    // First, find all widgets we want to render for this widgetcontainer
    let currentWidgetStates = this.props.widgetState.widgetLocations[this.props.widgetLocationName];
    if (currentWidgetStates) {
      // Loop over the widgets, you can have as many as you'd like
      let widgets = (Array.isArray(currentWidgetStates) ? currentWidgetStates : [currentWidgetStates]).map((currentWidgetState, idx) => {
        // Now we get the widget we wish to render.
        const CurrentWidget = widgetComponents[currentWidgetState.widgetName];

        // And we get the relevant state for that widget.
        const widgetReducerProp =
          this.props.widgetState[currentWidgetState.widgetName] ||
          this.props.widgetState[currentWidgetState.widgetName.replace('Widget', '')];

        // We now render our widget inside a container
        return (
          <div
            className="generic-widget-container"
            key={`${this.props.widgetLocationName}_${currentWidgetState.widgetName}_${idx}`}
          >
            <CurrentWidget
              widgetLocationName={this.props.widgetLocationName}
              widgetState={this.props.widgetState}
              widgetActions={this.props.widgetActions}
              widgetReducerProp={widgetReducerProp}
              widgetData={currentWidgetState.widgetData}/>
          </div>
        );
      });

      // Finally we render the array of widgets relevant to this position.
      return (
        <div className={`${this.props.widgetLocationName}--generic-widget-container`}>
          {widgets}
        </div>
      );
    }

    // This renders if no widgets were found for this position
    return <span className={`${this.props.widgetLocationName}--generic-widget-container no-widgets`} />;
  }
}

WidgetContainer.displayName = 'WidgetContainer';
WidgetContainer.propTypes = {
  widgetLocationName: PropTypes.string.isRequired,
  widgetState: PropTypes.object.isRequired,
  widgetActions: PropTypes.object.isRequired
};

export default WidgetContainer;
