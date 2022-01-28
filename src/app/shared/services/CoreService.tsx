import axios from 'axios';
// import { Observable } from 'rxjs';

var CoreService = (function() {
 
    var onPostFn = function(fnname: string, data: any, callbackFn: any) {
      let result: any;
      axios.post(`v2/${fnname}`, data )
        .then( (res: any) => {
          result =  res.data; 
          callbackFn(result);
        })
        .catch( (error: any) => { // console.log(error);
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
          callbackFn(result);
        });
    }

    var onUploadFn = function(fnname: string, data: any, callbackFn: any) {
      let result: any;
      axios.post(`v2/${fnname}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then( (res: any) => {
          result =  res.data; 
          callbackFn(result);
        })
        .catch( (error: any) => { console.log(error);
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
          callbackFn(result);
        });
    }

    var onPostsFn = function(fnname: string, data: any) {
      return axios.post(`v2/${fnname}`, data );
    }

    var onGetFn = function(fnname: string) {
      return axios.get(`${fnname}`);
    }
  
    return {
      // server api
      onPostFn: onPostFn,
      onUploadFn: onUploadFn,
      onGetFn: onGetFn,
      onPostsFn: onPostsFn // without callback
    }
  
  })();
  
  export default CoreService;