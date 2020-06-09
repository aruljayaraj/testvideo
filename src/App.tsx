import React, {useState, useContext} from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, 
  IonRouterOutlet,
  IonContent
 } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './app/pages/Home/Home';
import Login from './app/pages/Login/Login';

import Header from './app/components/Header/Header';
import Footer from './app/components/Footer/Footer';
import Dashboard from './app/pages/Layout/Dashboard/Dashboard';
import Signup from './app/pages/Signup/Signup';
//import AuthContext from './app/shared/context/AuthContext';

const App: React.SFC = () => {
  // const { authValues } = useContext(AuthContext);
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  /*function onLogin(status: boolean) {
    console.log("I Love you", {status});
    setIsLoggedIn(status);
  };*/

  return (
    <IonApp>
      <IonReactRouter>
      <Header />
      <IonContent>
          <IonRouterOutlet>
            <Route path="/" component={Home} exact={true} />
            <Route path="/login" component={Login} exact={true} />
            <Route path="/signup" component={Signup} exact={true} />
            <Route path="/layout/dashboard" component={Dashboard} exact={true} />
            {/* <Route path="/layout/" component={Layout} exact={true} /> */}
            {/* <Route path="*" render={() => <Redirect to="/home" />} /> */}
          </IonRouterOutlet>
      </IonContent>
      <Footer/>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
