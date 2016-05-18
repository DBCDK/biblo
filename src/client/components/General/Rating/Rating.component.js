import React from 'react';

import './Rating.scss';

export default class Rating extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props;
  }

  onChange(i) {
    if (this.props.onChange) {
      this.setState({
        rating: i
      });
      this.props.onChange(i);
    }
  }

  renderStars() {
    let {pid, rating = 0} = this.state;
    let stars = [];
    for (let i = 1; i <= 6; i++) {
      const id = `${pid}_${i}`;
      const label = (
        <div
          key={`label_${id}`}
          className={rating >= i ? 'star-active' : 'star-passive'}
          htmlFor={id}
          onClick={this.onChange.bind(this, i, rating, name)}
        >
          &#9733;
        </div>
      );
      stars.push(label);
    }
    return stars;
  }

  render() {
    let {rating = 0} = this.state;
    return (
      <div className='rating' >
        {this.renderStars(rating)}
        {this.props.starsOnly ? null : `(${rating} / 6)`}
      </div>
    );
  }
}

Rating.displayName = 'Rating.component';

Rating.propTypes = {
  rating: React.PropTypes.number,
  onChange: React.PropTypes.func,
  starsOnly: React.PropTypes.bool,
  pid: React.PropTypes.string
};

Rating.defaultProps = {
  clickFunction: () => {
  },
  onChange: null,
  starsOnly: false, // pass true if only stars is wanted. Otherwise a parantheses will be appended to the list of starts i.e. (3 / 6)
  pid: ''
};

export default Rating;
