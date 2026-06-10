import * as yup from 'yup'
import { TFunction } from 'i18next'

export const createAddressSchema = (t: TFunction) =>
  yup
    .object({
      showFromAddressResidenceSizeInput: yup.boolean(),
      showToAddressInput: yup.boolean(),
      hasNewToAddress: yup.boolean(),
      autoCompleteAddress: yup
        .string()
        .optional()
        .when('hasNewToAddress', {
          is: true,
          then: yup
            .string()
            .required(t('error:INFOMISSING.invalidStreet'))
            .min(1, t('error:INFOMISSING.invalidStreet')),
        }),
      street: yup.string().when('hasNewToAddress', {
        is: true,
        then: yup.string().required(t('error:INFOMISSING.invalidStreet')),
      }),
      streetNumber: yup.string().when('hasNewToAddress', {
        is: true,
        then: yup.string().when('hiddenStreetNumber', {
          is: 'true',
          then: yup.string().required(t('error:INFOMISSING.noStreetNumber')),
        }),
      }),
      city: yup.string().when('hasNewToAddress', {
        is: true,
        then: yup.string().required(t('error:INFOMISSING.invalidCity')),
      }),
      zip: yup.string().when('hasNewToAddress', {
        is: true,
        then: yup
          .string()
          .min(5, t('error:INFOMISSING.invalidZip'))
          .max(5, t('error:INFOMISSING.invalidZip')),
      }),
    })
    .required()

export const createDatesSchema = () =>
  yup
    .object({
      movingOutDate: yup.date().required(),
      movingInDate: yup.date().min(yup.ref('movingOutDate')),
    })
    .required()
