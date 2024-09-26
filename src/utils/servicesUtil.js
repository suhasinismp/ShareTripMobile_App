import { api } from './apiInterceptorUtil';

export const getAPI = async (endURL, token) => {
  let prepareHeader = {
    'Content-Type': 'application/json',
  };

  if (token) {
    prepareHeader['Authorization'] = `Bearer ${token}`;
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

export const patchAPI = async (endUrl, body, token) => {
  let prepareHeader = {
    'Content-Type': 'application/json',
  };

  if (token) {
    prepareHeader['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('Token is missing');
  }

  var apiConfig = {
    method: 'patch',
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

// export const postFormDataAPI = async (endUrl, formData, token) => {
//   const headers = {
//     'Content-Type': 'multipart/form-data',
//   };

//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const apiConfig = {
//     method: 'post',
//     url: endUrl,
//     headers: headers, // Do not set Content-Type, Axios will set it automatically
//     data: formData, // FormData is sent directly
//   };

//   try {
//     const response = await api(apiConfig);
//     return response?.data || {};
//   } catch (error) {
//     console.error('Error occurred while posting FormData', error);
//     return null;
//   }
// };
export const postFormDataAPI = async (endUrl, formData, token) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const apiConfig = {
    method: 'post',
    url: endUrl,
    headers: headers,
    data: formData,
  };

  try {
    const response = await api(apiConfig);
    return response?.data || {};
  } catch (error) {
    console.error('Error occurred while posting FormData', error);
    throw error;
  }
};
