
import { createSlice } from "@reduxjs/toolkit";
import { set } from 'lodash';

const billSlice = createSlice({
    name: 'bill',
    initialState: {
        myDutiesBillData: null,
        postedBillData: null,
        selfTripBillData: null,
    },

    reducers: {
        setTripDataToStore: (state, action) => {


            if (action.payload.myDutiesBill) {
                set(state, 'myDutiesBillData', action.payload.myDutiesBill);
            }
            if (action.payload.postedTripBill) {

                set(state, 'postedBillData', action.payload.postedTripBill);
            }

            if (action.payload.selfTripBill) {

                set(state, 'selfTripBillData', action.payload.selfTripBill);
            }
        }
    }
})
export const { setTripDataToStore } = billSlice.actions;
export default billSlice.reducer;

