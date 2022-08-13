import { createSlice } from '@reduxjs/toolkit';

const adsLocalData = JSON.parse(sessionStorage.getItem('ads') || '[]');
let state = {
    isdCodes: [],
    item: {},
    items: [],
    ads: Object.keys(adsLocalData).length !== 0? adsLocalData: []
}

const slice = createSlice({
    name: 'formdata',
    initialState: state,
    reducers: { 
        setFormData: (fdataState, action) => {
            if( action.payload.data && action.payload.key ){
                const data = action.payload.data;
                fdataState[action.payload.key] = data;
            }
        },
        setAds: (fdataState, action) => {  // console.log(fdataState); console.log(action.payload.ads);
            if( action.payload.ads ){
                fdataState.ads = action.payload.ads;
                sessionStorage.setItem('ads', JSON.stringify(fdataState.ads));
            }
        }
    }
});

export const {setFormData, setAds} = slice.actions;
export default slice.reducer;