import { getAPI, postFormDataAPI } from '../utils/servicesUtil';
export const getGroups = async (token) => {
  const response = await getAPI('share-trip/groups', token);
  return response;
};

export const createGroup = async (data, token) => {
  const response = await postFormDataAPI('share-trip/groups', data, token);
  return response;
};
