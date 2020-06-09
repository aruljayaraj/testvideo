import axios from 'axios';
// import { Observable } from 'rxjs';

var AuthProfile = (function() {
    //var token = "";
  
    var getToken = function() {
      return localStorage.getItem('token');;    // Or pull this from cookie/localStorage
    };
  
    var setToken = function(token: string) { console.log(token);
      //token = token; 
      localStorage.setItem('token', token);    
    };

    var getUser = function() {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      return Object.keys(auth).length !== 0? auth.user : '';    // Or pull this from cookie/localStorage
    };
  
    var setAuth = function(auth: any) {
      localStorage.setItem('auth', JSON.stringify(auth));    
    };
    var getAuth = function() {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      return Object.keys(auth).length !== 0? auth : '';    // Or pull this from cookie/localStorage
    };

    var onGetToken = function(user: any, onGetTokenCb: any, onLoginCb: any) { // , testFn: any
      let result: any;
      axios.post(`jwt-auth/v1/token`, user )
        .then( (res: any) => {  console.log(res);
          if( res.status === 200 && res.statusText === 'OK'  ){
            setToken(res.data.token);
            result =  { 
              status: 'SUCCESS', 
              message: 'Token retrieved successfully', 
              token: res.data.token,
              onLoginCb: onLoginCb,
              user: user // For Login Callback sent it to back
            };  
          }else{
            result = {
              status: 'ERROR', 
              message: 'Token not retrieved!'
            };
          }
          onGetTokenCb(result);
        })
        .catch( (error: any) => {
          console.log(error.message);
          result = { 
            type: 'ERROR', 
            msg: error.message
          };
          onGetTokenCb(result);
          /*if( error.response.status === 403 ){
            result = { 
              status: true, 
              type: 'error', 
              msg: 'Invalid Login Credentials'
            };
          }else{
            result =  { 
              status: true, 
              type: 'error', 
              msg: 'Something went wrong! Try again.'
            };
          }*/
        });
    }

    var onLogin = function(user: any, onLoginCb: any) {
      let result: any;
      axios.post(`v2/login`, user )
        .then( (res: any) => { console.log(res);
          result =  { 
            status: res.data.status, 
            message: res.data.message,  
            user: res.data.user
          };
          onLoginCb(result);
        })
        .catch( (error: any) => {
          console.log(error.message);
          result = { 
            type: 'ERROR', 
            msg: error.message
          };
          onLoginCb(result);
          /*if( error.response.status === 403 ){
            result = { 
              status: true, 
              type: 'error', 
              msg: 'Invalid Login Credentials'
            };
          }else{
            result = { 
              status: true, 
              type: 'error', 
              msg: 'Something went wrong! Try again.'
            };
          }*/
        });
    }

    var onSignup = function(user: any, onSignupCb: any) {
      let result: any;
      axios.post(`v2/signup`, user )
        .then( (res: any) => { console.log(res);
          result =  res.data; 
          onSignupCb(result);
        })
        .catch( (error: any) => { console.log(error);
          console.log(error.message);
          result = { 
            type: 'ERROR', 
            msg: error.message
          };
          onSignupCb(result);
          /*if( error && error.response.status === 403 ){
            result = {  
              type: 'error', 
              msg: 'User Not Registered!'
            };
          }else{
            result = { 
              type: 'error', 
              msg: 'Something went wrong! Try again.'
            };
          }*/
        });
    }
  
    return {
      //getter/setter
      getToken: getToken,
      setToken: setToken,
      getUser: getUser,
      setAuth: setAuth,
      getAuth: getAuth,
      // server api
      onGetToken: onGetToken,
      onLogin: onLogin,
      onSignup: onSignup
    }
  
  })();
  
  export default AuthProfile;