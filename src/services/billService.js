import { getAPI } from '../utils/servicesUtil';

export const getMyDutiesBill = async (userId, token) => {
  const response = await getAPI(
    `share-trip/post-trip-confirm/completed-trips?filter=myDuties&user_id=${userId}`,
    token,
  );

  return response;
};

export const getMyPostedTripBills = async (userId, token) => {
  const response = await getAPI(
    `share-trip/posted-user/completed-trips?filter=posted&user_id=${userId}`,
    token,
  );
  return response;
};

export const getMySelfTripBills = async (userId, token) => {

  const response = await getAPI(`share-trip/trip-ride/self-trip/${userId}`, token,);
  console.log('scdd', response.data)
  return response;
}
