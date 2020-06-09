import React, {useState, createContext} from 'react';
import AuthProfile from '../../shared/services/AuthProfile';

export const AuthContext = createContext<any>(undefined);
//const Login: React.FC = () => {
export const AuthProvider = ({ children }: { children : any }) => {
    const auth = AuthProfile.getAuth(); console.log(auth);
    const [authValues, setAuthValues] = useState({ 
        authenticated: auth? auth.authenticated: false, 
        user: auth? auth.user: null 
    });
	
    const [token, setToken] = useState('');
    const [showToast, setShowToast] = useState({isShow: false, status: '', message: ''});
    const [showLoading, setShowLoading] = useState(false);

    const onGetTokenFnCb = (res: any) => { console.log(res);
        if(res.status === 'SUCCESS'){
            setToken(res.token); // Store token to AuthContet
            const user = {
                // Login Only accepts email and password
                email: res.user.username,
                password: res.user.password,
            };
            AuthProfile.onLogin(user, res.onLoginCb);
        }else{
            setShowLoading(false);
            setShowToast({ isShow: true, status: res.status, message: res.message });
        }
    }

    const onLoginFn = ({ email, password } : { email: string, password: string }, onLoginCb: any) => {
        const user = {
            // JWT Only accepts username not email for login
            username: email,
            password: password,
        };
       AuthProfile.onGetToken(user, onGetTokenFnCb, onLoginCb );
    };      

    const onLogoutFn = () => {
        setAuthValues({
            authenticated: false,
            user: null
        });
        localStorage.setItem('auth', '');
    }
    // the store object
    let state = {
        token,
        authValues,
        setAuthValues,
        onLoginFn,
        onLogoutFn,
        showToast, 
        setShowToast,
        showLoading,
        setShowLoading
    };
    return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export default AuthContext;