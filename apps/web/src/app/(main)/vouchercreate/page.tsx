'use client'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-time-picker/dist/TimePicker.css'

export default function VoucherCreate() {
  interface EventList {
    id: number
    title: string
  }

  // Local state variables for modals and dates
  const [modalTicketPaid, setModalTicketPaid] = useState(false)
  const [modalTicketFree, setModalTicketFree] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [endTicketDate, setEndTicketDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<string>('09:00')
  const [endTime, setEndTime] = useState<string>('18:00')
  const [startEventDate, setStartEventDate] = useState<Date | null>(null)
  const [endEventDate, setEndEventDate] = useState<Date | null>(null)

  // For dropdowns
  const [event, setEvent] = useState<EventList[]>([])
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  // For ticket type (PAID / FREE)
  const [ticketType, setTicketType] = useState('')

  // Helper: add 7 hours to the Date and return a valid ISO-8601 string.
  const toAdjustedISOString = (date: Date): string => {
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
    return adjustedDate.toISOString()
  }

  // Helper to combine a date and a time string (HH:mm) into a Date object.
  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number)
    const combined = new Date(date)
    combined.setHours(hours, minutes, 0, 0)
    return combined
  }

  // Set up Formik with an added eventId field and consistent field names.
  const formik = useFormik({
    initialValues: {
      title: '',
      eventId: '', // Added eventId for the selected event
      startDate: toAdjustedISOString(new Date()),
      endDate: toAdjustedISOString(new Date(Date.now() + 86400000)),
      startTime: '09:00',
      endTime: '18:00',
      discountAmount: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      eventId: Yup.string().required('Event selection is required'),
      startDate: Yup.string().required('Start Date is required'),
      endDate: Yup.string().required('End Date is required'),
      startTime: Yup.string().required('Waktu mulai wajib diisi'),
      endTime: Yup.string().required('Waktu berakhir wajib diisi'),
      discountAmount: Yup.number().required('Jumlah Diskon Wajib Diisi')
    }),
    onSubmit: async (values, { resetForm }) => {
      // Build the voucherData object, including eventId.
      const voucherData = {
        title: values.title,
        eventId: Number(values.eventId),
        discountAmount: Number(values.discountAmount),
        startDate: values.startDate,
        endDate: values.endDate
      }

      try {
        const response = await fetch('http://localhost:8000/api/voucher', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(voucherData)
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Voucher Created Successfully:', data)
          alert('Voucher Created Successfully')
          resetForm()
        } else {
          const errorData = await response.json()
          console.error('Error Creating Voucher:', errorData)
          alert('Error Creating Voucher')
        }
      } catch (error) {
        console.error('Network Error:', error)
        alert('A Network Error Occurred, Please Try Again')
      }
    }
  })

  // Fetch events from your API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await fetch('http://localhost:8000/api/event')
        const eventData = await eventResponse.json()
        if (eventData.result) {
          setEvent(eventData.result)
        }
      } catch (error) {
        console.log('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className='h-full w-full bg-white py-[100px]'>
        <div className='flex flex-col items-center justify-center gap-[50px]'>
          {/* Banner Section */}
          <div className='flex flex-col rounded-[20px] border sm:w-[900px]'>
            {/* Voucher Details */}
            <div className='flex flex-col gap-4 p-[20px] sm:p-[50px]'>
              {formik.touched.title && formik.errors.title && (
                <div className='text-red-500'>{formik.errors.title}</div>
              )}
              <input
                type='text'
                className='z-50 border-none p-0 text-[24px] focus:outline-none focus:ring-0'
                placeholder='Nama Voucher*'
                name='title'
                id='title'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.title}
              />

              {/* Event Dropdown */}
              <details className='dropdown z-50'>
                <summary className='btn btn-ghost m-0 flex w-full justify-start border bg-white p-2 font-light text-[#ADBAD1] hover:bg-white'>
                  {selectedEvent
                    ? event.find((ev) => ev.id === selectedEvent)?.title
                    : 'Pilih Event*'}
                </summary>
                <ul className='menu dropdown-content rounded-box z-[1] w-full bg-white p-2 shadow'>
                  {event.map((ev) => (
                    <li key={ev.id}>
                      <button
                        type='button'
                        className='text-black no-underline'
                        onClick={() => {
                          setSelectedEvent(ev.id)
                          formik.setFieldValue('eventId', ev.id) // set eventId here!
                        }}
                      >
                        {ev.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>

              <hr />

              <input
                type='text'
                className='z-40 border-none p-0 text-[20px] focus:outline-none focus:ring-0'
                placeholder='Jumlah Diskon*'
                name='discountAmount'
                id='discountAmount'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.discountAmount}
              />

              <div>
                <span className='flex justify-center font-semibold'>
                  Tanggal & Waktu
                </span>
                <div className='flex justify-between'>
                  {/* Start Date & Time */}
                  <div className='z-30 flex w-[30%] flex-col gap-4'>
                    <label>Tanggal Mulai</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => {
                        setStartDate(date)
                        if (date && startTime) {
                          const combined = combineDateAndTime(date, startTime)
                          // Use 'startDate' consistently (all lowercase)
                          formik.setFieldValue('startDate', toAdjustedISOString(combined))
                        }
                      }}
                      className='w-full rounded border p-2'
                      placeholderText='Select a date'
                    />
                    <label>Waktu Mulai</label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5'>
                        <svg
                          className='h-4 w-4 text-gray-500'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            fillRule='evenodd'
                            d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <input
                        type='time'
                        id='startTime'
                        name='startTime'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        min='09:00'
                        max='18:00'
                        value={startTime}
                        onChange={(e) => {
                          setStartTime(e.target.value)
                          if (startDate) {
                            const combined = combineDateAndTime(startDate, e.target.value)
                            formik.setFieldValue('startDate', toAdjustedISOString(combined))
                          }
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* End Date & Time */}
                  <div className='z-30 flex w-[30%] flex-col gap-4'>
                    <label>Tanggal Berakhir</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => {
                        setEndDate(date)
                        if (date && endTime) {
                          const combined = combineDateAndTime(date, endTime)
                          formik.setFieldValue('endDate', toAdjustedISOString(combined))
                        }
                      }}
                      className='w-full rounded border p-2'
                      placeholderText='Select a date'
                    />
                    <label>Waktu Berakhir</label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5'>
                        <svg
                          className='h-4 w-4 text-gray-500'
                          aria-hidden='true'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            fillRule='evenodd'
                            d='M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <input
                        type='time'
                        id='endTime'
                        name='endTime'
                        className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        min='09:00'
                        max='18:00'
                        value={endTime}
                        onChange={(e) => {
                          setEndTime(e.target.value)
                          if (endDate) {
                            const combined = combineDateAndTime(endDate, e.target.value)
                            formik.setFieldValue('endDate', toAdjustedISOString(combined))
                          }
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Organizer Info (Mobile) */}
              <div className='flex flex-col gap-2 sm:grid sm:grid-cols-3'>
                <div className='mt-[5px] flex flex-col gap-4 sm:hidden'>
                  <span className='hidden text-[14px] font-medium text-black sm:flex'>
                    Diselenggarakan Oleh
                  </span>
                  <div className='flex items-center gap-4'>
                    <div className='h-[58px] w-[58px] overflow-hidden rounded-full border'>
                      <Image
                        src='https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png'
                        width={58}
                        height={58}
                        alt=''
                      />
                    </div>
                    <span className='font-light text-black'>
                      Andi Farrel Athalla Pasha
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  className='h-[39px] rounded-lg bg-[#0049CC] font-bold text-white md:w-[190px] lg:w-[190px] z-30'
                  type='submit'
                >
                  Buat Event Sekarang
                </button>
              </div>
            </div>
          </div>

         
         
        </div>
      </div>
    </form>
  )
}
