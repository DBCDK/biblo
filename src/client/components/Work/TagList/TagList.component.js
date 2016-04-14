import React from 'react';

import Icon from '../../General/Icon/Icon.component.js'
import tagSvg from '../../General/Icon/svg/functions/tag.svg';


import './TagList.component.scss';

export class TagList extends React.Component {
  render() {
    const tagElements = this.props.tags.map((tag) => (<li><a href={'#søg-på-emneordet-'+tag}>{tag}</a></li>));
    return (
      <div className='tag-list--container'>
        <Icon glyph={tagSvg} name=''/>
        <ul className='tag-list'>
          {tagElements}
        </ul>
      </div>
    );
  }
}

TagList.displayName = 'TagList';
TagList.propTypes = {
  tags: React.PropTypes.array.isRequired
};
