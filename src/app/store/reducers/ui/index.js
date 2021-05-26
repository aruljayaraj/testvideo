import { createSlice } from '@reduxjs/toolkit';

const state = {
    loading: { showLoading: false },
    skeleton: { showSkeleton: false  },
    toast: {isShow: false, status: '', message: ''}
}

const slice = createSlice({
    name: "ui",
    initialState: state,
    reducers: {
        setShowLoading: (uiState, action) => {
            uiState.loading.showLoading = action.payload.loading;
            if(action.payload.msg){
                uiState.loading.msg = action.payload.msg;
            }
        },
        setShowSkeleton: (uiState, action) => {
            uiState.skeleton.showSkeleton = action.payload.skeleton;
        },
        setShowToast: (uiState, action) => {
            uiState.toast.isShow = action.payload.isShow;
            uiState.toast.status = action.payload.status;
            uiState.toast.message = action.payload.message;
        }
    }
});

export const {setShowLoading, setShowSkeleton, setShowToast} = slice.actions;
export default slice.reducer;