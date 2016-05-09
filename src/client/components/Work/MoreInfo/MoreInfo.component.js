import React from 'react';

import './MoreInfo.component.scss';

export class MoreInfo extends React.Component {

  render() {

    const seriesRow = (this.props.series) ? (<tr><td>Serie</td><td>{this.props.series}</td></tr>) : null;

    const yearRow = (this.props.year) ? (<tr><td>Udgivet i</td><td>{this.props.year}</td></tr>) : null;

    const tagElements = (this.props.tags) ? this.props.tags.map((tag) => (<div><a href={'/find?q=term.subject="'+tag+'"'}>{tag}</a></div>)) : null;
    const tagsRow = (this.props.tags) ? (<tr><td>Emne</td><td>{tagElements}</td></tr>) : null;

    const dk5Row = (this.props.dk5) ? (<tr><td>DK5</td><td>{this.props.dk5}</td></tr>) : null;

    const dk5TextRow = (this.props.dk5Text) ? (<tr><td>Opstilling</td><td>{this.props.dk5Text}</td></tr>) : null;

    const languages = this.props.languages || [];
    const languageElements = this.props.languages.map((language) => (<div>{language}</div>));
    const languagesRow = (languages) ? (<tr><td>Sprog</td><td>{languageElements}</td></tr>) : null;

    const audienceElements = (this.props.audience) ? this.props.audience.map((aud) => (<div>{aud}</div>)) : null; // eslint-disable-line no-unused-vars
    const audienceRow = (this.props.audience) ? (<tr><td>{this.props.audience}</td><td>1</td></tr>) : null;

    const lixRow = (this.props.lix) ? (<tr><td>Lix</td><td>{this.props.lix}</td></tr>) : null;


    return (
      <div className='more-info'>
        <h2>Mere info</h2>
        <table className='more-info--table'>
          <tbody>
            {seriesRow}
            {yearRow}
            {tagsRow}
            {dk5Row}
            {dk5TextRow}
            {languagesRow}
            {audienceRow}
            {lixRow}
          </tbody>
        </table>
      </div>
    );
  }
}

MoreInfo.displayName = 'MoreInfo';
MoreInfo.propTypes = {
  tags: React.PropTypes.array,
  series: React.PropTypes.string,
  year: React.PropTypes.string,
  dk5: React.PropTypes.string,
  dk5Text: React.PropTypes.string,
  languages: React.PropTypes.array,
  audience: React.PropTypes.array,
  lix: React.PropTypes.number,
  materials: React.PropTypes.array.isRequired
};

