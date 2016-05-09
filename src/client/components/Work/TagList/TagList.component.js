import React from 'react';

import Icon from '../../General/Icon/Icon.component.js';
import tagSvg from '../../General/Icon/svg/functions/tag.svg';

import './TagList.component.scss';

export class TagList extends React.Component {
  render() {
    const tagElements = this.props.tags.map((tag, i) => (<li key={i}><a href={'/find?q=term.subject="'+tag+'"'}>{tag}</a></li>));
    let component = null;

    if (tagElements.length > 0) {
      component = (
        <div className='tag-list--container'>
          <Icon glyph={tagSvg} name=''/>
          <ul className='tag-list'>
            {tagElements}
          </ul>
        </div>
      );
    }

    return component;
  }
}

TagList.displayName = 'TagList';
TagList.propTypes = {
  tags: React.PropTypes.array.isRequired
};
