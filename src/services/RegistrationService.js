import { patchAPI, postAPI } from '../utils/servicesUtil';

export const registerUser = async (data) => {
  const response = await postAPI('/share-trip/auth/sign-up', data);
  return response;
};

export const updateUserProfile = async (data) => {
  const response = await patchAPI('/share-trip/auth/users', data);
  return response;
};

export const verifyOTP = async (data) => {
  const response = await postAPI('share-trip/auth/users/verify-otp', data);
  return response;
};
