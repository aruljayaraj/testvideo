import React from 'react';
import { IonApp } from '@ionic/react';

import Routes from './Routes';

const App: React.FC = () => {

  return (
    <IonApp>
      <Routes />
    </IonApp>
  );
}

export default App;
