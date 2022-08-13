import { createSlice } from '@reduxjs/toolkit';
let state = {
    preResults: [],
    finalResults: [],
    companyResults: [],
    homeResults: {
        items: [],
        total: 0
    }
}

const slice = createSlice({
    name: 'search',
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
        },
        setCompanyResults: (sState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                sState.companyResults = data;
            }
        },
        setHomeResults: (sState, action) => { console.log("Meow",sState);
            let data;
            if( action.payload.data ){
                if( action.payload.actionFrom === 'loadmore' ){
                    data = [...sState.homeResults.items, ...action.payload.data];
                }else{
                    data = action.payload.data;
                }
                sState.homeResults.items = data;
                sState.homeResults.total = action.payload.total;

                /*if( action.payload.pageAds && action.payload.pageAds.length > 0 ){ 
                    sState.homeResults.pageAds = action.payload.pageAds;
                }*/
            }
        }
    }
});

export const {setPreResults, setFinalResults, setCompanyResults, setHomeResults} = slice.actions;
export default slice.reducer;