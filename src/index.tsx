import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

/* Core CSS required for Ionic components to work properly */
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
import './theme/variables.css';
import './theme/styles.scss';

import { AuthProvider } from './app/shared/context/AuthContext';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8888/LocalFirst/trunk/rest/'; // local
//axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(
    request => {
      if (!request.headers.Authorization) {
        const token = localStorage.getItem("token");
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
      }
      return request;
    },
    error => Promise.reject(error)
);


axios.interceptors.response.use(response => {
    //console.log(response);
    // Edit response config
    return response;
}, error => {
    //console.log(error);
    return Promise.reject(error);
});

ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider>
, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
