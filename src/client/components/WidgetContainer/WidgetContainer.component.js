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

import {Component, PropTypes} from 'react';
import widgetComponents from './widgets';

export default class WidgetContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // Først finder vi alle widgets til denne placering
    let currentWidgetStates = this.props.widgetState.widgetLocations[this.props.widgetLocationName];
    if (currentWidgetStates) {
      // Vi looper over alle widgets til denne placering (man kan have så mange man lyster)
      let widgets = (Array.isArray(currentWidgetStates) ? currentWidgetStates : [currentWidgetStates]).map((currentWidgetState, idx) => {
        // Vi henter den widget vi gerne vil rendere
        const CurrentWidget = widgetComponents[currentWidgetState.widgetName];
        const widgetReducerProp =
          this.props.widgetState[currentWidgetState.widgetName] ||
          this.props.widgetState[currentWidgetState.widgetName.replace('Widget', '')];

        // Vi renderer vores widget
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

      // Vi renderer alle widgets til denne placering
      return (
        <div className={`${this.props.widgetLocationName}--generic-widget-container`}>
          {widgets}
        </div>
      );
    }

    // Der var ingen widgets til denne placering
    return <span />;
  }
}

WidgetContainer.displayName = 'WidgetContainer';
WidgetContainer.propTypes = {
  widgetLocationName: PropTypes.string.isRequired,
  widgetState: PropTypes.object.isRequired,
  widgetActions: PropTypes.object.isRequired
};
