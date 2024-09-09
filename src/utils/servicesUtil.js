import { api } from './APIInterceptorUtil';
export const getAPI = async (endURL, token) => {
  let prepareHeader = {
    'Content-Type': 'application/json',
  };

  if (token) {
    prepareHeader['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('Token is missing');
  }

  var apiConfig = {
    method: 'get',
    url: endURL,
    headers: prepareHeader,
  };

  try {
    const response = await api(apiConfig);
    return response.data;
  } catch (error) {
    console.log('Error occurred while fetching data');
    return null;
  }
};

export const postAPI = async (endUrl, body, token) => {
  let prepareHeader = {
    'Content-Type': 'application/json',
  };

  if (token) {
    prepareHeader['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('Token is missing');
  }

  var apiConfig = {
    method: 'post',
    url: endUrl,
    headers: prepareHeader,
    data: JSON.stringify(body),
  };

  try {
    const response = await api(apiConfig);
    return response?.data || {};
  } catch (error) {
    // console.log('Error occurred while posting data');
    return null;
  }
};

export const deleteAPI = async ({ endURL, token }) => {
  let prepareHeader = {
    'Content-Type': 'application/json',
  };

  if (token) {
    prepareHeader['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('Token is missing');
  }

  var apiConfig = {
    method: 'delete',
    url: endURL,
    headers: prepareHeader,
  };

  try {
    const response = await api(apiConfig);
    return response.data;
  } catch (error) {
    console.log('Error occurred while fetching data');
    return null;
  }
};
