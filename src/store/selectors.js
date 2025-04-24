export const snackBarConfigSelector = (state) => {
  return state?.snackBar;
};

export const getUserDataSelector = (state) => {
  return state?.userInfo;
}

export const getMyDutiesBillsSelector = (state) => {

  return state?.bill.myDutiesBillData;
}

export const getPostedBillsSelector = (state) => {
  return state?.bill.postedBillData;
}

export const getSelfTripBillsSelector = (state) => {
  return state?.bill.selfTripBillData;
}

export const getTripDetailsSelector = (state) => {

  return state?.viewTrip.tripDetails;
}
export const getTripBillSelector = (state) => {

  return state?.tripBill.data;
}
export const getOnlineStatusSelector = (state) => {
  return state?.statusOnline.isOnline;
};

export const getShowOnlyAvailableSelector = (state) => {
  return state?.statusOnline.showOnlyAvailable;
};

export const getSelfTripDetailsSelector = (state) => {
  return state?.selfTrip.tripDetails;
};
