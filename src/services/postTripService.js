import {
  getAPI,
  patchFormDataAPI,
  postAPI,
  postFormDataAPI,
} from '../utils/servicesUtil';

export const getTripTypes = async (token) => {
  const response = await getAPI('share-trip/booking-types', token);

  return response;
};

export const createPost = async (data, token) => {
  const response = await postFormDataAPI(
    'share-trip/post-booking',
    data,
    token,
  );
  return response;
};

export const updatePost = async (data, token) => {
  const response = await patchFormDataAPI({
    endUrl: 'share-trip/post-booking',
    formData: data,
    token: token,
  });
  return response;
};

export const fetchTripByPostId = async (postId, token) => {
  const response = await getAPI(
    `share-trip/trip-ride/based-post-booking/${postId}`,
    token,
  );
  return response;
};

export const generateTripPdf = async (body, token) => {
  const response = await postAPI(
    '/share-trip/trip-sheet-final/trip_sheet_report',
    body,
    token,
  );
  return response;
};

export const generateBillPdf = async (body, token) => {
  const response = await postAPI(
    '/share-trip/trip-sheet-final/trip_bill_report',
    body,
    token,
  );
  return response;
};

export const fetchTripSheetByPostId = async (postId, token) => {
  const response = await getAPI(`/share-trip/post-booking/${postId}`, token);
  return response;
};
