import React from 'react';

import PageLayout from '../Layout/PageLayout.component.js';

export class WorkContainer extends React.Component {
  render() {

    const jsonData = document.getElementById('JSONDATA');
    const data = JSON.parse(jsonData.innerHTML);
    const work = data.work;
    console.log(work);

    return (
      <PageLayout>
        <p>WorkContainer {work.id} {work.title}</p>
      </PageLayout>
    );
  }
}

WorkContainer.displayName = 'WorkContainer';
WorkContainer.propTypes = {

};
