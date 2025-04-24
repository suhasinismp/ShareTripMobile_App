import { createSlice } from '@reduxjs/toolkit';

const snackBarSlice = createSlice({
  name: 'snackbar',
  initialState: {
    visible: false,
    message: '',
    type: '',
    actionText: '',
    position: '',
    onActionPress: null,
  },
  reducers: {
    showSnackbar: (state, action) => {
      state.visible = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.actionText = action.payload.actionText;
      state.position = action.payload.position;
      state.onActionPress = action.payload.onActionPress;
    },
    hideSnackbar: (state) => {
      state.visible = false;
      state.message = '';
      state.type = '';
      state.actionText = '';
      state.position = '';
      state.onActionPress = null;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackBarSlice.actions;
export default snackBarSlice.reducer;
