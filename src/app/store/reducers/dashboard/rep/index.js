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
        buscats:{},
        reps: []
    }
}

const slice = createSlice({
    name: 'rep',
    initialState: state,
    reducers: {
        
        setMemberProfile: (repState, action) => {
            //sessionStorage.setItem('rep', JSON.stringify(action.payload.token)); 
            const data = action.payload.data;
            repState.repProfile = data.repProfile;
            repState.comProfile = data.comProfile;
            repState.user = data.member;
            repState.reps = data.reps;
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
        setBuscats: (repState, action) => {
            if( action.payload.data ){
                repState.buscats = action.payload.data;
            }
        }
    }
});

export const {setMemberProfile, setCompanyProfile, setRepProfile, setBuscats} = slice.actions;
export default slice.reducer;