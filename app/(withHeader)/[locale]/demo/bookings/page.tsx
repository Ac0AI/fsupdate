import React from 'react'
import { mockBookings } from '@/common/data/mockBookings'
import BookingsClientPage from '../../app/bookings/ClientPage'

/**
 * Bokningsvyn utan backend. Ordrarna hämtas normalt serversidigt via
 * getMyOrdersServer, så här skickas fixturerna rakt in i stället.
 */
export default function DemoBookingsPage() {
  return (
    <div className="motion-safe:animate-[rise_.4s_var(--ease-out-expo)_both]">
      <BookingsClientPage initialBookings={mockBookings} />
    </div>
  )
}
