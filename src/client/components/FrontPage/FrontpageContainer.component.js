'use strict';

import React from 'react';
import PageLayout from '../Layout/PageLayout.component.js';
import Login from '../General/Login/Login.component';

import ColoredHeader from '../General/ColoredHeader/ColoredHeader.component.js';
import ContentGrid from '../General/ContentGrid/ContentGrid.component.js';

import './_frontpage.scss';

const contentItems = [
  {
    id: 1,
    title: 'Spørg Biblo og upload jeres svar',
    text: 'Denne gruppe er til alle jer, der vil uploade jeres svar til "Hvem styrer din Hjerne" og stille spørgsmål til forskerne. Se også de andres indlæg og giv dem en glad kommentar!',
    url: '/grupper/1',
    imageUrl: 'http://lorempixel.com/300/160/'
  },
  {
    id: 2,
    title: 'Spørg Biblo og upload jeres svar',
    text: 'Denne gruppe er til alle jer, der vil uploade jeres svar til "Hvem styrer din Hjerne" og stille spørgsmål til forskerne. Se også de andres indlæg og giv dem en glad kommentar!',
    url: '/grupper/1',
    imageUrl: 'http://lorempixel.com/300/160/'
  },
  {
    id: 3,
    title: 'Spørg Biblo og upload jeres svar',
    text: 'Denne gruppe er til alle jer, der vil uploade jeres svar til "Hvem styrer din Hjerne" og stille spørgsmål til forskerne. Se også de andres indlæg og giv dem en glad kommentar!',
    url: '/grupper/1',
    imageUrl: 'http://lorempixel.com/300/160/'
  },
  {
    id: 4,
    title: 'Spørg Biblo og upload jeres svar',
    text: 'Denne gruppe er til alle jer, der vil uploade jeres svar til "Hvem styrer din Hjerne" og stille spørgsmål til forskerne. Se også de andres indlæg og giv dem en glad kommentar!',
    url: '/grupper/1',
    imageUrl: 'http://lorempixel.com/300/160/'
  },
  {
    id: 5,
    title: 'Spørg Biblo og upload jeres svar',
    text: 'Denne gruppe er til alle jer, der vil uploade jeres svar til "Hvem styrer din Hjerne" og stille spørgsmål til forskerne. Se også de andres indlæg og giv dem en glad kommentar!',
    url: '/grupper/1',
    imageUrl: 'http://lorempixel.com/300/160/'
  },
  {
    id: 6,
    title: 'Spørg Biblo og upload jeres svar',
    text: 'Denne gruppe er til alle jer, der vil uploade jeres svar til "Hvem styrer din Hjerne" og stille spørgsmål til forskerne. Se også de andres indlæg og giv dem en glad kommentar!',
    url: '/grupper/1',
    imageUrl: 'http://lorempixel.com/300/160/'
  },
  {
    id: 7,
    title: 'Spørg Biblo og upload jeres svar',
    text: 'Denne gruppe er til alle jer, der vil uploade jeres svar til "Hvem styrer din Hjerne" og stille spørgsmål til forskerne. Se også de andres indlæg og giv dem en glad kommentar!',
    url: '/grupper/1',
    imageUrl: 'http://lorempixel.com/300/160/'
  },
  {
    id: 8,
    title: 'Spørg Biblo og upload jeres svar',
    text: 'Denne gruppe er til alle jer, der vil uploade jeres svar til "Hvem styrer din Hjerne" og stille spørgsmål til forskerne. Se også de andres indlæg og giv dem en glad kommentar!',
    url: '/grupper/1',
    imageUrl: 'http://lorempixel.com/300/160/'
  },
  {
    id: 9,
    title: 'Spørg Biblo og upload jeres svar',
    text: 'Denne gruppe er til alle jer, der vil uploade jeres svar til "Hvem styrer din Hjerne" og stille spørgsmål til forskerne. Se også de andres indlæg og giv dem en glad kommentar!',
    url: '/grupper/1',
    imageUrl: 'http://lorempixel.com/300/160/'
  },
];


export default function FrontpageContainer() {

  const welcomeText = "" +
    "Du kender biblioteket som stedet, hvor du kan lære noget, " +
    "lege og møde andre børn. Sådan er det også her på Biblo.dk. " +
    "Her kommer der hele tiden nye grupper, konkurrencer og børn til. " +
    "Det giver mening at være nysgerrig på Biblo - helt sikkert!";

  return (
    <PageLayout>
      <ColoredHeader text={welcomeText} title={'Velkommen til Biblo'} />
      <ContentGrid items={contentItems} />
    </PageLayout>
  );
}

FrontpageContainer.displayName = 'FrontpageContainer';
