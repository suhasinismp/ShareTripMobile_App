import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOnline: true,
    showOnlyAvailable: false
};

const statusOnlineSlice = createSlice({
    name: 'onlineStatus',
    initialState,
    reducers: {
        setOnlineStatus: (state, action) => {
            state.isOnline = action.payload;
        },
        setShowOnlyAvailable: (state, action) => {
            state.showOnlyAvailable = action.payload;
        }
    }
});

export const { setOnlineStatus, setShowOnlyAvailable } = statusOnlineSlice.actions;
export default statusOnlineSlice.reducer;