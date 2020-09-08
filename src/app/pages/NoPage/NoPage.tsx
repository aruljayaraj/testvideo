import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import './NoPage.scss';

const NoPage: React.FC = () => {
  console.log('No Page');
  return (
    <IonPage >
      <IonContent className="ion-padding">
      <h1> No page</h1>
      </IonContent>
    </IonPage>
  );
}

export default NoPage;
