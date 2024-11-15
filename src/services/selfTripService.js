import { getAPI, postFormDataAPI } from "../utils/servicesUtil"


export const selfCreatePost = async (data, token) => {
    const response = await postFormDataAPI('share-trip/post-booking/create-self-trip2', data, token);
    return response;
}


export const fetchUserSelfPosts = async (userId, token) => {
    const response = await getAPI(`share-trip/post-booking/self-booking-trip-list/${userId}`, token);
    return response
}