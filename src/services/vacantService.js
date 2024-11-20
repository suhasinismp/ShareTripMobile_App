import { getAPI, postFormDataAPI } from "../utils/servicesUtil"

export const createVacantPost = async (data, token) => {

    const response = await postFormDataAPI('share-trip/vacant-post', data, token);
    console.log('abc', response)
    return response;

}

export const getVacantPost = async (token) => {
    const response = await getAPI(`share-trip/vacant-post/`, token);
    return response;
}
