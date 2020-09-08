import React from 'react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
// import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

// import Home from '../Home/Home';
// import Login from '../Login/Login';
// import NoPage from '../NoPage/NoPage'; 
import Dashboard from './Dashboard/Dashboard';
import RepProfile from './RepProfile/RepProfile';
import CompanyProfile from './CompanyProfile/CompanyProfile';


const Layout: React.FC = () => {
    let { path, url } = useRouteMatch();
    return (
        <Switch>
            
            <Route path={`${url}/dashboard`} component={Dashboard} exact={true} />
            <Route path={`${url}/rep-profile`} component={RepProfile} exact={true} />
            <Route path={`${url}/company-profile`} component={CompanyProfile} exact={true} />
            {/* <Route path={`${baseURL}/layout/dashboard`} component={Dashboard} exact={true} /> */}
            {/* <Route path="/layout/" component={Layout} exact={true} /> */}
            {/* <Route exact path="/" component={Home} /> */}
            {/* <Route path="*" component={NoPage} /> */}
            <Route path="/layout" render={() => <Redirect to={`${url}/dashboard`} />} />
        </Switch>

    );
}

export default Layout;