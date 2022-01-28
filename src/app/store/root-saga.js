import { tokenWatchers, signUpWatchers } from './reducers/auth/saga';
import { all } from 'redux-saga/effects';

export default function* rootWatchers() {
    yield all([tokenWatchers(), signUpWatchers()]);
}
