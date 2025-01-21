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