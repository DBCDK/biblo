/**
 * @file: implements EditoriallySelectedMaterialsWidget, renders pre selected materials from widgetConfig.
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {isEqual} from 'lodash';

import {AbstractWidget} from '../../AbstractWidget.component';
import Icon from '../../../General/Icon/Icon.component';
import plusSvg from '../../../General/Icon/svg/functions/plus.svg';
import minusSvg from '../../../General/Icon/svg/functions/minus.svg';

import {CompactWorkElementsContainer} from '../BestRatedWorksWidget/compactWorkElementsContainer.component';

import './scss/EditoriallySelectedMaterials.widget.component.scss';

export class EditoriallySelectedMaterialsWidget extends AbstractWidget {
  constructor(props) {
    super(props);

    this.state = {
      closed: true,
      works: Object.values(props.widgetReducerProp.works),
      isLoading: props.widgetReducerProp.isLoading
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState) ||
      !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp) ||
      !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  componentWillReceiveProps(nextProps) {
    const works = Object.values(nextProps.widgetReducerProp.works);
    this.setState({works, isLoading: false});
  }

  componentDidMount() {
    this.callServiceProvider('work', {pids: this.props.widgetConfig.pids});
  }

  render() {
    const works = (this.props.widgetReducerProp.works || []).slice(0, this.state.closed ? 6 : (this.state.works.length));

    let closeButtonContent;
    if (this.state.closed) {
      closeButtonContent = (
        <span>
        <Icon glyph={plusSvg}/> VIS FLERE
      </span>
      );
    }
    else {
      closeButtonContent = (
        <span>
        <Icon glyph={minusSvg}/> VIS FÆRRE
      </span>
      );
    }

    return (
      <div className="editorially-selected-materials-widget">
        <CompactWorkElementsContainer
          closed={this.state.closed}
          isLoading={this.state.isLoading}
          works={works} />

        <div className="editorially-selected-materials-widget--show-more-button--container">
          {
            !this.state.isLoading &&
          <a className="editorially-selected-materials-widget--show-more-button" onClick={() => this.setState({closed: !this.state.closed})}>
            {closeButtonContent}
          </a>
          }
          <hr />
        </div>

      </div>
    );
  }
}

EditoriallySelectedMaterialsWidget.displayName = 'EditoriallySelectedMaterialsWidget';
