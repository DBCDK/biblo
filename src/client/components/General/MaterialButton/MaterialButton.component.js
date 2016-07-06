import React from 'react';
import Icon from '../Icon/Icon.component.js';
import './MaterialButton.component.scss';

import bookSvg from '../Icon/svg/Materialikon-kvadrat-small/book.svg';
import ebookSvg from '../Icon/svg/Materialikon-kvadrat-small/ebook.svg';
import audiobookSvg from '../Icon/svg/Materialikon-kvadrat-small/audiobook.svg';
import filmSvg from '../Icon/svg/Materialikon-kvadrat-small/film.svg';
import gameSvg from '../Icon/svg/Materialikon-kvadrat-small/game.svg';
import musicSvg from '../Icon/svg/Materialikon-kvadrat-small/music.svg';

const glyphs = {
  book: bookSvg,
  ebook: ebookSvg,
  audiobook: audiobookSvg,
  film: filmSvg,
  game: gameSvg,
  music: musicSvg
};


const MaterialButton = ({materialType='book', active=false}) => {
  const classNames = (active) ? 'material-button material-button--active': 'material-button material-button--inactive';
  return (
    <a className={classNames} href="/">
      <Icon glyph={glyphs[materialType]} width={24} height={24}/>
      <span className='material-button--label'>{materialType}</span>
    </a>
  );
};

MaterialButton.displayName = 'MaterialButton';
MaterialButton.propTypes = {
  active: React.PropTypes.bool.isRequired,
  materialType: React.PropTypes.string.isRequired
};

export default MaterialButton;
