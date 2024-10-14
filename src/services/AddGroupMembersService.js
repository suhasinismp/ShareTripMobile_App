import { postAPI } from "../utils/servicesUtil"




export const postUserByPhoneNumber = async (payload, token) => {

    const response = await postAPI('share-trip/groups/user-list', payload, token);

    return response;
}


export const postSendGroupInvite = async (payload, token) => {
    const response = await postAPI('share-trip/group-users-invite/send-invitation/', payload, token);

    return response;
}