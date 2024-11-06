import { getAPI, patchAPI, postFormDataAPI } from '../utils/servicesUtil';

export const createBusinessDetails = async (data, token, logo) => {
  const formData = new FormData();
  formData.append('json', JSON.stringify(data));
  formData.append('businessLogo', logo);
  const response = await postFormDataAPI(
    'share-trip/user-business',
    formData,
    token,
  );

  return response;
};

export const fetchBusinessDetailsByUserId = async (token, userId) => {
  const response = await getAPI(`share-trip/user-business/${userId}`, token);

  return response;
};

export const updateBusinessDetails = async (data, token, logo) => {
  const formData = new FormData();
  formData.append('json', JSON.stringify(data));
  formData.append('businessLogo', logo);
  const response = await patchAPI('share-trip/user-business', formData, token);

  return response;
};
