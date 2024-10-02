import { getAPI } from '../utils/servicesUtil';
export const getGroups = async (token) => {
  const response = await getAPI('share-trip/groups', token);
  return response;
};
