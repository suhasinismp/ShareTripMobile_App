import * as yup from 'yup';
import { inputFieldNames } from '../strings/inputFieldNames';

export const signupScheme = yup.object({
  [inputFieldNames.FULL_NAME]: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  [inputFieldNames.PHONE_NUMBER]: yup
    .number()
    .required('Phone number is required'),
  [inputFieldNames.DRIVERS_BUSINESS_DETAILS]: yup
    .string()
    .min(3, 'Business details must be at least 3 characters')
    .max(50, 'Business details must be less than 50 characters'),
  [inputFieldNames.EMAIL]: yup.string().email('Email is not valid'),
  [inputFieldNames.EMERGENCY_NUMBER_ONE]: yup
    .number()
    .min(10, 'Emergency number must be at least 10 characters')
    .max(10, 'Emergency number must be less than 10 characters'),
  [inputFieldNames.EMERGENCY_NUMBER_TWO]: yup
    .number()
    .min(10, 'Emergency number must be at least 10 characters')
    .max(10, 'Emergency number must be less than 10 characters'),
  [inputFieldNames.PASSWORD]: yup.string().required('Password is required'),
  [inputFieldNames.CONFIRM_PASSWORD]: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});
