'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import Link from 'next/link'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-time-picker/dist/TimePicker.css'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { API_BASE_URL } from '@/lib/constants'
import { Category } from '@/lib/interfaces/category.interface'
import { Province } from '@/lib/interfaces/location.interface'
import toast from 'react-hot-toast'

// Import SweetAlert2 and its React wrapper
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function CreateEvent() {
  const { data: session } = useSession()
  const router = useRouter()

  // Component states
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [userId, setUserId] = useState(0)
  const [modalDate, setModalDate] = useState(false)
  const [modalTime, setModalTime] = useState(false)
  const [modalLocation, setModalLocation] = useState(false)
  const [modalTicketPaid, setModalTicketPaid] = useState(false)
  const [modalTicketFree, setModalTicketFree] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [startTicketDate, setStartTicketDate] = useState<Date | null>(null)
  const [endTicketDate, setEndTicketDate] = useState<Date | null>(null)
  const [localEventStartTime, setLocalEventStartTime] = useState('09:00')
  const [localEventEndTime, setLocalEventEndTime] = useState('18:00')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('18:00')
  const [startEventDate, setStartEventDate] = useState<Date | null>(null)
  const [endEventDate, setEndEventDate] = useState<Date | null>(null)
  const [displayLocation, setDisplayLocation] = useState('Pilih Lokasi')
  const [displayCity, setDisplayCity] = useState('')
  const [category, setCategory] = useState<Category[]>([])
  const [province, setProvince] = useState<Province[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null)
  const [ticketType, setTicketType] = useState('')
  const [startDateError, setStartDateError] = useState('')
  const [endDateError, setEndDateError] = useState('')
  const [provinceError, setProvinceError] = useState('')
  const [ticketStartDateError, setTicketStartDateError] = useState('')
  const [ticketEndDateError, setTicketEndDateError] = useState('')
  const [freeStartDateError, setFreeStartDateError] = useState('')
  const [freeEndDateError, setFreeEndDateError] = useState('')
  const [dropdownCategoryError, setDropdownCategoryError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState('https://assets.loket.com/images/banner-event.jpg')

  // Fetch categories and provinces
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(`${API_BASE_URL}/categories`)
        const categoryData = await categoryResponse.json()
        if (categoryData.data) {
          setCategory(categoryData.data)
        }
        const provinceResponse = await fetch(`${API_BASE_URL}/provinces`)
        const provinceData = await provinceResponse.json()
        if (provinceData.data) {
          setProvince(provinceData.data)
        }
      } catch (error) {
        console.log('Error fetching data:', error)
      }
    }
    if (session?.user) {
      setName(session.user.name || '')
      setImage(session.user.image || '')
      setUserId(session.user.id)
    }
    fetchData()
  }, [session])

  // Utility functions
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

  const handleBannerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setBannerFile(file)
      const previewUrl = URL.createObjectURL(file)
      setBannerPreview(previewUrl)
    }
  }

  const isPaidModalFilled = () => {
    return (
      formik.values.availableSeats !== '' ||
      formik.values.price !== '' ||
      startTicketDate !== null ||
      endTicketDate !== null
    )
  }

  const isFreeModalFilled = () => {
    return (
      formik.values.availableSeats !== '' ||
      startEventDate !== null ||
      endEventDate !== null
    )
  }

  // SweetAlert2 confirmation helper function
  const confirmDialog = async (message: string): Promise<boolean> => {
    const result = await MySwal.fire({
      title: 'Konfirmasi',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, lanjutkan!',
      cancelButtonText: 'Tidak, batalkan'
    })
    return result.isConfirmed
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      registrationStartDate: toAdjustedISOString(new Date()),
      registrationEndDate: toAdjustedISOString(new Date(Date.now() + 86400000)),
      eventStartDate: toAdjustedISOString(new Date()),
      eventEndDate: toAdjustedISOString(new Date(Date.now() + 86400000)),
      eventStartTime: '09:00',
      eventEndTime: '18:00',
      price: '',
      availableSeats: '',
      categoryId: 0,
      ticketType: '',
      organizerId: 0,
      streetAddress: '',
      city: '',
      provinceId: 0
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Judul Wajib Diisi'),
      description: Yup.string().required('Deskripsi Wajib Diisi'),
      registrationStartDate: Yup.string().required('Tanggal Mulai Registrasi Wajib Diisi'),
      registrationEndDate: Yup.string().required('Tanggal Akhir Registrasi Wajib Diisi'),
      eventStartDate: Yup.string().required('Tanggal Mulai Acara Wajib Diisi'),
      eventEndDate: Yup.string().required('Tanggal Akhir Acara Wajib Diisi'),
      eventStartTime: Yup.string().required('Waktu Mulai Acara Wajib Diisi'),
      eventEndTime: Yup.string().required('Waktu Berakhir Wajib Diisi'),
      price: Yup.number().min(0).required('Harga Wajib Diisi'),
      availableSeats: Yup.number().min(50, 'Jumlah Tiket Minimal 50').required('Jumlah Kursi Wajib Diisi'),
      categoryId: Yup.number().required('Kategori Wajib Diisi'),
      ticketType: Yup.string().oneOf(['PAID', 'FREE']).required('Tipe Tiket Wajib Diisi'),
      organizerId: Yup.number().required('Organizer Wajib Diisi'),
      streetAddress: Yup.string().required('Alamat Wajib Diisi'),
      city: Yup.string().required('Kota Wajib Diisi'),
      provinceId: Yup.number().required('Provinsi Wajib Diisi')
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!selectedCategory) {
        setDropdownCategoryError('Kategori Wajib Diisi')
        return
      }
      const eventData = {
        slug: values.title.toLowerCase().trim().replace(/\s+/g, '-'),
        title: values.title,
        description: values.description,
        bannerUrl: 'https://assets.loket.com/images/banner-event.jpg',
        registrationStartDate: values.registrationStartDate,
        registrationEndDate: values.registrationEndDate,
        eventStartDate: values.eventStartDate,
        eventEndDate: values.eventEndDate,
        eventStartTime: values.eventStartTime,
        eventEndTime: values.eventEndTime,
        price: Number(values.price),
        availableSeats: Number(values.availableSeats),
        categoryId: Number(values.categoryId),
        ticketType: values.ticketType,
        organizerId: userId
      }
      const locationData = {
        streetAddress: values.streetAddress,
        city: values.city,
        provinceId: Number(values.provinceId)
      }

      const formData = new FormData()
      formData.append('eventData', JSON.stringify(eventData))
      formData.append('locationData', JSON.stringify(locationData))
      if (bannerFile) {
        formData.append('banner', bannerFile)
      }

      console.log('Sending FormData payload')

      try {
        const response = await fetch(`${API_BASE_URL}/eventcreate`, {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Event Created Successfully:', data)
          toast.success('Acara berhasil dibuat!')
          resetForm()
          router.push('/')
        } else {
          const errorData = await response.json()
          console.error('Error Creating Event:', errorData)
          toast.error('Gagal membuat event, coba lagi.')
        }
      } catch (error) {
        console.error('Network Error:', error)
        toast.error('Terjadi kesalahan jaringan, silakan coba lagi.')
      }
    }
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='image/*'
        style={{ display: 'none' }}
      />
      <div className='h-full w-full bg-white py-[100px]'>
        <div className='flex flex-col items-center justify-center gap-[50px]'>
          {/* Banner Section */}
          <div className='flex w-full flex-col rounded-[20px] border px-[5px] sm:px-0 xl:w-[900px]'>
            <div
              className='relative z-[29] h-[200px] w-full cursor-pointer sm:h-[421px] xl:sm:w-[900px]'
              onClick={handleBannerClick}
            >
              <Image
                src={bannerPreview}
                alt='Banner Preview'
                fill
                className='rounded-t-[20px] object-cover md:rounded-t-[70px] lg:rounded-t-[20px]'
              />
              <div
                className={`${
                  bannerPreview === 'https://assets.loket.com/images/banner-event.jpg'
                    ? 'block'
                    : 'hidden'
                } absolute bottom-[80px] left-[165px] flex flex-col gap-4 sm:bottom-[180px] sm:left-[355px] xl:left-[415px]`}
              >
                <Image src='/add.png' width={60} height={128} alt='' />
              </div>
              <div
                className={`${
                  bannerPreview === 'https://assets.loket.com/images/banner-event.jpg'
                    ? 'block'
                    : 'hidden'
                } absolute bottom-[50px] left-[100px] flex flex-col gap-4 sm:bottom-[130px] sm:left-[230px] xl:left-[290px]`}
              >
                <span className='text-[13px] sm:text-[24px]'>
                  Unggah gambar/poster/banner
                </span>
              </div>
            </div>
            {/* Event Details */}
            <div className='flex flex-col gap-4 p-[20px] sm:p-[50px]'>
              {formik.touched.title && formik.errors.title && (
                <div className='text-red-500'>{formik.errors.title}</div>
              )}
              <input
                type='text'
                className='z-30 border-none p-0 text-[24px] focus:outline-none focus:ring-0'
                placeholder='Nama Event*'
                name='title'
                id='title'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.title}
              />

              {/* Category Dropdown */}
              {dropdownCategoryError && (
                <div className='text-sm text-red-500'>{dropdownCategoryError}</div>
              )}
              <details className='dropdown z-[39]'>
                <summary className='btn btn-ghost m-0 flex w-full justify-start border bg-white p-2 font-light text-[#ADBAD1] hover:bg-white'>
                  {selectedCategory && selectedCategory > 0
                    ? category.find((cat) => cat.id === selectedCategory)?.name
                    : 'Pilih Kategori*'}
                </summary>
                <div className='z-[39]'>
                  <ul className='menu dropdown-content rounded-box w-full bg-white p-2 shadow'>
                    <li>
                      <button
                        type='button'
                        className='text-black no-underline'
                        onClick={() => {
                          setSelectedCategory(null)
                          formik.setFieldValue('categoryId', null)
                          setDropdownCategoryError('Kategori Wajib Diisi')
                        }}
                      >
                        Pilih Kategori
                      </button>
                    </li>
                    {category.map((cat) => (
                      <li key={cat.id}>
                        <button
                          type='button'
                          className='text-black no-underline'
                          onClick={() => {
                            setSelectedCategory(cat.id)
                            formik.setFieldValue('categoryId', cat.id)
                            setDropdownCategoryError('')
                          }}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>

              {formik.touched.categoryId && formik.errors.categoryId && (
                <div className='text-sm text-red-500'>{formik.errors.categoryId}</div>
              )}

              <hr />
              <div className='flex flex-col gap-2 sm:grid sm:grid-cols-3'>
                {/* Organizer Info */}
                <div className='hidden flex-col gap-4 sm:flex'>
                  <span className='hidden text-[14px] font-medium text-black sm:flex'>
                    Diselenggarakan Oleh
                  </span>
                  <div className='flex items-center gap-4'>
                    <div className='h-[58px] w-[58px] overflow-hidden rounded-full border'>
                      <Image src={image || ''} width={58} height={58} alt='' />
                    </div>
                    <span className='font-light text-black'>{name}</span>
                  </div>
                </div>
                {/* Date & Time */}
                <div className='flex flex-col gap-4 sm:ml-[50px]'>
                  <span className='hidden text-[14px] font-medium text-black sm:flex'>
                    Tanggal & Waktu
                  </span>
                  <div className=''>
                    <div
                      className='flex items-center gap-4'
                      onClick={() => setModalDate(true)}
                    >
                      <Image src='/calendar.png' width={20} height={20} alt='' />
                      {startDate && endDate ? (
                        <div className='flex flex-col gap-2'>
                          <span className='font-light text-black'>
                            {startDate.toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <span className='font-light text-black'>
                            {endDate.toLocaleDateString('en-US', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      ) : (
                        <span className='text-black'>Pilih Tanggal</span>
                      )}
                    </div>
                  </div>
                  <div className=''>
                    <div
                      className='flex items-center gap-4'
                      onClick={() => setModalTime(true)}
                    >
                      <Image src='/clock.png' width={20} height={20} alt='' />
                      {formik.values.eventStartTime &&
                      formik.values.eventEndTime ? (
                        <div className='flex gap-2'>
                          <span className='font-light text-black'>
                            {`${formik.values.eventStartTime} - ${formik.values.eventEndTime}`}
                          </span>
                        </div>
                      ) : (
                        <span className='font-light text-[#ADBAD1]'>
                          Pilih Waktu
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* Location */}
                <div className=''>
                  <div className='flex flex-col gap-4 sm:ml-[20px]'>
                    <span className='hidden text-[14px] font-medium text-black sm:flex'>
                      Lokasi
                    </span>
                    <div
                      className='flex items-center gap-4'
                      onClick={() => setModalLocation(true)}
                    >
                      <Image src='/calendar.png' width={20} height={20} alt='' />
                      <span className='font-light text-black'>
                        {displayLocation === 'Pilih Lokasi'
                          ? displayLocation
                          : `${displayLocation}, ${displayCity}`}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Organizer (Mobile) */}
                <div className='mt-[5px] flex flex-col gap-4 sm:hidden'>
                  <span className='hidden text-[14px] font-medium text-black sm:flex'>
                    Diselenggarakan Oleh
                  </span>
                  <div className='flex items-center gap-4'>
                    <div className='h-[58px] w-[58px] overflow-hidden rounded-full border'>
                      <Image src={image || ''} width={58} height={58} alt='' />
                    </div>
                    <span className='font-light text-black'>{name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Ticket Category */}
          <span className='flex justify-start text-[20px] text-black'>
            Kategori Tiket
          </span>
          <div className=''>
            <div className='flex flex-col justify-center gap-4 px-[20px] sm:flex-row sm:px-0'>
              <Link
                href='#'
                onClick={async (e) => {
                  e.preventDefault()
                  if (ticketType === 'FREE' && isFreeModalFilled()) {
                    const confirmed = await confirmDialog(
                      'Anda hanya bisa memilih 1 tiket. Anda telah mengisi tipe tiket gratis. Jika Anda ingin melanjutkan ke tipe tiket berbayar, maka input di tiket gratis akan dihapus. Apakah Anda ingin melanjutkannya?'
                    )
                    if (!confirmed) return
                    else {
                      // Clear Free Ticket modal fields
                      formik.setFieldValue('availableSeats', '')
                      formik.setFieldValue('price', '')
                      formik.setFieldValue('registrationStartDate', '')
                      formik.setFieldValue('registrationEndDate', '')
                      setStartEventDate(null)
                      setEndEventDate(null)
                      setFreeStartDateError('')
                      setFreeEndDateError('')
                    }
                  }
                  // Open the Paid modal.
                  setModalTicketPaid(true)
                  setTicketType('PAID')
                  formik.setFieldValue('ticketType', 'PAID')
                }}
              >
                <div className='flex h-[90px] w-[300px] items-center justify-between rounded-lg border bg-white p-[20px] xl:w-[400px]'>
                  <div className='flex flex-col gap-1 text-black'>
                    <span>Buat Tiket</span>
                    <span className='font-semibold'>Berbayar</span>
                  </div>
                  <Image
                    className='rounded-t-[20px]'
                    src='/add.png'
                    width={40}
                    height={50}
                    alt=''
                  />
                </div>
              </Link>

              <div className=''>
                <Link
                  href='#'
                  onClick={async (e) => {
                    e.preventDefault()
                    if (ticketType === 'PAID' && isPaidModalFilled()) {
                      const confirmed = await confirmDialog(
                        'Anda hanya bisa memilih 1 tiket. Anda telah mengisi tipe tiket berbayar. Jika Anda ingin melanjutkan ke tipe tiket gratis, maka input di tiket berbayar akan dihapus. Apakah Anda ingin melanjutkannya?'
                      )
                      if (!confirmed) return
                      else {
                        formik.setFieldValue('availableSeats', '')
                        formik.setFieldValue('price', '')
                        formik.setFieldValue('registrationStartDate', '')
                        formik.setFieldValue('registrationEndDate', '')
                        setStartTicketDate(null)
                        setEndTicketDate(null)
                        setStartTime('09:00')
                        setEndTime('18:00')
                        setTicketStartDateError('')
                        setTicketEndDateError('')
                      }
                    }
                    setModalTicketFree(true)
                    setTicketType('FREE')
                    formik.setFieldValue('ticketType', 'FREE')
                    formik.setFieldValue('price', 0)
                  }}
                >
                  <div className='flex h-[90px] w-[300px] items-center justify-between rounded-lg border bg-white p-[20px] xl:w-[400px]'>
                    <div className='flex flex-col gap-1 text-black'>
                      <span>Buat Tiket</span>
                      <span className='font-semibold'>Gratis</span>
                    </div>
                    <Image
                      className='rounded-t-[20px]'
                      src='/add.png'
                      width={40}
                      height={50}
                      alt=''
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* Description */}
          <span className='text-[20px] text-black'>Deskripsi</span>
          {formik.touched.description && formik.errors.description && (
            <div className='text-red-500'>{formik.errors.description}</div>
          )}
          <div className='px-[20px]'>
            <textarea
              className='h-[200px] w-screen text-black sm:h-[400px] xl:w-[900px]'
              name='description'
              id='description'
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
            ></textarea>
          </div>

          {/* MODAL for Registration Date */}
          {modalDate && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='relative min-h-[300px] w-[300px] rounded-xl bg-white'>
                <div className='flex h-full w-full flex-col justify-center gap-4 p-[10px]'>
                  <label>Tanggal Mulai</label>
                  {startDateError && (
                    <div className='text-sm text-red-500'>{startDateError}</div>
                  )}
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => {
                      setStartDate(date)
                      formik.setFieldValue(
                        'eventStartDate',
                        date ? toAdjustedISOString(date) : ''
                      )
                      if (date) {
                        setStartDateError('')
                      }
                    }}
                    className='w-full rounded border p-2'
                    placeholderText='Pilih'
                  />
                  <label>Tanggal Berakhir</label>
                  {endDateError && (
                    <div className='text-sm text-red-500'>{endDateError}</div>
                  )}
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => {
                      setEndDate(date)
                      formik.setFieldValue(
                        'eventEndDate',
                        date ? toAdjustedISOString(date) : ''
                      )
                      if (date) {
                        setEndDateError('')
                      }
                    }}
                    className='w-full rounded border p-2'
                    placeholderText='Pilih'
                  />
                  <button
                    type='button'
                    className='mt-4 w-full rounded-lg bg-[#0049CC] py-2 text-white'
                    onClick={() => {
                      let valid = true
                      if (!startDate) {
                        setStartDateError('Tanggal Mulai Wajib Diisi')
                        valid = false
                      } else {
                        setStartDateError('')
                      }
                      if (!endDate) {
                        setEndDateError('Tanggal Berakhir Wajib Diisi')
                        valid = false
                      } else {
                        setEndDateError('')
                      }
                      if (!valid) return
                      setModalDate(false)
                    }}
                  >
                    Simpan dan Keluar
                  </button>
                  <button
                    type='button'
                    className='mt-4 w-full rounded-lg bg-[#0049CC] py-2 text-white'
                    onClick={() => {
                      setStartDate(null)
                      setEndDate(null)
                      formik.setFieldValue('eventStartDate', '')
                      formik.setFieldValue('eventEndDate', '')
                      setStartDateError('')
                      setEndDateError('')
                      setModalDate(false)
                    }}
                  >
                    Keluar dan Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL for Registration Time */}
          {modalTime && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='relative w-[300px] rounded-xl bg-white p-4'>
                <div className='flex flex-col gap-4'>
                  <label htmlFor='eventStartTime'>Waktu Mulai (Klik Logo Jam)</label>
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
                      id='eventStartTime'
                      name='eventStartTime'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      value={localEventStartTime}
                      onChange={(e) => setLocalEventStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <label htmlFor='eventEndTime'>Waktu Berakhir (Klik Logo Jam)</label>
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
                      id='eventEndTime'
                      name='eventEndTime'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      value={localEventEndTime}
                      onChange={(e) => setLocalEventEndTime(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type='button'
                    className='mt-4 rounded-lg bg-[#0049CC] py-2 text-white'
                    onClick={() => {
                      formik.setFieldValue('eventStartTime', localEventStartTime)
                      formik.setFieldValue('eventEndTime', localEventEndTime)
                      setModalTime(false)
                    }}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL for Location */}
          {modalLocation && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='relative h-auto w-[300px] rounded-xl bg-white'>
                <div className='flex flex-col gap-4 p-[20px]'>
                  <label>Alamat</label>
                  {formik.touched.streetAddress && formik.errors.streetAddress && (
                    <div className='text-red-500'>{formik.errors.streetAddress}</div>
                  )}
                  <input
                    type='text'
                    name='streetAddress'
                    id='streetAddress'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.streetAddress}
                  />
                  <label>Kota</label>
                  {formik.touched.city && formik.errors.city && (
                    <div className='text-red-500'>{formik.errors.city}</div>
                  )}
                  <input
                    type='text'
                    name='city'
                    id='city'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.city}
                  />
                  <span>Provinsi</span>
                  {provinceError && (
                    <div className='text-sm text-red-500'>{provinceError}</div>
                  )}
                  <details className='dropdown'>
                    <summary className='btn btn-ghost m-0 flex w-full justify-start border bg-white p-2 font-light text-black shadow hover:bg-white'>
                      {selectedProvince
                        ? province.find((prov) => prov.id === selectedProvince)?.name
                        : 'Pilih Provinsi'}
                    </summary>
                    <ul className='menu dropdown-content rounded-box z-[1] max-h-[230px] w-full overflow-y-auto bg-white p-2 shadow'>
                      {province.map((prov) => (
                        <li key={prov.id} className='truncate'>
                          <button
                            type='button'
                            className='text-black no-underline'
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedProvince(prov.id)
                              formik.setFieldValue('provinceId', prov.id)
                              setProvinceError('')
                            }}
                          >
                            {prov.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                  <button
                    type='button'
                    className='mt-4 rounded-lg bg-[#0049CC] py-2 text-white'
                    onClick={() => {
                      let valid = true
                      if (!formik.values.streetAddress) {
                        formik.setFieldTouched('streetAddress', true, true)
                        valid = false
                      }
                      if (!formik.values.city) {
                        formik.setFieldTouched('city', true, true)
                        valid = false
                      }
                      if (!selectedProvince) {
                        setProvinceError('Provinsi Wajib Diisi')
                        valid = false
                      }
                      if (!valid) return
                      setProvinceError('')
                      setModalLocation(false)
                      setDisplayLocation(formik.values.streetAddress)
                      setDisplayCity(formik.values.city)
                    }}
                  >
                    Simpan dan Keluar
                  </button>
                  <button
                    type='button'
                    className='mt-4 rounded-lg bg-[#0049CC] py-2 text-white'
                    onClick={() => {
                      formik.setFieldValue('streetAddress', '')
                      formik.setFieldValue('city', '')
                      formik.setFieldValue('provinceId', 0)
                      setSelectedProvince(null)
                      setDisplayLocation('Pilih Lokasi')
                      setDisplayCity('')
                      setProvinceError('')
                      setModalLocation(false)
                    }}
                  >
                    Keluar dan Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL for Ticket (Paid) details */}
          {modalTicketPaid && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='relative h-auto w-[300px] rounded-xl bg-white'>
                <div className='flex flex-col gap-4 p-[20px]'>
                  <label>Jumlah Tiket</label>
                  {formik.touched.availableSeats && formik.errors.availableSeats && (
                    <div className='text-red-500'>{formik.errors.availableSeats}</div>
                  )}
                  <input
                    type='number'
                    name='availableSeats'
                    id='availableSeats'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.availableSeats}
                    placeholder='0'
                  />
                  <label>Harga</label>
                  {formik.touched.price && formik.errors.price && (
                    <div className='text-red-500'>{formik.errors.price}</div>
                  )}
                  <input
                    type='number'
                    name='price'
                    id='price'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.price}
                    placeholder='0'
                  />
                  <label>Tanggal Mulai</label>
                  {ticketStartDateError && (
                    <div className='text-sm text-red-500'>{ticketStartDateError}</div>
                  )}
                  <DatePicker
                    selected={startTicketDate}
                    onChange={(date: Date | null) => {
                      setStartTicketDate(date)
                      if (date && startTime) {
                        const combined = combineDateAndTime(date, startTime)
                        formik.setFieldValue('registrationStartDate', toAdjustedISOString(combined))
                      }
                    }}
                    className='w-full rounded border p-2'
                    placeholderText='Pilih'
                  />
                  <label>Waktu Mulai (Klik Logo Jam)</label>
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
                      id='registrationStartTime'
                      name='registrationStartTime'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value)
                        if (startTicketDate) {
                          const combined = combineDateAndTime(startTicketDate, e.target.value)
                          formik.setFieldValue('registrationStartDate', toAdjustedISOString(combined))
                        }
                      }}
                      required
                    />
                  </div>
                  <label>Tanggal Berakhir</label>
                  {ticketEndDateError && (
                    <div className='text-sm text-red-500'>{ticketEndDateError}</div>
                  )}
                  <DatePicker
                    selected={endTicketDate}
                    onChange={(date: Date | null) => {
                      setEndTicketDate(date)
                      if (date && endTime) {
                        const combined = combineDateAndTime(date, endTime)
                        formik.setFieldValue('registrationEndDate', toAdjustedISOString(combined))
                      }
                    }}
                    className='w-full rounded border p-2'
                    placeholderText='Pilih'
                  />
                  <label>Waktu Berakhir (Klik Logo Jam)</label>
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
                      id='registrationEndTime'
                      name='registrationEndTime'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value)
                        if (endTicketDate) {
                          const combined = combineDateAndTime(endTicketDate, e.target.value)
                          formik.setFieldValue('registrationEndDate', toAdjustedISOString(combined))
                        }
                      }}
                      required
                    />
                  </div>
                  <button
                    type='button'
                    className='mt-4 rounded-lg bg-[#0049CC] py-2 text-white'
                    onClick={() => {
                      let valid = true
                      if (!startTicketDate) {
                        setTicketStartDateError('Tanggal Mulai Wajib Diisi')
                        valid = false
                      } else {
                        setTicketStartDateError('')
                      }
                      if (!endTicketDate) {
                        setTicketEndDateError('Tanggal Berakhir Wajib Diisi')
                        valid = false
                      } else {
                        setTicketEndDateError('')
                      }
                      if (!valid) return
                      setModalTicketPaid(false)
                    }}
                  >
                    Simpan dan Keluar
                  </button>
                  <button
                    type='button'
                    className='mt-4 rounded-lg bg-[#0049CC] py-2 text-white'
                    onClick={() => {
                      formik.setFieldValue('availableSeats', '')
                      formik.setFieldValue('price', '')
                      formik.setFieldValue('registrationStartDate', '')
                      formik.setFieldValue('registrationEndDate', '')
                      setStartTicketDate(null)
                      setEndTicketDate(null)
                      setStartTime('09:00')
                      setEndTime('18:00')
                      setTicketStartDateError('')
                      setTicketEndDateError('')
                      setModalTicketPaid(false)
                    }}
                  >
                    Keluar dan Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL for Ticket (Free) details */}
          {modalTicketFree && (
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='relative h-auto w-[300px] rounded-xl bg-white'>
                <div className='flex flex-col gap-4 p-[20px]'>
                  <label>Jumlah Tiket</label>
                  {formik.touched.availableSeats && formik.errors.availableSeats && (
                    <div className='text-red-500'>{formik.errors.availableSeats}</div>
                  )}
                  <input
                    type='number'
                    name='availableSeats'
                    id='availableSeats'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.availableSeats}
                    placeholder='0'
                  />
                  <label>Tanggal Mulai</label>
                  {ticketStartDateError && (
                    <div className='text-sm text-red-500'>{ticketStartDateError}</div>
                  )}
                  <DatePicker
                    selected={startTicketDate}
                    onChange={(date: Date | null) => {
                      setStartTicketDate(date)
                      if (date && startTime) {
                        const combined = combineDateAndTime(date, startTime)
                        formik.setFieldValue('registrationStartDate', toAdjustedISOString(combined))
                      } else {
                        formik.setFieldValue('registrationStartDate', '')
                      }
                    }}
                    className='w-full rounded border p-2'
                    placeholderText='Pilih'
                  />
                  <label>Waktu Mulai (Klik Logo Jam)</label>
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
                      id='registrationStartTime'
                      name='registrationStartTime'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value)
                        if (startTicketDate) {
                          const combined = combineDateAndTime(startTicketDate, e.target.value)
                          formik.setFieldValue('registrationStartDate', toAdjustedISOString(combined))
                        }
                      }}
                      required
                    />
                  </div>
                  <label>Tanggal Berakhir</label>
                  {ticketEndDateError && (
                    <div className='text-sm text-red-500'>{ticketEndDateError}</div>
                  )}
                  <DatePicker
                    selected={endTicketDate}
                    onChange={(date: Date | null) => {
                      setEndTicketDate(date)
                      if (date && endTime) {
                        const combined = combineDateAndTime(date, endTime)
                        formik.setFieldValue('registrationEndDate', toAdjustedISOString(combined))
                      } else {
                        formik.setFieldValue('registrationEndDate', '')
                      }
                    }}
                    className='w-full rounded border p-2'
                    placeholderText='Pilih'
                  />
                  <label>Waktu Berakhir (Klik Logo Jam)</label>
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
                      id='registrationEndTime'
                      name='registrationEndTime'
                      className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value)
                        if (endTicketDate) {
                          const combined = combineDateAndTime(endTicketDate, e.target.value)
                          formik.setFieldValue('registrationEndDate', toAdjustedISOString(combined))
                        }
                      }}
                      required
                    />
                  </div>
                  <button
                    type='button'
                    className='mt-4 rounded-lg bg-[#0049CC] py-2 text-white'
                    onClick={() => {
                      let valid = true
                      if (!startTicketDate) {
                        setTicketStartDateError('Tanggal Mulai Wajib Diisi')
                        valid = false
                      } else {
                        setTicketStartDateError('')
                      }
                      if (!endTicketDate) {
                        setTicketEndDateError('Tanggal Berakhir Wajib Diisi')
                        valid = false
                      } else {
                        setTicketEndDateError('')
                      }
                      if (!valid) return
                      setModalTicketFree(false)
                    }}
                  >
                    Simpan
                  </button>
                  <button
                    type='button'
                    className='mt-2 rounded-lg bg-[#0049CC] py-2 text-white'
                    onClick={() => {
                      formik.setFieldValue('availableSeats', '')
                      formik.setFieldValue('registrationStartDate', '')
                      formik.setFieldValue('registrationEndDate', '')
                      setStartTicketDate(null)
                      setEndTicketDate(null)
                      setStartTime('09:00')
                      setEndTime('18:00')
                      setTicketStartDateError('')
                      setTicketEndDateError('')
                      setModalTicketFree(false)
                    }}
                  >
                    Keluar dan Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer with submit button */}
          <div className='fixed bottom-0 z-40 h-[70px] border-t bg-white px-[20px] py-[15px] md:px-[80px] lg:px-[100px] xl:w-full'>
            <div className='flex justify-center sm:items-center sm:justify-between'>
              <p className='hidden text-[14px] text-black md:block'>
                <span className='text-[24px] font-semibold text-black'>
                  Yeay!
                </span>{' '}
                Tinggal Selangkah lagi dan event kamu berhasil dibuat.
              </p>
              <button
                className='z-[29] h-[39px] rounded-lg bg-[#0049CC] px-4 font-bold text-white sm:w-full sm:px-0 md:w-[190px] lg:w-[190px]'
                type='submit'
              >
                Buat Event Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
