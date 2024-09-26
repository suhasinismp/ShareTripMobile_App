import { getAPI, postFormDataAPI } from '../utils/servicesUtil';

export const getVehicleDocTypes = async () => {
  const response = await getAPI('/share-trip/field-dropdown/vehicleDocs');
  return response;
};

export const getUserDocTypes = async () => {
  const response = await getAPI('/share-trip/field-dropdown/userDocs');
  return response;
};

export const uploadVehicleDocs = async (data, token) => {
  try {
    const response = await postFormDataAPI(
      '/share-trip/vehicle-docs',
      data,
      token,
    );
    return response;
  } catch (error) {
    console.error('Error in uploadVehicleDocs:', error);
    throw error;
  }
};

export const uploadDriverDocs = async (data, token) => {
  try {
    const response = await postFormDataAPI(
      '/share-trip/user-docs/form-data',
      data,
      token,
    );
    return response;
  } catch (error) {
    console.error('Error in uploadDriverDocs:', error);
    throw error;
  }
};
