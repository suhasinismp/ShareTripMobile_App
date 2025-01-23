import { createSlice } from '@reduxjs/toolkit'
import { set } from "lodash"

const tripBillSlice = createSlice({
    name: 'tripBill',
    initialState: {
        data: null

    },
    reducers: {
        setTripBillToStore: (state, action) => {
            if (action.payload.tripInBill)

                set(state, 'data', action.payload.tripInBill)
        }
    }
}


)
export const { setTripBillToStore } = tripBillSlice.actions;
export default tripBillSlice.reducer;
