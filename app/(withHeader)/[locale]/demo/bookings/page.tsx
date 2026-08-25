import React from 'react'
import { mockBookings } from '@/common/data/mockBookings'
import BookingsClientPage from '../../app/bookings/ClientPage'

/**
 * Bokningsvyn utan backend. Ordrarna hämtas normalt serversidigt via
 * getMyOrdersServer, så här skickas fixturerna rakt in i stället.
 */
export default function DemoBookingsPage() {
  return <BookingsClientPage initialBookings={mockBookings} />
}
