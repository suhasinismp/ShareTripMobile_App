import { patchFormDataAPI } from "../utils/servicesUtil";


export const updateProfile = async (payload, token) => {
    const response = await patchFormDataAPI({
        endUrl: 'share-trip/auth/users/',
        formData: payload,
        token: token,
    });
    return response;
};

