import { createSlice } from '@reduxjs/toolkit';
let state = {
    localDeal: {},
    localDeals: {
        deals: [],
        unpaid: []
    }
}

const slice = createSlice({
    name: 'deals',
    initialState: state,
    reducers: {
        
        setDeal: (dState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                dState.localDeal = data;
            }
        },
        setBuscat: (dState, action) => {
            if( action.payload.data ){
                dState.localDeal.buscats = action.payload.data;
            }
        },
        setDeals: (dState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                dState.localDeals = data;
            }
        },
    }
});

export const {setDeal, setBuscat, setDeals} = slice.actions;
export default slice.reducer;