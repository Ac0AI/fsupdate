'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useRouter } from 'next/navigation'
import { Booking } from '@/types/booking'
import CompletedBookingActivityCard from '@/components/molecules/CompletedBookingActivityCard'
import Text from '@/components/atoms/Text'
import { BOOKING_STATUS_UPCOMING, BOOKING_STATUS_CONFIRMED, BOOKING_STATUS_COMPLETED, BOOKING_TYPE_MOVEHELP } from '@/constants/booking'
import i18nConfig from 'i18nConfig'
import { containerVariants, sectionTitleVariants } from './CompletedBookingsSection.variants'
import { toDemoPath } from '@/common/utils/demoNavigation'

interface CompletedBookingsSectionProps {
  initialBookings: Booking[]
}

const CompletedBookingsSection: React.FC<CompletedBookingsSectionProps> = ({ initialBookings }) => {
  const { t } = useTranslation(['movePage', 'bookings'])
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) || i18nConfig.defaultLocale

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const hasConfirmedMovehelp = initialBookings.some((b) => b.type === BOOKING_TYPE_MOVEHELP && (b.status === BOOKING_STATUS_CONFIRMED || b.status === BOOKING_STATUS_COMPLETED))

  const completedBookings = initialBookings.filter((booking) => {
    const deliveryDate = new Date(booking.date)
    deliveryDate.setHours(0, 0, 0, 0)
    const isBeforeOrToday = deliveryDate >= today

    if (booking.type === BOOKING_TYPE_MOVEHELP && booking.status === BOOKING_STATUS_UPCOMING && hasConfirmedMovehelp) {
      return false
    }

    if (booking.status === BOOKING_STATUS_UPCOMING || booking.status === BOOKING_STATUS_CONFIRMED) {
      return true
    }

    if (booking.status === BOOKING_STATUS_COMPLETED && isBeforeOrToday) {
      return true
    }

    return false
  })

  const handleBookingClick = (booking: Booking) => {
    router.push(toDemoPath(`/${locale}/app/bookings?bookingId=${booking.id}`))
  }

  if (completedBookings.length === 0) {
    return null
  }

  return (
    <div className={containerVariants()}>
      <Text className={sectionTitleVariants()} spacing="none">
        {t('CHECKLIST_SECTION.completed')}
      </Text>
      {completedBookings.map((booking) => (
        <CompletedBookingActivityCard key={booking.id} booking={booking} onClick={handleBookingClick} />
      ))}
    </div>
  )
}

export default CompletedBookingsSection
