import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import './Home.css';

const Home: React.FC = () => {
    // console.log(this.props );
    console.log('Home Page');
    return (
      <IonPage >
        <IonContent className="ion-padding">
        <h1> Home page</h1>
        <p>{process.env.REACT_APP_API_URL}</p>
        </IonContent>
      </IonPage>
    );
};

export default Home;
