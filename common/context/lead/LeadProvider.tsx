import { createContext, useContext, useState, useEffect, HTMLAttributes, useCallback } from 'react'
import { useIntercom } from 'react-use-intercom'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { createFakeLead } from '@/common/api/fakeLead'
import { getLead } from '@/common/api/getUser'
import { patchMovingDate } from '@/common/api/patchMovingDate'
import { autoSignup } from '@/common/api/signup'
import { updateToAddress } from '@/common/api/updateCurrentMove'
import { PartnerCodeEnum } from '@/common/enums/PartnerCodeEnum'
import { getCookieDomain } from '@/common/helpers/domain'

/* eslint-disable @typescript-eslint/no-empty-function */
const defaultValue: LeadContextType = {
  lead: {
    hasFetchedData: false,
    leadDetails: {
      brokerOfficeId: '',
      brokerOfficeName: '',
      brokerOfficePersonName: '',
      pno: '',
      sourceSystem: '',
      type: null,
      id: '',
      movingDate: new Date(),
      inviteCode: '',
      address: {
        apartmentNumber: null,
        city: '',
        street: '',
        zip: '',
      },
    },

    partnerDetails: {
      partnerId: '',
      partnerName: '',
      agentName: '',
    },
  },
  setInvitationCode: () => {},
  setChannel: () => {},
  leadAddressData: {
    toStreet: '',
    toZip: '',
    toCity: '',
    movingInDate: new Date(),
    movingOutDate: new Date(),
    hasMovingInDate: false,
  },
  setLeadAddressData: () => {},
  isLoadingCreateUser: false,
  setIsLoadingCreateUser: () => {},
  setTriggerCreateUser: () => {},
  setWithoutNewAddress: () => {},
  leadFetchFailed: false,
  retryLeadFetch: () => {},
  createUserFailed: false,
  retryCreateUser: () => {},
}

export type LeadContextType = {
  lead: Lead
  leadAddressData: LeadAddressData
  setLeadAddressData: (arg0: LeadAddressData) => void
  setInvitationCode: (arg0: string) => void
  setChannel: (arg0: string) => void
  isLoadingCreateUser: boolean
  setIsLoadingCreateUser: (arg0: boolean) => void
  setTriggerCreateUser: (arg0: boolean) => void
  setWithoutNewAddress: (arg0: boolean) => void
  leadFetchFailed: boolean
  retryLeadFetch: () => void
  createUserFailed: boolean
  retryCreateUser: () => void
}

export type UserProviderProps = {
  context: React.Context<LeadContextType>
} & HTMLAttributes<HTMLDivElement>

const LeadContext = createContext(defaultValue)

export const LeadProvider = ({ children }: UserProviderProps) => {
  const router = useRouter()
  const [currentLeadState, setCurrentLeadState] = useState<Lead>(defaultValue.lead)
  const [invitationCode, setInvitationCode] = useState<string | undefined>(undefined)
  const [fakeInvitationCode, setFakeInvitationCode] = useState<string | undefined>(undefined)
  const [leadAddressData, setLeadAddressData] = useState<LeadAddressData>(defaultValue.leadAddressData)
  const [errorCode, setErrorCode] = useState<number>()
  const [isLoadingCreateUser, setIsLoadingCreateUser] = useState<boolean>(false)
  const [triggerCreateUser, setTriggerCreateUser] = useState<boolean>(false)
  const [channel, setChannel] = useState<string | undefined>(undefined)
  const { update, trackEvent } = useIntercom()
  const [withoutNewAddress, setWithoutNewAddress] = useState<boolean>(false)
  const [leadFetchFailed, setLeadFetchFailed] = useState<boolean>(false)

  useEffect(() => {
    const getLeadResponse = async () => {
      trackEvent('signup_submit_invitation_code', { code: invitationCode })
      try {
        if (invitationCode === PartnerCodeEnum.userCreated) {
          setCurrentLeadState({ ...defaultValue.lead, hasFetchedData: true })
        } else if (invitationCode === PartnerCodeEnum.testMode) {
          // Test mode - skip API, use mock data for local testing
          setCurrentLeadState({
            hasFetchedData: true,
            leadDetails: {
              brokerOfficeId: 'test-office',
              brokerOfficeName: 'Test Mäklarbyrå',
              brokerOfficePersonName: 'Test Person',
              pno: '',
              sourceSystem: 'test',
              type: null,
              id: 'test-lead-123',
              movingDate: new Date(),
              inviteCode: 'testmode',
              address: {
                apartmentNumber: null,
                city: 'Stockholm',
                street: 'Testgatan 1',
                zip: '12345',
              },
            },
            partnerDetails: {
              partnerId: 'test-partner',
              partnerName: 'Test Partner',
              agentName: 'Test Agent',
            },
          })
        } else if (invitationCode === PartnerCodeEnum.flyttsmartTest) {
          const response = await createFakeLead()
          if (response?.inviteCode) {
            setFakeInvitationCode(response?.inviteCode)
            const leadResponse = await getLead(response?.inviteCode || '')
            if (leadResponse) {
              if (leadResponse.leadDetails.address) {
                setLeadAddressData({
                  ...leadAddressData,
                  toCity: leadResponse.leadDetails?.address?.city,
                  toZip: leadResponse.leadDetails?.address?.zip,
                  toStreet: leadResponse.leadDetails?.address?.street,
                  movingOutDate: leadResponse.leadDetails?.movingDate,
                })
              }
              setCurrentLeadState({ ...leadResponse, hasFetchedData: true })
            }
          }
        } else {
          const leadResponse = await getLead(invitationCode || '')
          if (leadResponse) {
            if (leadResponse.leadDetails.address || leadResponse.leadDetails.movingDate) {
              setLeadAddressData({
                ...leadAddressData,
                toCity: leadResponse.leadDetails?.address?.city ?? '',
                toZip: leadResponse.leadDetails?.address?.zip ?? '',
                toStreet: leadResponse.leadDetails?.address?.street ?? '',
                movingOutDate: leadResponse.leadDetails.movingDate ? leadResponse.leadDetails.movingDate : defaultValue.leadAddressData?.movingOutDate,
              })
            }

            setCurrentLeadState({ ...leadResponse, hasFetchedData: true })
          } else {
            setLeadFetchFailed(true)
            setCurrentLeadState({ ...defaultValue.lead, hasFetchedData: true })
          }
        }
      } catch (er: unknown) {
        if (er) {
          const { statusCode } = er as ErrorType
          if (statusCode === 404) {
            router.push('/login?failed=true')
          } else if (statusCode === 410) {
            router.push('/login?oldNewUser=true')
          } else {
            setLeadFetchFailed(true)
            setCurrentLeadState({ ...defaultValue.lead, hasFetchedData: true })
          }
        }
      }
    }
    if (!currentLeadState.hasFetchedData && invitationCode) {
      getLeadResponse()
    }
  }, [currentLeadState, invitationCode, trackEvent, router])

  const updateCurrentMoveData = async (token?: string) => {
    const response = await updateToAddress({ toAddress: { street: leadAddressData.toStreet, zip: leadAddressData.toZip, city: leadAddressData.toCity } }, token)
    if (response) {
      return updateMovingDates()
    }
  }

  const updateMovingDates = async () => {
    const movingDateResponse = await patchMovingDate(leadAddressData.movingOutDate, leadAddressData?.hasMovingInDate ? leadAddressData.movingInDate : undefined)
    if (movingDateResponse) return movingDateResponse
  }

  const createUser = useCallback(async () => {
    try {
      if (invitationCode === PartnerCodeEnum.userCreated) {
        if (!!leadAddressData.toCity?.length) {
          await updateCurrentMoveData()
        } else if (leadAddressData?.movingOutDate) {
          await updateMovingDates()
        }
        router.push('/app/welcome?userCreated=true')
      } else if (invitationCode === PartnerCodeEnum.testMode) {
        // Test mode - set fake token, skip API for local testing
        const domain = getCookieDomain(window.location.hostname)
        Cookies.set('userToken', 'test-token-local-development', { expires: 365, domain })
        router.push('/app/welcome?userCreated=true')
      } else if (!!fakeInvitationCode?.length) {
        const response = await autoSignup(fakeInvitationCode ?? '', withoutNewAddress)
        if (response?.token) {
          const domain = getCookieDomain(window.location.hostname)
          Cookies.set('userToken', response?.token as string, { expires: 365, domain })
          if (!!leadAddressData.toCity?.length) {
            const moveDateResponse = await updateCurrentMoveData(response?.token as string)
            if (!!moveDateResponse?.id?.length) router.push('/app/welcome?userCreated=true')
          } else {
            router.push('/app/welcome?userCreated=true')
          }
        }
      } else {
        const response = await autoSignup(invitationCode ?? '', withoutNewAddress)
        if (response?.token) {
          const domain = getCookieDomain(window.location.hostname)
          Cookies.set('userToken', response?.token as string, { expires: 365, domain })
          if (!!leadAddressData.toCity?.length) {
            await updateCurrentMoveData(response?.token as string)
          } else if (leadAddressData?.movingOutDate) {
            await updateMovingDates()
          }
          router.push('/app/welcome?userCreated=true')
        }
      }
    } catch (e: unknown) {
      const castedError = e as ErrorType
      setErrorCode(castedError.statusCode ?? 500)
      setTriggerCreateUser(false)
      setIsLoadingCreateUser(false)
    }
  }, [leadAddressData, invitationCode, fakeInvitationCode, withoutNewAddress])

  useEffect(() => {
    if (errorCode === 410 && router) {
      router.push('/login?oldNewUser=true')
    }
  }, [errorCode, router])

  useEffect(() => {
    if (channel) {
      window.localStorage.setItem('channel', channel)
      update({ customAttributes: { sign_up_channel: channel } })
    }
  }, [channel, update])

  useEffect(() => {
    if (triggerCreateUser) {
      createUser()
    }
  }, [triggerCreateUser, createUser])

  const retryLeadFetch = useCallback(() => {
    setLeadFetchFailed(false)
    setCurrentLeadState((prev) => ({ ...prev, hasFetchedData: false }))
  }, [])

  const retryCreateUser = useCallback(() => {
    setErrorCode(undefined)
    setIsLoadingCreateUser(true)
    setTriggerCreateUser(true)
  }, [])

  const contextValue: LeadContextType = {
    lead: currentLeadState,
    setInvitationCode: setInvitationCode,
    setChannel: setChannel,
    leadAddressData: leadAddressData,
    setLeadAddressData: setLeadAddressData,
    isLoadingCreateUser: isLoadingCreateUser,
    setTriggerCreateUser,
    setIsLoadingCreateUser: setIsLoadingCreateUser,
    setWithoutNewAddress,
    leadFetchFailed,
    retryLeadFetch,
    createUserFailed: !!errorCode && errorCode !== 410,
    retryCreateUser,
  }

  return <LeadContext.Provider value={contextValue}>{children}</LeadContext.Provider>
}

export const CreateLeadContext = () => {
  return createContext<LeadContextType>(defaultValue)
}

export const useLeadContext = () => useContext(LeadContext)
