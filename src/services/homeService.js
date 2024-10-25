import { getAPI, postAPI } from '../utils/servicesUtil';

export const fetchPostsByUserId = async (userId, token) => {
  const response = await getAPI(
    `/share-trip/post-booking/post-booking-list/${userId}`,
    token,
  );
  return response;
};

export const sendPostRequest = async (data, token) => {
  const response = await postAPI('/share-trip/request-tracking', data, token);
  return response;
};
