import { createSlice } from '@reduxjs/toolkit';
let state = {
    isdCodes: [],
    item: {},
    items: []
}

const slice = createSlice({
    name: "formdata",
    initialState: state,
    reducers: { 
        setFormData: (fdataState, action) => {
            if( action.payload.data && action.payload.key ){
                const data = action.payload.data;
                fdataState[action.payload.key] = data;
            }
        }
    }
});

export const {setFormData} = slice.actions;
export default slice.reducer;