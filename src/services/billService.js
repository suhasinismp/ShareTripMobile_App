


import { getAPI } from '../utils/servicesUtil';
import store from '../../src/store/store';
import { setTripDataToStore } from '../../src/store/slices/billSlice'; // Import the action

export const getMyDutiesBill = async (userId, token) => {
  try {
    const response = await getAPI(
      `share-trip/post-trip-confirm/completed-trips?filter=myDuties&user_id=${userId}`,
      token,
    );

    if (response?.error === false) {
      // Dispatch the data to store if response is successful
      store.dispatch(setTripDataToStore({ myDutiesBill: response?.data || [] }));
    }

    return response;
  } catch (error) {
    console.error('Error fetching My Duties bills:', error);
  }
};

export const getMyPostedTripBills = async (userId, token) => {
  try {
    const response = await getAPI(
      `share-trip/posted-user/completed-trips?filter=posted&user_id=${userId}`,
      token,
    );

    if (response?.error === false) {
      // Dispatch the data to store if response is successful
      store.dispatch(setTripDataToStore({ postedTripBill: response?.data || [] }));
    }
    return response;
  } catch (error) {
    console.error('Error fetching Posted Trips bills:', error);
  }
};

export const getMySelfTripBills = async (userId, token) => {
  try {
    const response = await getAPI(`share-trip/trip-ride/self-trip/${userId}`, token);
    console.log('yyy', response)

    if (response?.error === false) {
      // Dispatch the data to store if response is successful
      store.dispatch(setTripDataToStore({ selfTripBill: response?.data || [] }));
    }

    return response;
  } catch (error) {
    console.error('Error fetching Self Trip bills:', error);
  }
};


