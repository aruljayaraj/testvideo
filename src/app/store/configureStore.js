import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from './reducers';
import createSagaMiddleware from 'redux-saga';
import rootWatchers from './root-saga';

export default function(){
    const sagaMiddleware = createSagaMiddleware();
    const middleware = [...getDefaultMiddleware({    
        /*serializableCheck: {
            // Ignore these action types
            ignoredActions: ['auth/getToken', 'jwt-auth/v1/token'],
            // Ignore these field paths in all actions
            // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
            // Ignore these paths in the state
            // ignoredPaths: ['items.dates']
        }*/
        serializableCheck: false
    }), sagaMiddleware];
    const store = configureStore({
        reducer,
        middleware
    });
    store.runSaga = sagaMiddleware.run(rootWatchers);
    return store;
}
