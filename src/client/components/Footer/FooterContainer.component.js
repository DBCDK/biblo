'use strict';

import React from 'react';
import * as hyperlinks from '../../Constants/hyperlinks.constants';
import './_footer.scss';

export default class FooterContainer extends React.Component {
  render() {
    return (
      <div className="footer--container">
        <div className="footer--coloumns-container">
          <div className="footer--left-coloumn">
            <ul>
              <li>
                <a href={hyperlinks.DET_SKER_PAGE}>
                  <h2>DET SKER</h2>
                </a>
              </li>
              <li>
                <a href={hyperlinks.GROUP_OVERVIEW}>
                  <h2>GRUPPER</h2>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer--right-coloumn">
            <ul>
              <li>
                <a href={hyperlinks.OM_BIBLIO_PAGE}>OM BIBLO</a>
              </li>
              <li>
                <a href={hyperlinks.SOS}>SPØRGSMÅL OG SVAR</a>
              </li>
              <li>
                <a href={hyperlinks.SIKKERHED_PAA_BIBLO}>OM SIKKERHED PÅ BIBLO</a>
              </li>
              <li>
                <a href={hyperlinks.CONTACT}>KONTAKT</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer--copyright-container">
          <p className="footer--copyright-text">Copyright 2016 &copy; De danske folkebiblioteker</p>
        </div>

        <div className="footer--bottom">
          <img className="footer--bottom-image" src="/footer_layer_258.png" />
        </div>
      </div>
    );
  }
}

FooterContainer.displayName = 'FooterContainer';
