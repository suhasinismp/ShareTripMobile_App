import { createSlice } from '@reduxjs/toolkit';
import { set } from 'lodash';

const loginSlice = createSlice({
  name: 'userInfo',
  initialState: {
    meta: {
      isLoading: false,
    },
    userId: null,
    userName: '',
    userEmail: '',
    userRoleId: null,
    userMobile: '',
    userToken: null,
    userVehicleId: null,
    userPic: null,
  },
  reducers: {
    setUserDataToStore: (state, action) => {
      if (action.payload.userId) {
        set(state, 'userId', action.payload.userId);
      }
      if (action.payload.userName) {
        set(state, 'userName', action.payload.userName);
      }
      if (action.payload.userEmail) {
        set(state, 'userEmail', action.payload.userEmail);
      }
      if (action.payload.userRoleId) {
        set(state, 'userRoleId', action.payload.userRoleId);
      }
      if (action.payload.userMobile) {
        set(state, 'userMobile', action.payload.userMobile);
      }
      if (action.payload.userToken) {
        set(state, 'userToken', action.payload.userToken);
      }
    },
    setUserVehicleIdToStore: (state, action) => {
      if (action.payload.userVehicleId) {
        set(state, 'userVehicleId', action.payload.userVehicleId);
      }
    },
  },
});
export const { setUserDataToStore, setUserVehicleIdToStore } =
  loginSlice.actions;
export default loginSlice.reducer;
