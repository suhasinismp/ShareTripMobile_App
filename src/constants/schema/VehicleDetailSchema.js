import * as yup from 'yup';
import { fieldNames } from '../strings/fieldNames';

export const VehicleDetailSchema = yup.object({
    [fieldNames.VEHICLE_MODEL]: yup
      .string()
     .matches(/^\d{4}$/, 'vehicle model number is Exactly 4 digit')
});


