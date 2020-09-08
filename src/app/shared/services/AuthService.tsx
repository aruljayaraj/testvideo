import axios from 'axios';
// import { Observable } from 'rxjs';

var AuthService = (function() {
    //var token = "";
  
    var getToken = function() {
      return localStorage.getItem('token');    // Or pull this from localStorage
    };
  
    var setToken = function(token: string) {
      //token = token; 
      localStorage.setItem('token', token);    
    };

    var getUser = function() {
      const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
      return Object.keys(auth).length !== 0? auth.user : '';    // Or pull this from session Storage
    };
  
    var setAuth = function(auth: any) {
      sessionStorage.setItem('auth', JSON.stringify(auth));    
    };
    var getAuth = function() {
      const auth = JSON.parse(sessionStorage.getItem('auth') || '{}');
      return Object.keys(auth).length !== 0? auth : '';    // Or pull this from cookie/localStorage
    };

    var onGetToken = function(user: any, onGetTokenCb: any) { // , onLoginCb: any
      let result: any;
      axios.post(`jwt-auth/v1/token`, user )
        .then( (res: any) => {  console.log(res);
          if( res.status === 200 && res.statusText === 'OK'  ){
            setToken(res.data.token);
            result =  { 
              status: 'SUCCESS', 
              message: 'Token retrieved successfully', 
              token: res.data.token,
              // onLoginCb: (onLoginCb !== undefined || onLoginCb !== null)? onLoginCb: null,
              user: user // For Login Callback sent it to back
            };  
          }else{
            result = {
              status: 'ERROR', 
              message: 'Token not retrieved!'
            };
          }
          // if (onGetTokenCb !== undefined || onGetTokenCb !== null){
          if (onGetTokenCb){
            onGetTokenCb(result);
          }
        })
        .catch( (error: any) => { console.log(error.response);
          console.log(error.message); 
          let message = '';
          if( error.response ){
            if( error.response.data.code === '[jwt_auth] invalid_email' ){
              message = '<strong>Error</strong>: Invalid Email / Email you entered is not registered with us!';
            } else if( error.response.data.code === '[jwt_auth] incorrect_password' ){
              message = '<strong>Error</strong>: The password you entered for the email address is incorrect.';
            }
          }else{
            message = error.message
          } 
          result = { 
            status: 'ERROR', 
            message: message
          };
          if (onGetTokenCb){
            onGetTokenCb(result);
          }
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
          let message = '';
          if( error.response ){
            if( error.response.data.code === '[jwt_auth] invalid_email' ){
              message = '<strong>Error</strong>: Invalid Email / Email you entered is not registered with us!';
            } else if( error.response.data.code === '[jwt_auth] incorrect_password' ){
              message = '<strong>Error</strong>: The password you entered for the email address is incorrect.';
            }
          }else{
            message = error.message
          } 
          result = { 
            status: 'ERROR', 
            message: message
          };
          onLoginCb(result);
        });
    }

    var onSignup = function(user: any, onSignupCb: any) {
      let result: any;
      axios.post(`v2/signup`, user )
        .then( (res: any) => { console.log(res);
          result =  res.data; 
          onSignupCb(result);
          if( res.data.status === 'SUCCESS' ){
            const cusdata = {
              // JWT Only accepts username not email for login
              username: user.email,
              password: user.password,
            };
            onGetToken(cusdata, null);
          }
        })
        .catch( (error: any) => { console.log(error);
          console.log(error.message);
          result = { 
            status: 'ERROR', 
            msg: error.message
          };
          onSignupCb(result);
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
  
  export default AuthService;