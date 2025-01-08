import * as yup from 'yup';

export const tripBillSchema = yup.object({
  // Driver & Vehicle Details validation
  driver_name: yup
    .string()
    .required('Driver name is required')
    .min(3, 'Driver name must be at least 3 characters'),

  driver_phone: yup
    .string()
    .required('Driver phone is required')
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),

  vehicle_type: yup.string().required('Vehicle type is required'),

  vehicle_number: yup
    .string()
    .required('Vehicle number is required')
    .matches(
      /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/,
      'Invalid vehicle number format',
    ),

  // Fare Breakdown validation
  'Fare Breakdown_Booking Type': yup
    .string()
    .required('Booking type is required'),

  'Fare Breakdown_Slab rate': yup
    .number()
    .required('Slab rate is required')
    .positive('Slab rate must be positive'),

  'Fare Breakdown_Slab kms': yup
    .string()
    .required('Slab kms is required')
    .matches(/^\d+kms$/, 'Invalid kms format'),

  'Fare Breakdown_Extra Kms Charges': yup
    .string()
    .required('Extra kms charges is required')
    .matches(/^\d+kms\*\d+ = \d+rs$/, 'Invalid extra kms charges format'),

  'Fare Breakdown_Day Batta': yup
    .number()
    .required('Day batta is required')
    .min(0, 'Day batta cannot be negative'),

  'Fare Breakdown_Night Batta': yup
    .number()
    .required('Night batta is required')
    .min(0, 'Night batta cannot be negative'),

  // Other Charges validation
  'Others Charges_Parking': yup
    .number()
    .required('Parking charges is required')
    .min(0, 'Parking charges cannot be negative'),

  'Others Charges_Tolls': yup
    .number()
    .required('Toll charges is required')
    .min(0, 'Toll charges cannot be negative'),

  'Others Charges_Other State Taxes': yup
    .number()
    .required('State taxes is required')
    .min(0, 'State taxes cannot be negative'),

  'Others Charges_Advance': yup
    .number()
    .required('Advance amount is required')
    .min(0, 'Advance amount cannot be negative'),

  'Others Charges_Cleaning Charges': yup
    .number()
    .required('Cleaning charges is required')
    .min(0, 'Cleaning charges cannot be negative'),

  // Trip Usage validation
  'Trip Usage_Trip Usage': yup
    .string()
    .required('Trip usage is required')
    .matches(/^\d+kms$/, 'Invalid trip usage format'),

  'Trip Usage_Pickup Place': yup
    .string()
    .required('Pickup place is required')
    .min(3, 'Pickup place must be at least 3 characters'),

  'Trip Usage_Visiting Places': yup
    .string()
    .required('Visiting places is required')
    .min(3, 'Visiting places must be at least 3 characters'),
});
