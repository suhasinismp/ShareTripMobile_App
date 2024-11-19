import { getAPI, postFormDataAPI } from "../utils/servicesUtil"

export const createVacantPost = async (data, token) => {

    const response = await postFormDataAPI('share-trip/vacant-post', data, token);
    console.log('ooo', response)
    return response;

}

export const getVacantPost = async () => {
    const response = await getAPI(`share-trip/vacant-post/based-user_id/${userId}`, token);
    return response;
}
