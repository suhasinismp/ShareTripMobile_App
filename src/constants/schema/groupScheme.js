import * as yup from 'yup';
import { fieldNames } from "../strings/fieldNames";


export const groupScheme = yup.object({
    [fieldNames.GROUP_NAME]: yup.string(),
    [fieldNames.GROUP_DESCRIPTION]: yup.string()
})