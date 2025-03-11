import { createSlice } from "@reduxjs/toolkit";

const selfTripSlice = createSlice({
    name: 'selfTrip',
    initialState: {
        tripDetails: null,
        loading: false,
        error: null
    },
    reducers: {
        setSelfTripDetails: (state, action) => {
            state.tripDetails = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearSelfTripDetails: (state) => {
            state.tripDetails = null;
            state.error = null;
        }
    }
});

export const { setSelfTripDetails, setLoading, setError, clearSelfTripDetails } = selfTripSlice.actions;
export default selfTripSlice.reducer;