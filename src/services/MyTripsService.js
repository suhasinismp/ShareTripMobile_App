import {
  getAPI,
  patchAPI,
  patchFormDataAPI,
  postAPI,
  postFormDataAPI,
} from '../utils/servicesUtil';

export const getDriverInProgressTrips = async (userId, token) => {
  const response = await getAPI(
    `share-trip/post-trip-accept/based-accepted-user/${userId}`,
    token,
  );
  return response;
};

export const getPostedGuyInProgressTrips = async (userId, token) => {
  const response = await getAPI(
    `share-trip/post-trip-accept/based-posted-user/${userId}`,
    token,
  );

  return response;
};

export const confirmedDriverTrips = async (userId, token) => {
  const response = await getAPI(
    `share-trip/post-trip-confirm/filter-data?filter=myDuties&&user_id=${userId}`,
    token,
  );
  return response;
};

export const confirmedPostedGuyTrips = async (userId, token) => {
  const response = await getAPI(
    `share-trip/posted-user/filter-data?filter=posted&user_id=${userId}`,
    token,
  );
  return response;
};

export const acceptDriverRequest = async (data, token) => {
  console.log({ data, token })
  const response = await postAPI('share-trip/post-trip-confirm/', data, token);
  console.log('iii', response)
  return response;
};

export const rejectDriverRequest = async (data, token) => {
  const response = await patchAPI({
    endUrl: 'share-trip/post-trip-accept/request-reject',
    body: data,
    token: token,
  });

  return response;
};

export const startTrip = async (data, token) => {
  const response = await postAPI('share-trip/trip-ride/start/', data, token);

  return response;
};

export const closeTrip = async (data, token) => {

  const response = await patchAPI({
    endUrl: 'share-trip/trip-ride',
    body: data,
    token: token,
  });

  return response;
};

export const fetchTripDetails = async (tripId, token) => {
  const response = await getAPI(
    `share-trip/trip-ride/based-post-booking/${tripId}`,
    token,
  );


  return response;
};

export const postAdditionCharges = async (data, token) => {

  const response = await postFormDataAPI(
    'share-trip/additional-charges/',
    data,
    token,
  );
  return response;
};

export const uploadSignature = async (data, token) => {
  const response = await patchFormDataAPI({
    endUrl: 'share-trip/trip-ride/signature-upload',
    formData: data,
    token: token,
  });

  return response;
};

export const fetchMultiDayTripDetails = async (tripId, token) => {
  const response = await getAPI(
    `share-trip/multiple-day-trip/${tripId}`,
    token,
  );
  return response;
};

export const closeForDay = async (data, token) => {
  const response = await patchAPI({
    endUrl: 'share-trip/multiple-day-trip',
    body: data,
    token: token,
  });
  return response;
};

export const startTripMultiDay = async (data, token) => {
  const response = await postAPI('share-trip/multiple-day-trip', data, token);
  return response;
};


export const postedMyTrips = async (userId, token) => {
  const response = await getAPI(`share-trip/post-booking/post-booking-list-by-posted-user/${userId}`, data, token);
  console.log('sss', response)
  return response;
}
