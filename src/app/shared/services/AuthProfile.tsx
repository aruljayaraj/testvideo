import axios from 'axios';
// import { Observable } from 'rxjs';

var AuthProfile = (function() {
    //var token = "";
  
    var getToken = function() {
      return localStorage.getItem('token');;    // Or pull this from cookie/localStorage
    };
  
    var setToken = function(token: string) {
      //token = token; 
      localStorage.setItem('token', token);    
    };

    var getUser = function() {
      const usr = JSON.parse(localStorage.getItem('user') || '{}');
      return Object.keys(usr).length !== 0? usr : '';    // Or pull this from cookie/localStorage
    };
  
    var setUser = function(user: string) {
      localStorage.setItem('user', JSON.stringify(user));    
    };

    var onGetToken = function(user: any, onGetTokenCb: any, onLoginCb: any) { // , testFn: any
      let result: any;
      axios.post(`jwt-auth/v1/token`, user )
        .then( (res: any) => { // console.log(res);
          if( res.status === 200 && res.statusText === 'OK'  ){
            setToken(res.data.token);
            result =  { 
              status: true, 
              type: 'success', 
              msg: 'Token retrieved successfully', 
              data: res.data,
              onLoginCb: onLoginCb,
              user: user
            };  
          }else{
            result = { 
              status: true, 
              type: 'error', 
              msg: 'Token not retrieved!y'
            };
          } 
          onGetTokenCb(result);
        })
        .catch( (error: any) => { // console.log(error, error.response);
          if( error.response.status === 403 ){
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
          }
          onGetTokenCb(result);
        });
    }

    var onLogin = function(user: any, onLoginCb: any) {
      let result: any;
      axios.post(`v2/login`, user )
        .then( (res: any) => { console.log(res);
          if( res.status === 200 && res.statusText === 'OK' && res.data.status === 'SUCCESS'  ){
            setUser(res.data);
            result =  { 
              status: true, 
              type: 'success', 
              msg: 'User LoggedIn successfully', 
              user: res.data 
            };  
          }else{
            return { 
              status: true, 
              type: 'error', 
              msg: 'User Not LoggedIn!'
            };
          }
          onLoginCb(result);
        })
        .catch( (error: any) => { console.log(error, error.response);
          if( error.response.status === 403 ){
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
          }
          onLoginCb(result);
        });
    }
  
    return {
      //getter/setter
      getToken: getToken,
      setToken: setToken,
      getUser: getUser,
      setUser: setUser,
      // server api
      onGetToken: onGetToken,
      onLogin: onLogin
    }
  
  })();
  
  export default AuthProfile;