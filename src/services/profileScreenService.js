import { getAPI, patchFormDataAPI } from "../utils/servicesUtil";


export const getProfileByUserId = async (token, userId) => {
    const response = await getAPI(`share-trip/auth/users/${userId}`, token);
    return response;
}


export const updateProfile = async (data, token) => {
    const response = await patchFormDataAPI({
        endUrl: 'share-trip/auth/users/',
        formData: data,
        token: token,
    });

    return response;
};

