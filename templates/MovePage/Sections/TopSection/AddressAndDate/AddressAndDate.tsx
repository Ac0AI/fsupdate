import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import formatDate from '@/appComponents/format'
import { useUserContext } from '@/common/context/user/UserProvider'
import { AddressEnum } from '@/common/enums/AddressEnum'
import usePrevious from '@/common/hooks/usePrevious'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'
import Spinner from '@/components/atoms/Spinner'
import Text from '@/components/atoms/Text'
import Update from '@/components/atoms/Update'
import { Accordion, AccordionContent, AccordionTrigger, AccordionItem } from '@/components/molecules/Accordion'
import { modalHeaderVariants, modalDividerVariants } from '@/components/molecules/CompletedActivityItem/CompletedActivityItem.variants'
import { Modal, ModalContent, ModalTitle } from '@/components/molecules/Modal'
import { ORDER_STATUS_LOCKED } from '@/constants/order'
import { activities } from '@/enums/ActivitiesEnum'
import RestartIcon from '@/public/images/ArrowClockwise.svg'
import BirdSuccess from '@/public/images/Bird_success.svg'
import BirdWarning from '@/public/images/Birdwarning.svg'
import CalendarCancel from '@/public/images/CalendarCancel.svg'
import CalendarPlus from '@/public/images/CalendarPlus.svg'
import Calendar from '../Calendar'
import FromAddress from '../FromAddress'
import ToAddress from '../ToAddress'
import {
  accordionButtonWrapperVariants,
  accordionItemWrapperVariants,
  addressAndDateWrapperVariants,
  textWrapperVariants,
  buttonWrapperVariants,
  contentVariants,
  loadingContainerVariants,
  modalImageWrapperVariants,
  spinnerWrapperVariants,
  startNewMoveButtonVariants,
  styledAccordionItemVariants,
  toAddressTextVariants,
  addDateIconWrapperVariants,
} from './AddressAndDate.variants'

interface AddressAndDateProps {
  hasPartner?: boolean
}

const AddressAndDate = ({ hasPartner = false }: AddressAndDateProps) => {
  const { t, i18n } = useTranslation(['movePage', 'common'])
  const locale = i18n.language
  const userData = useUserContext()
  const {
    user: {
      currentMove: { movingDate, fromAddress, toAddress, addressStatus, movingInDate },
      currentMove,
    },
  } = userData

  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState<undefined | Date>(undefined)
  const [selectedMoveInDay, setSelectedMoveInDay] = useState<undefined | Date>(undefined)
  const { updateMovingDate } = useUserContext()
  const newMovingDate = movingDate && new Date(movingDate)
  const newMovingInDate = movingInDate && new Date(movingInDate)
  const daysLeftUntilMove = newMovingDate && (Math.ceil((newMovingDate.getTime() - Date.now()) / (1000 * 3600 * 24)) || 0)
  const moveIsFinished = newMovingDate && Number(daysLeftUntilMove) < 0
  const daysLeftUntilMoveIn = newMovingInDate && (Math.ceil((newMovingInDate.getTime() - Date.now()) / (1000 * 3600 * 24)) || 0)
  const moveInIsFinished = newMovingInDate && Number(daysLeftUntilMoveIn) < 0
  const isStepsFinished =
    (activities.filter((x) => {
      const moveStep = currentMove && x in currentMove ? currentMove[x as keyof typeof currentMove] : null
      return moveStep && (moveStep as ServiceState | AdvancedServiceState).state === ORDER_STATUS_LOCKED
    })?.length || 0) > 0
  const [isAddressLoading, setIsAddressLoading] = useState(true)
  const [accordionValue, setAccordionValue] = useState('')
  const prevAccordionValue = usePrevious(accordionValue)
  const [autoCompleteUsed, setAutoCompleteUsed] = useState(false)
  const [openStartNewMoveModal, setOpenStartNewMoveModal] = useState(false)
  const [acceptNewMoveModal, setAcceptNewMoveModal] = useState(false)
  const [showSecondCalendar, setShowSecondCalendar] = useState(
    newMovingInDate && formatDate(new Date(newMovingInDate), 'yyyy-MM-dd') !== formatDate(new Date(newMovingDate), 'yyyy-MM-dd') ? !!newMovingInDate : false,
  )

  useEffect(() => {
    if (accordionValue === '') {
      setAutoCompleteUsed(false)
    } else {
      setTimeout(() => {
        setAutoCompleteUsed(true)
      }, 300)
    }
  }, [accordionValue])

  useEffect(() => {
    if (addressStatus === AddressEnum.STATUS_READY || addressStatus === AddressEnum.STATUS_EMPTY) setIsAddressLoading(false)
  }, [addressStatus])

  const handleStartNewMove = async (val: boolean) => {
    setAcceptNewMoveModal(val)
    await userData.archiveMove().then(() => {
      router.refresh()
    })
  }

  useEffect(() => {
    if (selectedDay && formatDate(selectedDay, 'yyyy-MM-dd') !== formatDate(new Date(movingDate), 'yyyy-MM-dd')) {
      updateMovingDate(selectedDay)
      setAccordionValue('')
    }
  }, [selectedDay, movingDate])

  useEffect(() => {
    if (selectedDay && selectedMoveInDay && formatDate(selectedMoveInDay, 'yyyy-MM-dd') !== formatDate(new Date(movingInDate), 'yyyy-MM-dd')) {
      updateMovingDate(selectedDay, selectedMoveInDay)
      setAccordionValue('')
    }
  }, [selectedMoveInDay, movingInDate])

  return (
    <div className={addressAndDateWrapperVariants({ autoCompleteUsed, isOneMovedate: !showSecondCalendar, hasPartner })} data-testid="address-and-date-container">
      {isAddressLoading ? (
        <Flex className={loadingContainerVariants()} direction="column" alignItems="center" justifyContent="center">
          <Text variant="extraLargeBold">{t('common:MOVEPROFILE.addressLoading')}</Text>
          <div className={spinnerWrapperVariants()}>
            <Spinner color="white" />
          </div>
        </Flex>
      ) : (
        <>
          <Modal open={openStartNewMoveModal}>
            <ModalContent bigCloseButton withCloseButton setShowModal={setOpenStartNewMoveModal}>
              <div className={modalHeaderVariants()}>
                <ModalTitle>
                  <Text spacing="none" className="!font-bold !text-[16px]">
                    {t('STARTNEWMOVEMODAL.startNewMoveTitle')}
                  </Text>
                </ModalTitle>
              </div>
              <div className={modalDividerVariants()} />
              <div className={contentVariants()}>
                <div className={modalImageWrapperVariants()}>
                  <BirdWarning width={190} height={147} />
                </div>
                <Text variant="body">{t('STARTNEWMOVEMODAL.startNewMoveText')}</Text>
                <Flex className="py-2" justifyContent="center">
                  <div className={buttonWrapperVariants()}>
                    <Button withFullWidth onClick={() => setOpenStartNewMoveModal(false)} padding="2px 24px" text={t('common:cancel')} variant="outline" />
                  </div>
                  <div className={buttonWrapperVariants()}>
                    <Button
                      padding="2px 24px"
                      withFullWidth
                      onClick={() => {
                        setOpenStartNewMoveModal(false)
                        setAcceptNewMoveModal(true)
                      }}
                      text={t('STARTNEWMOVEMODAL.startNewBtnText')}
                      variant="primaryAlt"
                    />
                  </div>
                </Flex>
              </div>
            </ModalContent>
          </Modal>
          <Modal open={acceptNewMoveModal}>
            <ModalContent bigCloseButton withCloseButton setShowModal={handleStartNewMove}>
              <div className={modalHeaderVariants()}>
                <ModalTitle>
                  <Text spacing="none" className="!font-bold !text-[16px]">
                    {t('STARTNEWMOVEMODAL.startedNewMoveTitle')}
                  </Text>
                </ModalTitle>
              </div>
              <div className={modalDividerVariants()} />
              <div className={contentVariants()}>
                <div className={modalImageWrapperVariants()}>
                  <BirdSuccess width={215} height={168} />
                </div>
                <Text variant="body">{t('STARTNEWMOVEMODAL.startedNewMoveText')}</Text>
                <Flex className="py-2" justifyContent="center">
                  <div className={buttonWrapperVariants()}>
                    <Button padding="2px 24px" withFullWidth onClick={() => handleStartNewMove(false)} text={`${t('common:okayText')}`} variant="primaryAlt" />
                  </div>
                </Flex>
              </div>
            </ModalContent>
          </Modal>
          <Accordion
            type="single"
            collapsible
            className="mt-0"
            value={accordionValue}
            onValueChange={(value) => {
              if (value !== prevAccordionValue && value !== '' && prevAccordionValue !== '') {
                setAccordionValue('')
                setTimeout(() => {
                  setAccordionValue(value)
                }, 100)
              } else {
                setAccordionValue(value)
              }
            }}
          >
            <div className={accordionItemWrapperVariants()} style={{ marginTop: 0 }}>
              <AccordionItem key="from-address" value="from-address" className={styledAccordionItemVariants()}>
                <div className={accordionButtonWrapperVariants()}>
                  <AccordionTrigger lessHeight className="!py-4">
                    <div className={toAddressTextVariants()}>
                      <Text variant="large" spacing="none">{`${t('common:from')}`}</Text>
                    </div>
                    {fromAddress?.street ? <div className={textWrapperVariants()}>{fromAddress.street}</div> : <Update text={t('common:update') ?? ''} className="!mr-10" />}
                  </AccordionTrigger>
                </div>
                <AccordionContent className="fromAddress" noPadding>
                  <FromAddress setAccordionValue={setAccordionValue} />
                </AccordionContent>
              </AccordionItem>
            </div>
            <div className={accordionItemWrapperVariants()}>
              <AccordionItem key="to-address" value="to-address" className={styledAccordionItemVariants()}>
                <div className={accordionButtonWrapperVariants()}>
                  <AccordionTrigger lessHeight className="!py-4">
                    <div className={toAddressTextVariants()}>
                      <Text variant="large" spacing="none">{`${t('common:INFOMISSING.toAddressTitle')}`}</Text>
                    </div>
                    {toAddress?.street ? <div className={textWrapperVariants()}>{toAddress.street}</div> : <Update text={t('common:update') ?? ''} className="!mr-10" />}
                  </AccordionTrigger>
                </div>
                <AccordionContent className="toAddress" noPadding>
                  <ToAddress setAccordionValue={setAccordionValue} />
                </AccordionContent>
              </AccordionItem>
            </div>
            <div className={accordionItemWrapperVariants({ withIcon: true })}>
              <AccordionItem key="calendar" value="calendar" className={styledAccordionItemVariants()}>
                <div className={accordionButtonWrapperVariants({ isCustomButton: true })}>
                  <AccordionTrigger lessHeight className="!py-4">
                    <div className={toAddressTextVariants()}>
                      <Text variant="large" spacing="none">{`${showSecondCalendar ? t('common:moveOut') : t('common:when')}`}</Text>
                    </div>
                    {moveIsFinished && !isStepsFinished ? (
                      <div
                        className={textWrapperVariants()}
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenStartNewMoveModal(true)
                        }}
                      >
                        <Flex alignItems="center">
                          <RestartIcon />
                          <div className={startNewMoveButtonVariants()}>{t('STARTNEWMOVEMODAL.startNewMoveTitle')}</div>
                        </Flex>
                      </div>
                    ) : movingDate ? (
                      <div className={textWrapperVariants()}>
                        {newMovingDate &&
                          `${newMovingDate.toLocaleDateString(locale, {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}`}
                      </div>
                    ) : (
                      <Update text={t('common:update') ?? ''} className="!mr-10" />
                    )}
                  </AccordionTrigger>
                </div>
                <AccordionContent className="calendar" noPadding>
                  <Calendar movingDate={movingDate || new Date()} setAccordionValue={setAccordionValue} />
                </AccordionContent>
              </AccordionItem>
              {!showSecondCalendar && (
                <button type="button" className={addDateIconWrapperVariants()} data-testid="add-second-date" aria-label={t('common:moveIn')} onClick={() => setShowSecondCalendar(true)}>
                  <CalendarPlus />
                </button>
              )}
            </div>
            {showSecondCalendar && (
              <div className={accordionItemWrapperVariants({ withIcon: true })}>
                <AccordionItem key="calendar-move-in" value="calendar-move-in" className={styledAccordionItemVariants()}>
                  <div className={accordionButtonWrapperVariants({ isCustomButton: true })}>
                    <AccordionTrigger lessHeight className="!py-4">
                      <div className={toAddressTextVariants()}>
                        <Text variant="large" spacing="none">{`${t('common:moveIn')}`}</Text>
                      </div>
                      {moveInIsFinished && !isStepsFinished ? (
                        <div className={textWrapperVariants()}>
                          <Flex
                            alignItems="center"
                            onClick={() => {
                              setOpenStartNewMoveModal(true)
                            }}
                          >
                            <RestartIcon />
                            <div className={startNewMoveButtonVariants()}>{t('STARTNEWMOVEMODAL.startNewMoveTitle')}</div>
                          </Flex>
                        </div>
                      ) : movingInDate ? (
                        <div className={textWrapperVariants()}>
                          {newMovingInDate &&
                            `${newMovingInDate.toLocaleDateString(locale, {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}`}
                        </div>
                      ) : (
                        <Update text={t('common:update') ?? ''} className="!mr-10" />
                      )}
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="calendar-move-in" noPadding>
                    <Calendar movingDate={movingInDate || new Date()} setAccordionValue={setAccordionValue} isMoveInDate={true} />
                  </AccordionContent>
                </AccordionItem>
                <button
                  type="button"
                  className={addDateIconWrapperVariants()}
                  aria-label={t('common:cancel')}
                  onClick={() => {
                    const moveOutDate = movingDate ? new Date(movingDate) : new Date()
                    updateMovingDate(moveOutDate, moveOutDate)
                    setSelectedMoveInDay(undefined)
                    setShowSecondCalendar(false)
                  }}
                >
                  <CalendarCancel />
                </button>
              </div>
            )}
          </Accordion>
        </>
      )}
    </div>
  )
}

export default AddressAndDate
