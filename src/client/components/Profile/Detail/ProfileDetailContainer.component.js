'use strict';

/**
 * @file: Dette er den offentlige profil.
 */

import React from 'react';

import PageLayout from '../../Layout/PageLayout.component';
import VisFlereButton from '../../General/VisFlereButton/VisFlereButton.component';
import ActivityRow from './ActivityRow.component';

import './ProfileDetailContainer.component.scss';

export default class ProfileDetailContainer extends React.Component {
  render() {
    return (
      <PageLayout>
        <div className="p-detail--image-container">
          <img src="/no_profile.png" />
        </div>

        <div className="p-detail--displayname-description-follow">
          <p className="p-detail--displayname">Sofiiie92</p>
          <p>“Selv om livet er svært... er det ret sjovt alligevel”</p>
          <button>Følg</button>
        </div>

        <ActivityRow>
          <strong>Se hvad Sofiie92 har lavet:</strong>
        </ActivityRow>

        <ActivityRow date="3002">
          <p>
            Sausage dolore voluptate, brisket corned beef officia ad eu shankle porchetta turducken jowl short ribs. Ham hock porchetta tongue excepteur aute. Quis aliquip andouille consequat shank do sed ipsum pork laboris esse anim tongue ball tip. Veniam drumstick nulla ut, culpa exercitation rump salami prosciutto mollit et. Ut ut mollit fatback consequat quis ex t-bone pork shankle. Esse officia salami pastrami andouille velit pig shoulder tempor meatball turkey.
          </p>
        </ActivityRow>

        <ActivityRow date={(new Date()).toISOString()} imageSrc="/no_group_image.png">
          <p>bobby er sej!</p>
        </ActivityRow>

        <ActivityRow date="213" likes={15} answerFunction={() => {}}>
          <p>
            Bacon ipsum dolor amet consectetur tenderloin corned beef, filet mignon andouille landjaeger chicken cupidatat pastrami tri-tip duis id capicola leberkas. Picanha bacon shank, adipisicing aliqua ea beef ribs landjaeger. Pork loin nulla minim, commodo ut shoulder elit cupim. Ground round culpa picanha pancetta, nisi bresaola veniam consequat sed. Turducken ham exercitation ipsum magna quis pastrami shank. Beef ribs irure turkey duis occaecat, laboris kevin non pork chop labore incididunt aute magna spare ribs ullamco.
          </p>
        </ActivityRow>

        <ActivityRow date={(new Date()).toISOString()} imageSrc="/no_group_image.png" likes={2} answerFunction={() => {}}>
          <p>
            Ground round pancetta voluptate kevin lorem tenderloin id meatloaf t-bone elit pig biltong aliquip. Sirloin meatloaf aute, excepteur shoulder pork loin tri-tip porchetta veniam magna beef cillum biltong labore. Leberkas ullamco ut, pancetta in culpa commodo chicken cupidatat. Jerky landjaeger meatloaf tongue filet mignon. Shankle ullamco nulla, boudin porchetta occaecat nisi strip steak elit picanha bacon andouille ground round rump quis. Reprehenderit ex strip steak, eu lorem sunt veniam cow prosciutto tenderloin excepteur duis cupidatat.
          </p>
        </ActivityRow>

        <ActivityRow date={(new Date()).toISOString()} imageSrc="/no_group_image.png">
          <p>
            Ham strip steak ipsum prosciutto, esse culpa corned beef aute enim adipisicing in short loin chuck. Jerky est et ad aute. Consequat beef ribs do voluptate, ribeye rump meatball venison sirloin ut fatback turkey. Ball tip occaecat beef ribs, aliquip dolore porchetta deserunt shank. Brisket sirloin occaecat, rump in ullamco cow deserunt bresaola in voluptate turkey exercitation.
            Ground round pancetta voluptate kevin lorem tenderloin id meatloaf t-bone elit pig biltong aliquip. Sirloin meatloaf aute, excepteur shoulder pork loin tri-tip porchetta veniam magna beef cillum biltong labore. Leberkas ullamco ut, pancetta in culpa commodo chicken cupidatat. Jerky landjaeger meatloaf tongue filet mignon. Shankle ullamco nulla, boudin porchetta occaecat nisi strip steak elit picanha bacon andouille ground round rump quis. Reprehenderit ex strip steak, eu lorem sunt veniam cow prosciutto tenderloin excepteur duis cupidatat.
          </p>
        </ActivityRow>

        <ActivityRow date="1">
          <p>bobbyboy!</p>
        </ActivityRow>

        <VisFlereButton onClick={() => {}} />
      </PageLayout>
    );
  }
}

ProfileDetailContainer.displayName = 'ProfileDetailContainer';
