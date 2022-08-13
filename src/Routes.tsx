import React, { Suspense } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import { IonContent } from '@ionic/react';

import Home from './app/pages/Home/Home';
import NoPage from './app/pages/NoPage/NoPage'; 
import Header from './app/components/Header/Header';
import Footer from './app/components/Footer/Footer';
import AboutUs from './app/pages/AboutUs/AboutUs';
import PrivacyPolicy from './app/pages/PrivacyPolicy/PrivacyPolicy';

const Routes: React.FC = () => {
      
    return (
      // <DebugRouter>
    <Router basename={process.env.REACT_APP_BASENAME}>
        <Suspense fallback={<div><h1>Loading...</h1></div>}>
          <Header />
          <IonContent>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/about-us" component={AboutUs} exact={true} />
                <Route path="/privacy-policy" component={PrivacyPolicy} exact={true} />
                
                <Route path="*" component={NoPage} />
            </Switch>
        </IonContent>
        <Footer/>
      </Suspense>  
    </Router>
    // </DebugRouter>
    );
}

export default Routes;
