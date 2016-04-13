import React from 'react';

import PageLayout from '../Layout/PageLayout.component.js';
import {WorkDetail} from './Detail/WorkDetail.component.js';
import {WorkHeader} from './Header/WorkHeader.component.js';

export class WorkContainer extends React.Component {
  render() {

    const jsonData = document.getElementById('JSONDATA');
    const data = JSON.parse(jsonData.innerHTML);
    const work = data.work;

    return (
      <PageLayout>
        <WorkHeader coverUrl={'https://moreinfo.addi.dk/2.1/more_info_get.php?id=34941100&type=forside_500&key=ff65faa369343c15ac8d'} />
        <WorkDetail />
      </PageLayout>
    );
  }
}

WorkContainer.displayName = 'WorkContainer';
WorkContainer.propTypes = {

};
