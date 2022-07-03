import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

/* Core CSS required for Ionic components to work properly */
// import 'bootstrap/scss/bootstrap.scss';
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import 'font-awesome/css/font-awesome.min.css';
import './theme/variables.css';
import './theme/styles.scss';

import createStore from './app/store/configureStore';
import { Provider } from 'react-redux';
import axios from 'axios';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

const store = createStore();

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL; // Beta
// axios.defaults.baseURL = 'http://localhost:8888/LocalFirst/trunk/rest/';
axios.defaults.baseURL = 'https://www.onagon.com/rest/';
//axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// console.log(process.env);

axios.interceptors.request.use(
    (request:any) => {
      if (!request.headers.Authorization) {
        const token = localStorage.getItem('token');
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
      }
      return request;
    },
    (error:any) => Promise.reject(error)
);


axios.interceptors.response.use((response: any) => {
    //console.log(response);
    // Edit response config
    return response;
}, (error: any) => {
    //console.log(error);
    return Promise.reject(error);
});

ReactDOM.render(
<Provider store={store}>
    <App />
</Provider>, document.getElementById('root'));

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);  // add this line

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
