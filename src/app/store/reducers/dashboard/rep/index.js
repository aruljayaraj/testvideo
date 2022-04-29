import { createSlice } from '@reduxjs/toolkit';

const menuLocalData = JSON.parse(sessionStorage.getItem('menu') || '{}');
const repLocalData = JSON.parse(sessionStorage.getItem('rep') || '{}');
const notificationData = JSON.parse(sessionStorage.getItem('notifications') || '{}'); 
let state = {};     
if( Object.keys(repLocalData).length !== 0 ){
    state = {
        ...state, 
        menu: menuLocalData,
        rep: repLocalData,
        notifications: Object.keys(notificationData).length !== 0? notificationData.messages: {},
        notificationsCount: Object.keys(notificationData).length !== 0? notificationData.count: 0,
    };  // console.log(notificationData.messages);
}else{
    state = {
        repProfile: {},
        comProfile: {},
        user:{},
        usermeta: {},
        buscats:{},
        reps: [],
        notifications: {},
        notificationsCount: 0
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
        },
        setNotifications: (repState, action) => {
            if( action.payload.data ){ // console.log(action.payload.data);
                repState.notifications = action.payload.data;
                let totalCount = Object.keys(repState.notifications).reduce((prev, curr) => { 
                    // console.log(prev, repState.notifications[curr].length);
                    return prev + repState.notifications[curr].length; 
                }, 0);
                repState.notificationsCount = totalCount;  
                /*let notifydata = {
                    messages: repState.notifications,
                    count: totalCount
                };  console.log(notifydata);
                // sessionStorage.setItem('notifications', JSON.stringify(notifydata)); */
            }
        }
    }
});

export const {setMemberProfile, setCompanyProfile, setRepProfile, setBuscats, setNotifications} = slice.actions;
export default slice.reducer;