import { postAPI } from '../utils/servicesUtil';

export const doLogin = async (payload) => {
  const response = await postAPI('share-trip/auth/sign-in', payload);

  return response;
};
