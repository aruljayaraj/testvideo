import { createSlice } from '@reduxjs/toolkit';

const menuLocalData = JSON.parse(sessionStorage.getItem('menu') || '{}');
const repLocalData = JSON.parse(sessionStorage.getItem('rep') || '{}');
let state = {};     
if( Object.keys(repLocalData).length !== 0 ){
    state = {
        ...state, 
        menu: menuLocalData,
        rep: repLocalData
    }; 
}else{
    state = {
        repProfile: {},
        comProfile: {},
        user:{},
        usermeta: {},
        b2b:{},
        b2c:{}
    }
}

const slice = createSlice({
    name: "rep",
    initialState: state,
    reducers: {
        
        setMemberProfile: (repState, action) => {
            //sessionStorage.setItem('rep', JSON.stringify(action.payload.token)); 
            const data = action.payload.data;
            repState.repProfile = data.repProfile;
            repState.comProfile = data.comProfile;
            repState.user = data.member;
            // repState.usermeta = data.meta_member;
        },
        setCompanyProfile: (repState, action) => {
            if( action.payload.data ){
                repState.comProfile = action.payload.data;
            }
        },
        setRepProfile: (repState, action) => {
            if( action.payload.data ){
                repState.repProfile = action.payload.data;
            }
        },
        setB2B: (repState, action) => {
            if( action.payload.data ){
                repState.b2b = action.payload.data;
            }
        },
        setB2C: (repState, action) => {
            if( action.payload.data ){
                repState.b2c = action.payload.data;
            }
        }
    }
});

export const {setMemberProfile, setCompanyProfile, setRepProfile, setB2B, setB2C} = slice.actions;
export default slice.reducer;