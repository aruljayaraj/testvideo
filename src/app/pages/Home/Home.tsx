import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import './Home.css';

interface HomeState {
  
}
class Home extends React.Component<{}, HomeState> {
  render() {
    return (
      <IonPage >
        <IonContent className="ion-padding">
        <h1> Home page</h1>
        </IonContent>
      </IonPage>
    );
  }
};

export default Home;
