import { getAPI } from '../utils/servicesUtil';

export const fetchTripBill = async (postId, token) => {
  const response = await getAPI(
    `share-trip/trip-sheet-final/based-post-booking-id/${postId}`,
    token,

  );
  return response;
};
