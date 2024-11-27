import { getAPI, patchFormDataAPI } from "../utils/servicesUtil";


export const getProfileByUserId = async (token, userId) => {
    const response = await getAPI(`share-trip/auth/users/${userId}`, token);
    console.log({ response })

    return response;
}


export const updateProfile = async (payload, token) => {
    const response = await patchFormDataAPI({
        endUrl: 'share-trip/auth/users/',
        formData: payload,
        token: token,
    });
    return response;
};

