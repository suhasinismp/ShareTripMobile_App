import { getAPI } from '../utils/servicesUtil';

export const getTripTypes = async (token) => {
  const response = await getAPI('share-trip/booking-types', token);
  return response;
};
