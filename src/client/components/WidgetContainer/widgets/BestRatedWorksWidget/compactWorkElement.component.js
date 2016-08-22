/**
 * @file: Compact work element, displays a work in a compact way.
 */

import React, {Component, PropTypes} from 'react';
import Icon from '../../../General/Icon/Icon.component';

import './scss/compactWorkElement.component.scss';

import audiobook from '../../../General/Icon/svg/Materialikon-kvadrat-small/audiobook_no_border.svg';
import book from '../../../General/Icon/svg/Materialikon-kvadrat-small/book_no_border.svg';
import ebook from '../../../General/Icon/svg/Materialikon-kvadrat-small/ebook_no_border.svg';
import film from '../../../General/Icon/svg/Materialikon-kvadrat-small/film_no_border.svg';
import game from '../../../General/Icon/svg/Materialikon-kvadrat-small/game_no_border.svg';
import music from '../../../General/Icon/svg/Materialikon-kvadrat-small/music_no_border.svg';
import photo from '../../../General/Icon/svg/Materialikon-kvadrat-small/photo.svg';

const materialSvgs = {
  audiobook,
  book,
  literature: book,
  ebook,
  film,
  game,
  music,
  photo
};

export class CompactWorkElement extends Component {
  render() {
    const work = this.props.work;
    const title = work.dcTitle;
    const workType = work.workType || 'other';
    const workTypeSvg = materialSvgs[workType];
    const cover = work.coverUrl;
    const pid = work.collection[0];

    return (
      <a className="compact-work-element" href={`/materiale/${encodeURIComponent(pid)}`}>
        <div className="compact-work-element--artwork-container">
          <img src={cover} />
        </div>

        <div className="compact-work-element--title-and-worktype--container">
          <div className="compact-work-element--title"><Icon glyph={workTypeSvg} /> {title}</div>
        </div>
      </a>
    );
  }
}

CompactWorkElement.displayName = 'compactWorkElement';
CompactWorkElement.propTypes = {
  work: PropTypes.object
};
CompactWorkElement.defaultProps = {
  work: {}
};
