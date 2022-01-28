import React from 'react';
import { IonApp } from '@ionic/react';
import { setupIonicReact } from '@ionic/react';
import Routes from './Routes';
setupIonicReact({
  mode: 'md'
});


const App: React.FC = () => {
  return (
    <IonApp>
      <Routes />
    </IonApp>
  );
}

export default App;
