import { IonContent, IonPage } from '@ionic/react';
import React, {useContext} from 'react';
import { Redirect } from 'react-router-dom';
import AuthProfile from '../../../shared/services/AuthProfile';
import AuthContext from '../../../shared/context/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  console.log('Dashboard Page');
  const { authValues } = useContext(AuthContext);
  const token = AuthProfile.getToken();
  const user = AuthProfile.getUser(); console.log(user);
  if( !authValues.authenticated ){
    return <Redirect to={'/login'} />;
  }
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
