import { patchAPI, postAPI } from "../utils/servicesUtil";


export const verifyPasswordOTP = async (data) => {

  const response = await postAPI('share-trip/auth/users/send-otp-password', data);
  console.log('mmm', response)
  return response;
};

export const VerifyForgotPasswordOTP = async (data) => {
  const response = await postAPI('share-trip/auth/users/verify-otp-password', data);
  return response;
}

// export const resetPassword = async (data) => {

//   const response = await patchAPI('/share-trip/auth/users/confirm-password', data);
//   console.log('object', response)
//   return response;
// }

export const resetPassword = async (data) => {
  const response = await patchAPI({
    endUrl: '/share-trip/auth/users/confirm-password',
    body: data,

  });
  return response;
};
