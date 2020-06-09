import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import './Home.css';

interface HomeState {
  
}
class Home extends React.Component<{}, HomeState> {
  constructor(props: any) {
    super(props);

    this.state = {
      email: '',
      password: ''
    }
  }

  render() {
    // console.log(this.props );
    console.log('Home Page');
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
