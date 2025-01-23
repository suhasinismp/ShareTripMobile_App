import { getAPI, patchAPI, postAPI } from "../utils/servicesUtil";

export const ringtoneScreenPost = async (data, token) => {
    const response = await postAPI('share-trip/user-preferences/', data, token);
    return response;
}


export const ringtoneScreenPatch = async (data, token) => {
    const response = await patchAPI({
        endUrl: 'share-trip/user-preferences/',
        body: data,
        token: token,
    });
    return response;
}

export const getRingToneScreen = async (userId, token) => {
    const response = await getAPI(`share-trip/user-preferences/${userId}`, token)
    return response;
}

