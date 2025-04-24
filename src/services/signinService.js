import { getAPI, postAPI } from '../utils/servicesUtil';

export const doLogin = async (payload) => {
  const response = await postAPI('share-trip/auth/sign-in', payload);

  return response;
};

export const fetchUserMetaData = async (userId, token) => {
  const response = await getAPI(
    `share-trip/user-status/meta-data/${userId}`,
    token,
  );
  return response;
};
