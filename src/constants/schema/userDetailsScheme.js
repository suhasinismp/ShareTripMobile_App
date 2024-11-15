import * as yup from 'yup';
import { fieldNames } from '../strings/fieldNames';


export const UserDetailsScheme = yup.object({
    [fieldNames.USER_NAME]: yup
        .string()
        .min(3, 'user name must be at least 3 characters'),

    [fieldNames.PHONE_NUMBER]: yup
        .string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),

    [fieldNames.EMAIL]: yup.string().email('Email is not valid'),

});
