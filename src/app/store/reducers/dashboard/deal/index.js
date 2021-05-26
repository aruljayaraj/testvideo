import { createSlice } from '@reduxjs/toolkit';
let state = {
    dailyDeal: {},
    dailyDeals: []
}

const slice = createSlice({
    name: "deals",
    initialState: state,
    reducers: {
        
        setDeal: (dState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                dState.dailyDeal = data;
            }
        },
        setBuscat: (dState, action) => {
            if( action.payload.data ){
                dState.dailyDeal.buscats = action.payload.data;
            }
        },
        setDeals: (dState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                dState.dailyDeals = data;
            }
        },
    }
});

export const {setDeal, setBuscat, setDeals} = slice.actions;
export default slice.reducer;