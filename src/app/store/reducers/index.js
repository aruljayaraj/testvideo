import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './ui';
import authReducer from './auth';
import repReducer from './dashboard/rep';
import prReducer from './dashboard/pr';
import resReducer from './dashboard/resource';
import dealReducer from './dashboard/deal';
import qqReducer from './dashboard/qq';
import formdataReducer from './common';
import searchReducer from './search';

const allReducers = combineReducers({
    ui: uiReducer,
    auth: authReducer,
    rep: repReducer,
    pr: prReducer,
    res: resReducer,
    deals: dealReducer,
    qq: qqReducer,
    formdata: formdataReducer,
    search: searchReducer
});

export default allReducers;