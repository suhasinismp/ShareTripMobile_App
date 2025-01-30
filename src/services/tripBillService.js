import { getAPI, patchFormDataAPI } from '../utils/servicesUtil';
import store from '../store/store.js';
import { setTripBillToStore } from '../store/slices/tripBillSlice.js';

export const fetchTripBill = async (postId, token) => {
  const response = await getAPI(
    `share-trip/trip-sheet-final/based-post-booking-id/${postId}`,
    token,
  );

  store.dispatch(setTripBillToStore({ tripInBill: response.data }))
  return response;
};


export const updateTripBill = async (data, token) => {
  const response = await patchFormDataAPI({
    endUrl: 'share-trip/trip-sheet-final/',
    formData: data,
    token: token,
  })


  return response;
}