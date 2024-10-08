import { postAPI } from "../utils/servicesUtil"




export const postUserByPhoneNumber = async (payload, token) => {
    console.log('abc', JSON.stringify(payload))
    const response = await postAPI('groups/user-list', payload, token);

    return response;
}