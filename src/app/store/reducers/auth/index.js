import { createSlice } from '@reduxjs/toolkit';

const tokenLocalData = sessionStorage.getItem('token') || '';
const userLocalData = JSON.parse(sessionStorage.getItem('auth') || '{}');
const menuLocalData = JSON.parse(sessionStorage.getItem('menu') || '{}');
const optionsLocalData = JSON.parse(sessionStorage.getItem('options') || '{}');
// console.log(JSON.parse(localStorage.getItem('location')));
const locationLocalData = JSON.parse(localStorage.getItem('location') || '{}');
    // console.log(Object.keys(locationLocalData).length !== 0? locationLocalData: {});
let state = {
    token: Object.keys(tokenLocalData).length !== 0? tokenLocalData: '',
    data: Object.keys(userLocalData).length !== 0? userLocalData: {
        authenticated: false,
        isVerified: false,
        user: {}
    },
    menu: Object.keys(menuLocalData).length !== 0? menuLocalData: {},
    memOptions: Object.keys(optionsLocalData).length !== 0? optionsLocalData: {},
    location: Object.keys(locationLocalData).length !== 0? locationLocalData: {}
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
        setUser: (authState, action) => { // console.log(action.payload);
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
        },
        setDealsCountUpdate: (authState, action) => {
            if( action.payload.total ){
                const memOptions = {
                    ...authState.memOptions,
                    localdeals: {
                        ...authState.memOptions.localdeals,
                        total: action.payload.total
                    }
                };
                authState.memOptions = memOptions;
                sessionStorage.setItem('options', JSON.stringify(authState.memOptions));
            }
        },
        setLocation: (authState, action) => {
            if( action.payload.location ){
                authState.location = action.payload.location;
                localStorage.setItem('location', JSON.stringify(authState.location));
            }
        }
    }
});

export const {
    getToken, 
    setToken, 
    setUser,  
    signIn, 
    logout, 
    onEmailVerify,
    setMenu,
    setMemOptions,
    setDealsCountUpdate,
    setLocation
} = slice.actions;
export default slice.reducer;