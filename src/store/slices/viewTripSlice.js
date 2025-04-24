import { createSlice } from "@reduxjs/toolkit";
import { set } from "lodash";

const viewSlice = createSlice({
    name: 'viewTrip',
    initialState: {
        tripDetails: null

    },
    reducers: {
        setTripDetailsToStore: (state, action) => {
            if (action.payload.tripDetailsInBill) {

                set(state, 'tripDetails', action.payload.tripDetailsInBill)
            }
        }
    }

}
)
export const { setTripDetailsToStore } = viewSlice.actions;
export default viewSlice.reducer;