import * as yup from 'yup';
import { fieldNames } from '../strings/fieldNames';

export const signupScheme = yup.object({
  [fieldNames.FULL_NAME]: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  [fieldNames.PHONE_NUMBER]: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    
  [fieldNames.EMAIL]: yup.string().email('Email is not valid'),
  [fieldNames.EMERGENCY_NUMBER_ONE]: yup
    .string()
    .matches(/^\d{10}$/, 'Emergency number must be exactly 10 digits'),
  [fieldNames.EMERGENCY_NUMBER_TWO]: yup
    .string()
    .matches(/^\d{10}$/, 'Emergency number must be exactly 10 digits'),
  [fieldNames.PASSWORD]: yup.string().required('Password is required'),
  [fieldNames.CONFIRM_PASSWORD]: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});
