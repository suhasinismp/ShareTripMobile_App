import config from '../constants/config';
import { getAPI, postAPI } from '../utils/servicesUtil';

export const fetchVehicleTypes = async () => {
  const response = await getAPI(
    '/share-trip/vehicle-types',
    config.ADMIN_TOKEN,
  );

  return response;
};

export const fetchVehicleNames = async () => {
  const response = await getAPI(
    '/share-trip/vehicle-names',
    config.ADMIN_TOKEN,
  );

  return response;
};

export const createVehicleDetail = async (data, token) => {
  const response = await postAPI('share-trip/vehicles/', data, token);
  return response;
};

export const getAllVehiclesByUserId = async (token, userId) => {
  const response = await getAPI(
    `/share-trip/user-vehicle-package/user-vehicle-userID/${userId}`,
    token,
  );

  return response;
};
