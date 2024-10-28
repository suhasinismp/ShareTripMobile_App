import { getAPI, postAPI } from '../utils/servicesUtil';

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
    `share-trip/post-trip-confirm?filter=myTrips&user_id=${userId}`,
    token,
  );
  return response;
};

export const confirmedPostedGuyTrips = async (userId, token) => {
  const response = await getAPI(
    `share-trip/post-trip-confirm?filter=posted&user_id=${userId}`,
    token,
  );
  return response;
};

export const acceptDriverRequest = async (data, token) => {
  const response = await postAPI('/share-trip/post-trip-confirm/', data, token);
  return response;
};

export const rejectDriverRequest = async (data, token) => {
  console.log({ data, token });
  const response = await postAPI(
    '/share-trip/post-trip-accept/request-reject',
    data,
    token,
  );
  return response;
};
