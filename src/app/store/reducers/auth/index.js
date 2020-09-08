import { createSlice } from '@reduxjs/toolkit';

const tokenLocalData = sessionStorage.getItem('token') || '';
const userLocalData = JSON.parse(sessionStorage.getItem('auth') || '{}');
const menuLocalData = JSON.parse(sessionStorage.getItem('menu') || '{}');
const optionsLocalData = JSON.parse(sessionStorage.getItem('options') || '{}');
// return Object.keys(auth).length !== 0? auth.user : ''; 
let state = {};     
if( Object.keys(userLocalData).length !== 0 ){
    state = {
        ...state, 
        token: tokenLocalData,
        data: userLocalData,
        menu: menuLocalData,
        memOptions: optionsLocalData
    }; 
}else{
    state = {
        token: '',
        data: {
            authenticated: false,
            isVerified: false,
            user: {}
        },
        menu: {},
        memOptions:{}
    }
}

const slice = createSlice({
    name: "auth",
    initialState: state,
    reducers: {
        getToken: (state, action) =>  {
            // console.log(action);
        },
        setToken: (authState, action) => {
            if( action.payload.token ){
                //localStorage.setItem('token', action.payload.token);
                sessionStorage.setItem('token', JSON.stringify(action.payload.token)); 
                authState.token = action.payload.token;
            }
        },
        setUser: (authState, action) => { console.log(action.payload);
            const user = action.payload.user;
            if( user ){
                authState.data.user = user;
                authState.data.authenticated =  parseInt(user.approved) === 1? true: false;
                authState.data.isVerified = parseInt(user.email_verified) === 1? true : false;
                sessionStorage.setItem('auth', JSON.stringify(authState.data));
            }
        },
        signIn: (state, action) =>  {
            // console.log(action);
        },
        /*onSignup: (authState, action) =>  {
            const user = action.payload.data;
            if(data){
                authState.data.user = user;
                authState.data.authenticated =  parseInt(user.approved) === 1? true: false;
                authState.data.isVerified = parseInt(user.email_verified) === 1? true : false;
                sessionStorage.setItem('auth', JSON.stringify(authState.data)); 
            }
        },*/
        logout: (authState, action) => {
            authState.data = {};
            sessionStorage.removeItem('auth'); 
            sessionStorage.removeItem('options'); 
            sessionStorage.removeItem('menu');
        },
        onEmailVerify: (authState, action) => {
            authState.data.user = action.payload.user;
            authState.data.authenticated =  false;
            authState.data.isVerified = false;
            sessionStorage.setItem('auth', JSON.stringify(authState.data));
        },
        setMenu: (authState, action) => {
            if( action.payload.menu ){
                authState.menu = action.payload.menu;
                sessionStorage.setItem('menu', JSON.stringify(authState.menu));
            }
        },
        setMemOptions: (authState, action) => {
            if( action.payload.options ){
                authState.memOptions = action.payload.options;
                sessionStorage.setItem('options', JSON.stringify(authState.memOptions));
            }
        }
    }
});

export const {
    getToken, 
    setToken, 
    setUser,  
    signIn, 
    // onSignup, 
    logout, 
    onEmailVerify,
    setMenu,
    setMemOptions
} = slice.actions;
export default slice.reducer;