import { createSlice } from '@reduxjs/toolkit';
let state = {
    preResults: [],
    finalResults: []
}

const slice = createSlice({
    name: "search",
    initialState: state,
    reducers: { 
        setPreResults: (sState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                sState.preResults = data;
            }
        },
        setFinalResults: (sState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                sState.finalResults = data;
            }
        }
    }
});

export const {setPreResults, setFinalResults} = slice.actions;
export default slice.reducer;