import { getAPI } from '../utils/servicesUtil';

export const getVehicleDocTypes = async () => {
  const response = await getAPI('/share-trip/field-dropdown/vehicleDocs');
  return response;
};

export const getUserDocTypes = async () => {
  const response = await getAPI('/share-trip/field-dropdown/userDocs');
  return response;
};
