import * as yup from 'yup';

export const startTripEndTripScheme = yup.object({

    startTripKms: yup
        .string()
        .required('Starting kilometers is required')
        .matches(/^\d+$/, 'Must be a valid number')
        .test('valid-kms', 'Must be a valid kilometer reading', (value) => {
            return value && parseInt(value) >= 0;
        })
        .test(
            'not-less-than-opening',
            'Starting KMs must be greater than or equal to opening KMs',
            function (value) {
                const { openingKms } = this.options.context || {};
                return !value || !openingKms || parseInt(value) >= parseInt(openingKms);
            }
        ),

    endTripKms: yup
        .string()
        .required('Ending kilometers is required')
        .matches(/^\d+$/, 'Must be a valid number')
        .test('valid-kms', 'Must be a valid kilometer reading', (value) => {
            return value && parseInt(value) >= 0;
        })
        .test(
            'greater-than-start',
            'End KMs must be greater than Start KMs',
            function (value) {
                const startKms = this.parent.startTripKms;
                return !startKms || !value || parseInt(value) > parseInt(startKms);
            }
        ),

    startDate: yup
        .date()
        .required('Start date is required')
        .max(new Date(), 'Start date cannot be in the future'),

    endDate: yup
        .date()
        .required('End date is required')
        .min(yup.ref('startDate'), 'End date must be after start date')
        .test('not-future', 'End date cannot be in the future', (value) => {
            return !value || value <= new Date();
        }),

    startTime: yup
        .string()
        .required('Start time is required')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Must be a valid time format (HH:mm)'),

    endTime: yup
        .string()
        .required('End time is required')
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Must be a valid time format (HH:mm)')
        .test('valid-time-range', 'End time must be after start time', function (value) {
            const startTime = this.parent.startTime;
            const startDate = this.parent.startDate;
            const endDate = this.parent.endDate;

            if (!startTime || !value || !startDate || !endDate) return true;

            const start = new Date(startDate);
            const end = new Date(endDate);

            const [startHour, startMinute] = startTime.split(':');
            const [endHour, endMinute] = value.split(':');

            start.setHours(parseInt(startHour), parseInt(startMinute));
            end.setHours(parseInt(endHour), parseInt(endMinute));

            return end > start;
        }),
});
