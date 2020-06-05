import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import AuthProfile from '../../../shared/services/AuthProfile';
import './Dashboard.css';

const Dashboard: React.FC = () => { console.log('Meow');
  const token = AuthProfile.getToken();
  const user = AuthProfile.getUser(); console.log(user);
  return (
    <IonPage>
      
      <IonContent>
      <h1> Dashboard page</h1>
      <p>{ token }</p>
      </IonContent> 
      
    </IonPage>
  );
};

export default Dashboard;
