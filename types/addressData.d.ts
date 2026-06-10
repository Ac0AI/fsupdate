declare type FormValuesToAddress = {
  autoCompleteAddress: string
  street: string
  apartmentNumber: string | null
  zip: string
  city: string
  sqm: string
  streetNumber: string
  residenceSize: string
  residenceType: string
  apartmentType: string
}
declare type FormValuesFromAddress = {
  autoCompleteAddress: string
  street: string
  zip: string
  city: string
  sqm: string
  streetNumber: string
  additionalSpace?: string
}
declare type FormValuesToAddressLight = {
  autoCompleteAddress: string
  street: string
  zip: string
  city: string
  sqm: string
  streetNumber: string
}

declare type AddresschangeFormValues = {
  street: string
  streetNumber: string
  zip: string
  city: string
  apartmentNumber: string | undefined
  isPermanent: string
  validity: string
  moveDate: string | Date
  email: string
  phone: string
}

declare type FormValuesCommon = {
  autoCompleteAddress: string
  street: string
  streetNumber: string
  zip: string
  city: string
  hiddenStreetNumber: string
}

declare type FormValuesOnboarding = FormValuesCommon & {
  showToAddressInput: boolean
  hasNewToAddress: boolean
}

declare type FormValuesOnboardingDates = {
  movingOutDate: Date
  movingInDate: Date
}

declare type FormValueStreet = {
  street: string
}
