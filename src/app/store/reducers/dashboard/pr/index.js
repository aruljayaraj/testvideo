import { createSlice } from '@reduxjs/toolkit';
let state = {
    pressRelease: {},
    pressReleases: []
}

const slice = createSlice({
    name: 'pr',
    initialState: state,
    reducers: {
        
        setPressRelease: (prState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                prState.pressRelease = data;
            }
        },
        setBuscat: (prState, action) => {
            if( action.payload.data ){
                prState.pressRelease.buscats = action.payload.data;
            }
        },
        setPressReleases: (prState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                prState.pressReleases = data;
            }
        },
    }
});

export const {setPressRelease, setBuscat, setPressReleases} = slice.actions;
export default slice.reducer;