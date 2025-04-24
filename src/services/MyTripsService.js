import {
  deleteAPI,
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
    `share-trip/post-booking/post-booking-list-for-posted-user/${userId}`,
    token,
  );

  return response;
};

// export const postedTripToSeePostGuy = async (userId, token) => {
//   const response = await getAPI(
//     `share-trip/post-booking/post-booking-list-by-posted-user/${userId}`,
//     token,
//   );
//   return response;
// }
export const deletePostedTrip = async (postId, userId, token) => {
  try {
    if (!postId || !userId || !token) {
      throw new Error('Missing required parameters');
    }

    const response = await deleteAPI({
      endUrl: `share-trip/post-booking/delete-post?id=${postId}&posted_user_id=${userId}`,
      token: token
    });
    // Fixed syntax error
    return response;
  } catch (error) {
    console.error('Delete post error:', error);
    return {
      error: true,
      message: error?.message || 'Failed to delete post',
      data: null
    };
  }
};

export const getDriverDataByPostId = async (postId, token) => {
  try {
    if (!postId || !token) {
      throw new Error('Missing required parameters');
    }

    const response = await getAPI(
      `share-trip/post-trip-accept/based-post-booking/${postId}`,
      token
    );

    if (!response) {
      throw new Error('No response from server');
    }

    return response;
  } catch (error) {
    console.error('Error in driverData:', error);
    return {
      error: true,
      message: error?.message || 'Failed to fetch driver data',
      data: null
    };
  }
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
  const response = await postAPI('share-trip/post-trip-confirm/', data, token);

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
    'share-trip/multiplrAdditionalCharges',
    data,
    token,
  );

  return response;
};

export const uploadSignature = async (data, token) => {
  const response = await patchFormDataAPI({
    endUrl: 'share-trip/multiplrAdditionalCharges/add-signature',
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
  const response = await getAPI(
    `share-trip/post-booking/post-booking-list-by-posted-user/${userId}`,
    data,
    token,
  );

  return response;
};
