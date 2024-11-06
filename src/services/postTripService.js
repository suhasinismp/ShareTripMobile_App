import { getAPI, postFormDataAPI } from '../utils/servicesUtil';

export const getTripTypes = async (token) => {
  const response = await getAPI('share-trip/booking-types', token);
  console.log('xyz', response)
  return response;
};

export const createPost = async (data, token) => {
  const response = await postFormDataAPI(
    'share-trip/post-booking',
    data,
    token,
  );
  return response;
};
