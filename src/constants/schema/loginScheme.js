import * as yup from 'yup';
import { inputFieldNames } from '../strings/inputFieldNames';

export const signInScheme = yup.object({
  [inputFieldNames.EMAIL_OR_PHONE]: yup
    .string()
    .required('Email or Phone is required')
    .test('email-or-phone', 'Invalid input', function (value) {
      const phoneRegex = /^\d+$/;
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

      if (phoneRegex.test(value)) {
        if (value.length !== 10) {
          return this.createError({
            message: 'Phone number must be exactly 10 digits',
          });
        }
        return true;
      } else {
        if (!emailRegex.test(value)) {
          return this.createError({ message: 'Enter a valid email address' });
        }
        return true;
      }
    }),
  [inputFieldNames.PASSWORD]: yup.string().required('Password is required'),
});
