import React from 'react';
import PageLayout from '../Layout/PageLayout.component.js';

import parseJsonData from '../../Utils/parseJsonData.js';

import './errorpage.scss';

const statusCode = parseJsonData('JSONDATA', 'statusCode');

export default function ErrorPageContainer() {

  const messages = {
    404: 'Siden blev ikke fundet',
    500: 'Der er sket en fejl',
    403: 'Du har ikke adgang til denne side'
  };

  return (
    <PageLayout>
      <div className='error-page--error-splash'>
        <h2>UPS...</h2>
        <p>Du har ramt en side der ikke findes. Gå tilbage til den foregående side eller brug menuen til at komme videre.</p>
        <p>{statusCode} {messages[statusCode]}</p>
      </div>
    </PageLayout>
  );
}

ErrorPageContainer.displayName = 'ErrorPageContainer';
