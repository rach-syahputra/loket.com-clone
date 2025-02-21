'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoadingDots from '@/components/loading-dots'
import { API_BASE_URL } from '@/lib/constants'

interface Event {
  id: number
  title: string
  registrationStartDate: string | Date
  registrationEndDate: string | Date
  eventStartDate: string | Date
  eventEndDate: string | Date
  eventStartTime: string
  eventEndTime: string

  price: number
  description: string
  bannerUrl: string
  location: {
    streetAddress: string
    city: string
  }
  organizerId: number
  organizer?: {
    pictureUrl: string
    name: string
  }
}
export default function DetailPage() {
  const [activeTab, setActiveTab] = useState(1)
  const [event, setEvent] = useState<Event | null>(null)
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const { slug } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [id, setId] = useState(0)

  

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
      setId(session.user.id)
    }
  }, [session])

  useEffect(() => {
    if (!slug) return
    fetch(`${API_BASE_URL}/event/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('API response:', data)
        if (data.result) {
          setEvent(data.result)
        }
      })
      .catch((error) => {
        console.log('Error fetching detail page', error)
      })
  }, [slug])

  if (!event) {
    return (
      <div className='flex h-screen w-screen items-center justify-center'>
        <LoadingDots />
      </div>
    )
  }

  

  function formatDate(date: string | Date) {
    if (!date) return ''
    const parsedDate = new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(parsedDate)
  }

  function formatTime(date: string | Date): string {
    if (!date) return ''
    const parsedDate = new Date(date)
    return parsedDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }


  const handleBuyTicket = async () => {
    try {
      const totalPrice = event.price * ticketQuantity
      const res = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: id,
          eventId: event.id,
          transactionStatus: 'WAITING_FOR_PAYMENT',
          totalPrice: totalPrice
        })
      })
      const data = await res.json()
      console.log('Transaction created successfully', data)

      router.push(
        `/transaction?id=${event.id}&title=${encodeURIComponent(event.title)}&price=${event.price}&quantity=${ticketQuantity}&location=${encodeURIComponent(
          event.location.streetAddress + ', ' + event.location.city
        )}&startDate=${event.registrationStartDate}&endDate=${event.registrationEndDate}&bannerUrl=${encodeURIComponent(
          event.bannerUrl || ''
        )}`
      )
    } catch (error) {
      console.error('Error creating transaction:', error)
      alert(`Error creating transaction: ${error}`)
    }
  }

  return (
    <div className='min-h-screen w-full bg-white pb-[120px] lg:p-[100px]'>
      <div className='p-[20px] lg:p-0'>
        <div className='flex flex-col gap-[50px] lg:flex-row'>
          {/* Left Section */}
          <div className='flex w-full flex-col gap-[20px] lg:w-[720px]'>
            {/* Image Section */}
            <div className='w-full'>
              <div className='rounded-xl border'>
                <Image
                  className='w-full rounded-t-lg'
                  src={event.bannerUrl}
                  width={720}
                  height={340}
                  alt='Event Banner'
                />
                <div className='flex lg:hidden lg:flex-col lg:gap-[70px]'>
                  <div className='flex w-[360px] flex-col justify-between gap-4 bg-white p-[30px] text-black sm:w-full'>
                    <span>{event?.title}</span>
                    <div className='flex gap-4'>
                      <span>
                        <Image
                          src='/calendar.png'
                          width={20}
                          height={20}
                          alt='Calendar'
                        />
                      </span>
                      <span>
                        {`${formatDate(event.registrationStartDate)} - ${formatDate(
                          event.registrationEndDate
                        )}`}
                      </span>
                    </div>
                    <div className='flex gap-4'>
                      <span>
                        <Image
                          src='/clock.png'
                          width={20}
                          height={20}
                          alt='Clock'
                        />
                      </span>
                      <span>
                        {`${event.eventStartTime} - ${event.eventEndTime} WIB`}
                      </span>
                    </div>
                    <div className='flex gap-4'>
                      <span>
                        <Image
                          src='/location.png'
                          width={20}
                          height={20}
                          alt='Location'
                        />
                      </span>
                      <span>{`${event.location.streetAddress}, ${event.location.city}`}</span>
                    </div>
                    <hr />
                    <div className='flex items-center gap-4'>
                      <div className='relative h-[58px] w-[58px] overflow-hidden rounded-full border'>
                        <Image
                          src={event?.organizer?.pictureUrl || ''}
                          fill
                          alt='Organizer'
                          className='rounded-full object-cover'
                        />
                      </div>
                      <span className='font-light text-black'>
                        {event?.organizer?.name}
                      </span>
                    </div>
                  </div>
                  <div className='hidden h-[270px] w-[360px] flex-col justify-between gap-4 rounded-xl border bg-white p-[30px] text-black lg:flex'>
                    <div className='flex justify-between'>
                      <span>Tiket</span>
                      <span>Rp5.000.000</span>
                    </div>
                    <hr />
                    <div className='flex justify-between'>
                      <span>Total 1 tiket</span>
                      <span>Rp5.000.000</span>
                    </div>
                    <div className='z-50'>
                      <button
                        className='h-[48px] w-[312px] rounded-lg bg-[#0049CC] p-[10px] font-bold text-white'
                        onClick={handleBuyTicket}
                      >
                        Beli Tiket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className='tabs tabs-bordered relative z-20 w-full'>
              <button
                type='button'
                role='tab'
                className={`tab ${activeTab === 1 ? 'tab-active' : ''} text-black`}
                onClick={() => setActiveTab(1)}
              >
                DESKRIPSI
              </button>
              <button
                type='button'
                role='tab'
                className={`tab ${activeTab === 2 ? 'tab-active' : ''} text-black`}
                onClick={() => setActiveTab(2)}
              >
                TIKET
              </button>
            </div>

            {/* Tab Content */}
            <div className='mt-4'>
              {activeTab === 1 && (
                <div className='text-black'>{event?.description}</div>
              )}
              {activeTab === 2 && (
                <div>
                  <div className='rounded-lg border border-[#0049CC] bg-[#EBF5FF] p-[20px] text-black'>
                    <div className='flex flex-col gap-4'>
                      <span>{event?.title}</span>
                      <div className='flex gap-4'>
                        <span>
                          <Image
                            src='/clock.png'
                            width={20}
                            height={20}
                            alt='Clock'
                          />
                        </span>
                        <p>{`Mulai ${formatDate(event.registrationStartDate)}, Berakhir ${formatDate(event.registrationEndDate)}`}</p>
                      </div>
                      <hr className='bg-[#0049CC]' />
                      <div className='flex justify-between font-bold'>
                        <span>{`Rp ${event?.price.toLocaleString()}`}</span>
                        <div className='flex gap-4'>
                          <button
                            className='relative z-30 h-[24px] w-[24px] rounded-full border border-[#0049CC] bg-[#EBF5FF]'
                            onClick={() =>
                              setTicketQuantity((prev) => Math.max(prev - 1, 1))
                            }
                          >
                            <div className='absolute bottom-1 left-2'>-</div>
                          </button>
                          <span>{ticketQuantity}</span>
                          <button
                            className='relative z-30 h-[24px] w-[24px] rounded-full border border-[#0049CC] bg-[#EBF5FF]'
                            onClick={() =>
                              setTicketQuantity((prev) => prev + 1)
                            }
                          >
                            <div className='absolute bottom-0 left-2'>+</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className='hidden lg:flex lg:flex-col lg:gap-[70px]'>
            <div className='flex w-[360px] flex-col justify-between gap-4 rounded-xl border bg-white p-[30px] text-black'>
              <span>{event?.title}</span>
              <div className='flex gap-4'>
                <span>
                  <Image
                    src='/calendar.png'
                    width={20}
                    height={20}
                    alt='Calendar'
                  />
                </span>
                {`${formatDate(event.registrationStartDate)} - ${formatDate(
                  event.registrationEndDate
                )}`}
              </div>
              <div className='flex gap-4'>
                <span>
                  <Image src='/clock.png' width={20} height={20} alt='Clock' />
                </span>
                {`${event.eventStartTime} - ${event.eventEndTime} WIB`}
              </div>
              <div className='flex gap-4'>
                <span>
                  <Image
                    src='/location.png'
                    width={20}
                    height={20}
                    alt='Location'
                  />
                </span>
                <span>{`${event.location.streetAddress}, ${event.location.city}`}</span>
              </div>
              <hr />
              <div className='flex items-center gap-4'>
                <div className='relative h-[58px] w-[58px] overflow-hidden rounded-full border'>
                  <Image
                    src={event?.organizer?.pictureUrl || ''}
                    fill
                    alt='Organizer'
                    className='rounded-full object-cover'
                  />
                </div>
                <span className='font-light text-black'>
                  {event?.organizer?.name}
                </span>
              </div>
            </div>
            <div className='hidden h-[270px] w-[360px] flex-col justify-between gap-4 rounded-xl border bg-white p-[30px] text-black lg:flex'>
              <div className='flex justify-between'>
                <span>Tiket</span>
                <span>{`Rp ${(event?.price * ticketQuantity).toLocaleString()}`}</span>
              </div>
              <hr />
              <div className='flex justify-between'>
                <span>Total {ticketQuantity} tiket</span>
                <span>{`Rp ${(event?.price * ticketQuantity).toLocaleString()}`}</span>
              </div>
              <div className='z-50'>
                <button
                  className='h-[48px] w-[312px] rounded-lg bg-[#0049CC] p-[10px] font-bold text-white'
                  onClick={handleBuyTicket}
                >
                  Beli Tiket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Section */}
      <div className='fixed bottom-0 z-50 flex h-[120px] w-screen flex-col gap-4 bg-white p-[20px] text-black opacity-100 lg:hidden'>
        <div className='flex justify-between'>
          <span>Total {ticketQuantity} tiket</span>
          <span>{`Rp ${(event?.price * ticketQuantity).toLocaleString()}`}</span>
        </div>
        <div className='z-50'>
          <button
            className='h-[48px] w-full rounded-lg bg-[#0049CC] p-[10px] font-bold text-white'
            onClick={handleBuyTicket}
          >
            Beli Tiket
          </button>
        </div>
      </div>
    </div>
  )
}
