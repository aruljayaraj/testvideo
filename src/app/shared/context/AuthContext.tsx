import React, {useState, createContext} from 'react';
import axios from 'axios';
import AuthProfile from '../../shared/services/AuthProfile';

export const Context = createContext<any>(undefined);
//const Login: React.FC = () => {
export const AuthProvider = ({ children }: { children : any }) => {
	const [authValue, setAuthValues] = useState({ 
        authenticated: false, 
        user: null 
    });
    const [token, setToken] = useState('');
    const [showToast, setShowToast] = useState({status: false, type: '', msg: ''});
    const [showLoading, setShowLoading] = useState(false);
    // const [resolve, setResolve] = useState(false);

    const onGetTokenFnCb = (res: any) => { console.log(res);
        if(res.status && res.type === 'success'){
            setToken(res.data.token);
            AuthProfile.onLogin(res.user, res.onLoginCb);
        }else{
            setShowLoading(false);
            setShowToast({ status: true, type: 'error', msg: res.msg });
        }
    }

    const onLoginFn = ({ username, password } : { username: string, password: string }, onLoginCb: any) => {
        const user = {
            username: username,
            password: password,
        };
       AuthProfile.onGetToken(user, onGetTokenFnCb, onLoginCb );
       //AuthProfile.onLogin(user, onLoginCb);
    };      

    const onLogoutFn = () => {
        /*setAuthValues({
            authenticated: false,
            user: null
        });
        return Promise.resolve(true);*/
    }
    // the store object
    let state = {
        token,
        authValue,
        setAuthValues,
        onLoginFn,
        onLogoutFn,
        showToast, 
        setShowToast,
        showLoading,
        setShowLoading
    };
    return <Context.Provider value={state}>{children}</Context.Provider>;
};

export default Context;