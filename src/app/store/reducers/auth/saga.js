import { put, call, takeEvery, delay } from "redux-saga/effects";
import * as api from '../../api';
// import * as actions from "./actions";
import * as authActions from './index';
import * as uiActions from '../ui';

function* tokenAction(action) {
    yield put(uiActions.setShowLoading({loading: true}));
    yield delay(1000); 
    try {
        const tokenData = yield call(api.getToken, action.payload.data);
        yield put(authActions.setToken(tokenData));
        if( action.payload.data.action === 'login' ){
            const user = {
                // Login Only accepts email and password
                email: action.payload.data.username,
                password: action.payload.data.password,
            };
            const res = yield call(api.onLogin, user);
            if( res.user ) yield put(authActions.setUser({user: res.user}));
            if(res.menu) yield put(authActions.setMenu({menu: res.menu}));
            if( res.memOpts ) yield put(authActions.setMemOptions({ options: res.memOpts}));
            yield put(uiActions.setShowLoading({loading: false}));
            yield put(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        }else{
            yield put(uiActions.setShowLoading({loading: false}));
            yield put(uiActions.setShowToast({ isShow: true, status: 'SUCCESS', message: 'Token retrieved successfully!' }));
        }
     } catch (e) { console.log(e);
        yield put(uiActions.setShowLoading({loading: false}));
        yield put(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Token retrieve failed!' }));
     }
    
}
function* signUpAction(action) {
    yield put(uiActions.setShowLoading({loading: true}));
    yield delay(1000); 
    try {
        const res = yield call(api.onSignup, action.payload.data);
        if( res.status === 'SUCCESS' ){
            yield put(authActions.setUser(res));
            // Get Token for Signup Users
            const user = {
                // JWT Only accepts username and password
                username: action.payload.data.email,
                password: action.payload.data.password,
            };
            const tokenData = yield call(api.getToken, user);
            yield put(authActions.setToken(tokenData)); console.log(res.user);
             
        }    
        yield put(uiActions.setShowLoading({loading: false}));
        yield put(uiActions.setShowToast({ isShow: true, status: res.status, message: res.message }));
        
    } catch (e) { console.log(e);
        yield put(uiActions.setShowLoading({loading: false}));
        yield put(uiActions.setShowToast({ isShow: true, status: 'ERROR', message: 'Signup failed!' }));
    }
    
}


export function* tokenWatchers() { // console.log('token watchers');
    yield takeEvery(authActions.getToken, tokenAction);
}

export function* signUpWatchers() { // console.log('signUp watchers');
    yield takeEvery(authActions.signIn, signUpAction);
}
