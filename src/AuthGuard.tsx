import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute: React.FC<any> = ({component: Component, ...rest}) => {
    const authUser = useSelector( (state:any) => state.auth.data);
    return (
      <Route
        {...rest}
        render={(props) => (authUser.authenticated === true && authUser.isVerified === true && authUser.user)
          ? <Component {...props} />
          : <Redirect to={{pathname: '/login'}} />}
      />
    )
}
export default PrivateRoute;