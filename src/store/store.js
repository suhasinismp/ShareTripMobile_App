import { combineReducers, configureStore } from '@reduxjs/toolkit';
import snackBarReducer from './slices/snackBarSlice';
import loginReducer from './slices/loginSlice';

export const resetStore = () => {
  return {
    type: 'RESET_STORE',
  };
};

const rootReducer = combineReducers({
  snackBar: snackBarReducer,
  userInfo: loginReducer,
});

const rootReducerWithReset = (state, action) => {
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }
  return rootReducer(state, action);
};

const store = configureStore({
  reducer: rootReducerWithReset,
});

export default store;
