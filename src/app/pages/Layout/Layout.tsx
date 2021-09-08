import React from 'react';
import { Route, Switch, Redirect, useRouteMatch } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import RepProfile from './RepProfile/RepProfile';
import CompanyProfile from './CompanyProfile/CompanyProfile';

const Layout: React.FC = () => {
    let { url } = useRouteMatch();
    return (
        <Switch>
            <Route path={`${url}/dashboard`} component={Dashboard} exact={true} />
            <Route path={`${url}/rep-profile`} component={RepProfile} exact={true} />
            <Route path={`${url}/company-profile`} component={CompanyProfile} exact={true} />
            <Route path="/layout" render={() => <Redirect to={`${url}/dashboard`} />} />
        </Switch>
    );
}

export default Layout;