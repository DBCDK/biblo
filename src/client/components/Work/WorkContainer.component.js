import React from 'react';

import PageLayout from '../Layout/PageLayout.component.js';
import {WorkDetail} from './Detail/WorkDetail.component.js';
import {WorkHeader} from './Header/WorkHeader.component.js';

export class WorkContainer extends React.Component {
  render() {

    const jsonData = document.getElementById('JSONDATA');
    const data = JSON.parse(jsonData.innerHTML);
    const work = data.work; // eslint-disable-line no-unused-vars

    return (
      <PageLayout>
        <WorkHeader coverUrl={'http://ecx.images-amazon.com/images/I/31Bnsm4xG4L._SX300_BO1,204,203,200_.jpg'} />
        <WorkDetail />
      </PageLayout>
    );
  }
}

WorkContainer.displayName = 'WorkContainer';
WorkContainer.propTypes = {

};
