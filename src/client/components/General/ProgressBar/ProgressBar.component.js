import React from 'react';

function ProgressBar({completed, color, height, children}) {
  completed = completed < 0 ? 0 : completed;
  completed = completed > 100 ? 100 : completed;

  // Use inline styles to simplify radically.
  let style = {
    backgroundColor: color,
    width: completed + '%',
    transition: 'width 200ms',
    height: height
  };

  let containerStyle = {
    display: 'inline-flex',
    width: '100%'
  };

  return (
    <div className="progressbar-container" style={containerStyle}>
      <div className="progressbar-container--progress" style={style}>{children}</div>
    </div>
  );
}

ProgressBar.displayName = 'ProgressBar';

ProgressBar.propTypes = {
  completed: React.PropTypes.number,
  color: React.PropTypes.string,
  height: React.PropTypes.string,
  children: React.PropTypes.any
};

ProgressBar.defaultProps = {
  completed: 0,
  color: '#2acc94',
  height: '10px'
};
export default ProgressBar;
