import { getAPI, patchAPI, postAPI } from '../utils/servicesUtil';

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
  const response = await postAPI('/share-trip/post-trip-confirm/', data, token);
  return response;
};

export const rejectDriverRequest = async (data, token) => {
  const response = await patchAPI({
    endUrl: '/share-trip/post-trip-accept/request-reject',
    body: data,
    token: token,
  });

  return response;
};

export const startTrip = async (data, token) => {
  const response = await postAPI('/share-trip/trip-ride/start/', data, token);
  return response;
};

export const closeTrip = async (data, token) => {
  const response = await patchAPI({
    endUrl: '/share-trip/trip-ride',
    body: data,
    token: token,
  });
  return response;
};
