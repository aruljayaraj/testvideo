import { createSlice } from '@reduxjs/toolkit';
let state = {
    resource: {},
    resources: []
}

const slice = createSlice({
    name: 'res',
    initialState: state,
    reducers: { 
        setResource: (resState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                resState.resource = data;
            }
        },
        setBuscat: (resState, action) => {
            if( action.payload.data ){
                resState.resource.buscats = action.payload.data;
            }
        },
        setResources: (resState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                resState.resources = data;
            }
        },
    }
});

export const {setResource, setBuscat, setResources} = slice.actions;
export default slice.reducer;