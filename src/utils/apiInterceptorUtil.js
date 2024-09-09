import axios from 'axios';
import { showSnackbar } from '../store/slices/snackBarSlice';
import config from '../constants/config';

export const api = axios.create({
  baseURL: config.API_BASE_URL,
});

export const setInterceptors = (store) => {
  api.interceptors.response.use(
    (response) => response,

    (error) => {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'An error occurred';

        if (status >= 400 && status < 500) {
          store.dispatch(
            showSnackbar({
              visible: true,
              message: message,
              type: 'error',
              actionText: 'Dismiss',
              position: 'bottom',
            }),
          );
        } else if (status >= 500) {
          // Handle server-side errors (500-599)
          console.error(`Server Error: ${message}`);
          store.dispatch(
            showSnackbar({
              visible: true,
              message: 'Something went wrong',
              type: 'error',
              actionText: 'Dismiss',
              position: 'bottom',
            }),
          );
        }
      } else if (error.request) {
        // Handle no response from server
        console.error('Network Error: No response received from server.');
        store.dispatch(
          showSnackbar({
            visible: true,
            message: 'No network',
            type: 'error',
            actionText: 'Dismiss',
            position: 'bottom',
          }),
        );
      } else {
        // Handle other errors
        console.error(`Error: ${error.message}`);
        store.dispatch(
          showSnackbar({
            visible: true,
            message: 'Something went wrong',
            type: 'error',
            actionText: 'Dismiss',
            position: 'bottom',
          }),
        );
      }

      return Promise.reject(error);
    },
  );
};
