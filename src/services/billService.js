import { getAPI } from "../utils/servicesUtil"


export const getMyDutiesBill = async (token, userId) => {
    const response = await getAPI(`share-trip/post-trip-confirm/completed-trips?filter=myDuties&user_id=${userId}`, token,)
    return response;
}

export const getMyPostedTripBills = async (token, userId) => {
    const response = await getAPI(`share-trip/posted-user/completed-trips?filter=posted&user_id=${userId}`, token)
    return response;
}