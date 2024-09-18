import * as yup from 'yup';
import { fieldNames } from '../strings/fieldNames';

export const businessDetailsScheme = yup.object({
  [fieldNames.BUSINESS_DETAILS_NAME]: yup
    .string()
    .min(3, 'Business name must be at least 3 characters'),

  [fieldNames.BUSINESS_DETAILS_ADDRESS]: yup.string().min(3, 'Address must be at least 3 characters'),

  [fieldNames.BUSINESS_DETAILS_AREA]: yup.string(). min(3, 'Area must be at least 3 characters'),
  [fieldNames.BUSINESS_DETAILS_CITY]: yup.string(). min(3, 'City must be at least 3 characters'),
  [fieldNames.BUSINESS_DETAILS_STATE]: yup.string(). min(3,'State must be at least 3 characters'),
});
