import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './ui';
import authReducer from './auth';
import repReducer from './dashboard/rep';
import prReducer from './dashboard/pr';
import resReducer from './dashboard/resource';

const allReducers = combineReducers({
    ui: uiReducer,
    auth: authReducer,
    rep: repReducer,
    pr: prReducer,
    res: resReducer
});

export default allReducers;