import { getAPI, patchAPI, patchFormDataAPI } from '../utils/servicesUtil';
import store from '../store/store.js';
import { setTripBillToStore } from '../store/slices/tripBillSlice.js';

export const fetchTripBill = async (postId, token) => {
  const response = await getAPI(
    `share-trip/editable-details/based-post-booking-id/${postId}`,
    token,
  );
  console.log('abc', response)
  store.dispatch(setTripBillToStore({ tripInBill: response.data }))
  return response;
};
export const fetchTripSingleEditBill = async (postId, token) => {
  const response = await getAPI(
    `share-trip/editable-details/${postId}`,
    token,
  );
  // console.log('abc', `share-trip/editable-details/${postId}`)
  store.dispatch(setTripBillToStore({ tripInBill: response.data }))
  return response;
};


// export const updateTripDetailsTable = async (data, token) => {
//   const response = await patchAPI({
//     endUrl: 'share-trip/trip-sheet-ride/',
//     token: token,
//   })
// }

export const updateTripBill = async (data, token) => {
  const response = await patchFormDataAPI(
    'share-trip/trip-sheet-final/',
    data,
    token,
  )

  return response;
}

export const updateTripBillScreen = async (data, token) => {
  console.log(data, token)
  const response = await patchAPI({
    endUrl: 'share-trip/editable-details/',
    body: data,
    token: token
  })

  console.log('yyy', response)
  return response;
}