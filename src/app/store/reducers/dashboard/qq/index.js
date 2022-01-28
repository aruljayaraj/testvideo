import { createSlice } from '@reduxjs/toolkit';
import { modifyFiles } from './uploadFile.utils'
let state = {
    localQuote: {},
    localQuotes: [],
    quotation: {},
    quotations: [],
    unit_measure: [],
    fileProgress: {}
}

const slice = createSlice({
    name: 'qq',
    initialState: state,
    reducers: { 
        setQQ: (qqState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                qqState.localQuote = data;
            }
        },
        setQQs: (qqState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                qqState.localQuotes = data;
            }
        },
        setSQ: (qqState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                qqState.quotation = data;
            }
        },
        setSQs: (qqState, action) => {
            if( action.payload.data ){
                const data = action.payload.data;
                qqState.quotations = data;
            }
        },
        setBuscat: (qqState, action) => {
            if( action.payload.data ){
                qqState.localQuote.buscats = action.payload.data;
            }
        },
        setUnitMeasure: (qqState, action) => {
            if( action.payload.data ){
                qqState.unit_measure = action.payload.data;
            }
        },
        fileProgress: (qqState, action) => { 
            let fileProgress = {};
            if( Object.keys(qqState.fileProgress).length > 0 ){
                fileProgress = qqState.fileProgress;
            }
            if(Object.keys(action.payload.data).length > 0){ 
                qqState.fileProgress = modifyFiles(fileProgress, action.payload.data);
            }else{ // Need to reset once upload queues done
                qqState.fileProgress = {};
            }
        },
        setUploadProgress: (qqState, action) => { //console.log(action.payload);
            if(action.payload.id && Object.keys(qqState.fileProgress).length > 0){
                if(qqState.fileProgress[action.payload.id]){
                    qqState.fileProgress[action.payload.id].percentage = action.payload.percentage;
                    //console.log(qqState.fileProgress[action.payload.id]);
                }
            }
        }
    }
});

export const {setQQ, setQQs, setBuscat, setSQ, setSQs, setUnitMeasure, fileProgress, setUploadProgress} = slice.actions;
export default slice.reducer;