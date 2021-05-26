import axios from 'axios';
export const getToken = async (user) => {
    try{
        const response = await axios.request({
            method: 'POST',
            url: `jwt-auth/v1/token`, 
            data: user }); // console.log(response);
        return response.data;
    }catch(error){
        return error;
    }
}

export const onLogin = async (user) => {
    try{
        const response = await axios.request({
            method: 'POST',
            url: `v2/login`, 
            data: user }); // console.log(response);
        return response.data;
    }catch(error){
        return error;
    }
}

export const onSignup = async (user) => {
    try{
        const response = await axios.request({
            method: 'POST',
            url: `v2/signup`, 
            data: user }); // console.log(response);
        return response.data;
    }catch(error){
        return error;
    }
}