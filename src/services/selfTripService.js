import {
  getAPI,
  patchAPI,
  patchSelfRideAPI,
  postAPI,
  postFormDataAPI,
} from '../utils/servicesUtil';

export const selfCreatePost = async (data, token) => {
  const response = await postFormDataAPI(
    'share-trip/post-booking/create-self-trip2',
    data,
    token,
  );
  return response;
};
export const startSelfTrip = async (data, token) => {
  const response = await postAPI(
    'share-trip/trip-ride/self-trip-start',
    data,
    token,
  );
  return response;
};

export const fetchTripDetails = async (tripId, token) => {
  const response = await getAPI(
    `share-trip/trip-ride/based-post-booking/${tripId}`,
    token,
  );
}

export const endSelfTrip = async (data, token) => {
  console.log({ data, token })
  const response = await patchSelfRideAPI(
    'share-trip/trip-ride/end-self-trip',
    data,
    token,
  );
  console.log('uuu', response)
  return response;
};


export const fetchUserSelfPosts = async (userId, token) => {
  const response = await getAPI(
    `share-trip/post-booking/self-booking-trip-list/${userId}`,
    token,
  );
  return response;
};
