'use client'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-time-picker/dist/TimePicker.css'
import { useRouter } from 'next/navigation'
import { Event } from '@/lib/interfaces/event.interface'
import { API_BASE_URL } from '@/lib/constants'
import toast from 'react-hot-toast'

export default function VoucherCreate() {
  const router = useRouter()

  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<string>('09:00')
  const [endTime, setEndTime] = useState<string>('18:00')
  const [event, setEvent] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null)

  // add 7 hours to the Date and return a valid ISO-8601 string.
  const toAdjustedISOString = (date: Date): string => {
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000)
    return adjustedDate.toISOString()
  }

  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number)
    const combined = new Date(date)
    combined.setHours(hours || 0, minutes, 0, 0)
    return combined
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      eventId: '',
      startDate: '',
      endDate: '',
      startTime: '09:00',
      endTime: '18:00',
      discountAmount: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Judul Wajib Diisi'),
      eventId: Yup.string().required('Acara Wajib Diisi'),
      startDate: Yup.string().required('Tanggal Mulai Wajib Diisi'),
      endDate: Yup.string().required('Tanggal Akhir Wajib Diisi'),
      startTime: Yup.string().required('Waktu Mulai Wajib Diisi'),
      endTime: Yup.string().required('Waktu Berakhir Wajib Diisi'),
      discountAmount: Yup.number().required('Jumlah Diskon Wajib Diisi')
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!startDate || !endDate) {
        alert('Silakan pilih Tanggal Mulai dan Tanggal Akhir.')
        return
      }

      const voucherData = {
        title: values.title,
        eventId: Number(values.eventId),
        discountAmount: Number(values.discountAmount),
        startDate: values.startDate,
        endDate: values.endDate
      }

      try {
        const response = await fetch(`${API_BASE_URL}/voucher`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(voucherData)
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Voucher Created Successfully:', data)
          toast.success('Voucher berhasil dibuat')
          resetForm()
          router.push('/')
          setStartDate(null)
          setEndDate(null)
          setSelectedEvent(null)
        } else {
          const errorData = await response.json()
          console.error('Error Creating Voucher:', errorData)
          toast.error('Error membuat voucher')
        }
      } catch (error) {
        console.error('Network Error:', error)
        toast.error('Terjadi kesalahan jaringan, silakan coba lagi.')

      }
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await fetch(`${API_BASE_URL}/event`)
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
      <div className='min-h-screen w-full bg-white py-[100px]'>
        <div className='flex flex-col items-center justify-center gap-[50px]'>
          {/* Voucher Container */}
          <div className='flex w-full flex-col rounded-[20px] border xl:w-[900px]'>
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
              {formik.submitCount > 0 && formik.errors.eventId && (
                <div className='mt-1 text-red-500'>{formik.errors.eventId}</div>
              )}
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
                          formik.setFieldValue('eventId', ev.id)
                        }}
                      >
                        {ev.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>

              <hr />
              {formik.touched.discountAmount &&
                formik.errors.discountAmount && (
                  <div className='text-red-500'>
                    {formik.errors.discountAmount}
                  </div>
                )}
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
                    {formik.submitCount > 0 && formik.errors.startDate && (
                      <div className='text-red-500'>
                        {formik.errors.startDate}
                      </div>
                    )}
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date | null) => {
                        setStartDate(date)
                        if (date && startTime) {
                          const combined = combineDateAndTime(date, startTime)
                          formik.setFieldValue(
                            'startDate',
                            toAdjustedISOString(combined)
                          )
                        } else {
                          formik.setFieldValue('startDate', '')
                        }
                      }}
                      className='w-full rounded border p-2'
                      placeholderText='Select date'
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
                        value={startTime}
                        onChange={(e) => {
                          setStartTime(e.target.value)
                          if (startDate) {
                            const combined = combineDateAndTime(
                              startDate,
                              e.target.value
                            )
                            formik.setFieldValue(
                              'startDate',
                              toAdjustedISOString(combined)
                            )
                          }
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* End Date & Time */}
                  <div className='z-30 flex w-[30%] flex-col gap-4'>
                    <label>Tanggal Akhir</label>
                    {formik.submitCount > 0 && formik.errors.endDate && (
                      <div className='text-red-500'>
                        {formik.errors.endDate}
                      </div>
                    )}
                    <DatePicker
                      selected={endDate}
                      onChange={(date: Date | null) => {
                        setEndDate(date)
                        if (date && endTime) {
                          const combined = combineDateAndTime(date, endTime)
                          formik.setFieldValue(
                            'endDate',
                            toAdjustedISOString(combined)
                          )
                        } else {
                          formik.setFieldValue('endDate', '')
                        }
                      }}
                      className='w-full rounded border p-2'
                      placeholderText='Select date'
                    />
                    <label>Waktu Akhir</label>
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
                        value={endTime}
                        onChange={(e) => {
                          setEndTime(e.target.value)
                          if (endDate) {
                            const combined = combineDateAndTime(
                              endDate,
                              e.target.value
                            )
                            formik.setFieldValue(
                              'endDate',
                              toAdjustedISOString(combined)
                            )
                          }
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='z-30'>
                <div className='flex justify-center'>
                  <button
                    className='z-30 h-[39px] w-[180px] rounded-lg bg-[#0049CC] font-bold text-white md:w-[190px] lg:w-[190px]'
                    type='submit'
                  >
                    Buat Voucher
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
