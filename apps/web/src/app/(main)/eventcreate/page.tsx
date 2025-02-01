'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-time-picker/dist/TimePicker.css'
import TimePicker from 'react-time-picker'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { error, log } from 'console'

export default function EventCreate() {
  const [activeTab, setActiveTab] = useState(1)
  const [modalDate, setModalDate] = useState(false)
  const [modalTime, setModalTime] = useState(false)
  const [modalLocation, setModalLocation] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState<string | null>(null)
  const [endTime, setEndTime] = useState<string | null>('18:00')
  const [time, setTime] = useState('10:00') // Default time
  const [modalTicketPaid, setModalTicketPaid] = useState(false)
  const [modalTicketFree, setModalTicketFree] = useState(false)

  const formik = useFormik({
    initialValues: {
      alamat: '',
      kota: '',
      provinsi: '',
      jumlah_tiket_berbayar: 0,
      harga: 0
    },
    validationSchema: Yup.object({
      alamat: Yup.string().required('Alamat Wajib Diisi'),
      kota: Yup.string().required('Kota Wajib Diisi'),
      provinsi: Yup.string().required('Provinsi Wajib Diisi'),
      jumlah_tiket_berbayar: Yup.number().required('Jumlah Tiket Wajib Diisi'),
      harga: Yup.number().required('Harga Wajib Diisi')
    }),
    onSubmit: (values) => {
      console.log(values)
    }
  })

  interface Category {
    id: string
    name: string
  }
  interface Province {
    id: string
    name: string
  }
  const [category, setCategory] = useState<Category[]>([])
  const [province, setProvince] = useState<Province[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch(
          'http://localhost:8000/api/eventcreate'
        )
        const categoryData = await categoryResponse.json()
        if (categoryData.data) {
          setCategory(categoryData.data)
        }
        const provinceResponse = await fetch(
          'http://localhost:8000/api/explore'
        )
        const provinceData = await provinceResponse.json()
        if (provinceData.data) {
          setProvince(provinceData.data)
        }
      } catch (error) {
        console.log('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])
  return (
    <div className='h-full w-full bg-white py-[100px]'>
      <div className='flex flex-col items-center justify-center gap-[50px]'>
        <div className='flex flex-col rounded-[20px] border sm:w-[900px]'>
          <div className='relative'>
            <Image
              className='rounded-t-[20px] md:rounded-t-[70px] lg:rounded-t-[20px]'
              src='https://assets.loket.com/images/banner-event.jpg'
              width={900}
              height={421}
              alt=''
            />
            <div className='absolute bottom-[80px] left-[165px] flex flex-col gap-4 sm:bottom-[180px] sm:left-[415px]'>
              <Image
                className=''
                src='/add.png'
                width={60}
                height={128}
                alt=''
              />
            </div>
            <div className='absolute bottom-[50px] left-[100px] flex flex-col gap-4 sm:bottom-[130px] sm:left-[290px]'>
              <span className='text-[13px] sm:text-[24px]'>
                Unggah gambar/poster/banner
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-4 p-[20px] sm:p-[50px]'>
            <input
              type='text'
              className='border-none p-0 text-[24px] focus:outline-none focus:ring-0'
              placeholder='Nama Event*'
            />
            <details className='dropdown'>
              <summary className='btn btn-ghost m-0 flex w-full justify-start border bg-white p-0 font-light text-[#ADBAD1] hover:bg-white'>
                Pilih Kategory*
              </summary>
              <ul className='menu dropdown-content rounded-box z-[1] w-full bg-white p-2 shadow'>
                {province.length > 0
                  ? province.map((province) => (
                      <li key={province.id}>
                        <Link href='#' className='text-black no-underline'>
                          {province.name}
                        </Link>
                      </li>
                    ))
                  : null}
              </ul>
            </details>
            <hr />
            <div className='flex flex-col gap-2 sm:grid sm:grid-cols-3'>
              <div className='hidden flex-col gap-4 sm:flex'>
                <span className='hidden text-[14px] font-medium text-black sm:flex'>
                  Diselenggarakan Oleh
                </span>
                <div className='flex items-center gap-4'>
                  <div className='h-[58px] w-[58px] overflow-hidden rounded-[40px] border'>
                    <Image
                      className=''
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

              <div className='flex flex-col gap-4 sm:ml-[50px]'>
                <span className='hidden text-[14px] font-medium text-black sm:flex'>
                  Tanggal & Waktu
                </span>
                <div
                  className='flex items-center gap-4'
                  onClick={() => setModalDate(true)}
                >
                  <Image
                    className=''
                    src='/calendar.png'
                    width={20}
                    height={20}
                    alt=''
                  />

                  {startDate && endDate ? (
                    <div className='flex flex-col gap-2'>
                      <span
                        className={`font-light ${startDate ? 'text-black' : 'text-[#ADBAD1]'} `}
                      >
                        {startDate.toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span
                        className={`font-light ${startDate ? 'text-black' : 'text-[#ADBAD1]'} `}
                      >
                        {endDate.toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  ) : (
                    <span className='text-[#ADBAD1]'>Pilih Tanggal</span>
                  )}
                </div>
                <div
                  className='flex items-center gap-4'
                  onClick={() => setModalTime(true)}
                >
                  <Image
                    className=''
                    src='/clock.png'
                    width={20}
                    height={20}
                    alt=''
                  />
                  {startTime && endTime ? (
                    <div className='flex gap-2'>
                      <span className='font-light text-[#ADBAD1]'>
                        {`${startTime} - ${endTime} `}
                      </span>
                    </div>
                  ) : (
                    <span className='font-light text-[#ADBAD1]'>
                      Pilih Waktu
                    </span>
                  )}
                </div>
              </div>
              <div className='flex flex-col gap-4 sm:ml-[20px]'>
                <span className='hidden text-[14px] font-medium text-black sm:flex'>
                  Lokasi
                </span>
                <div
                  className='flex items-center gap-4'
                  onClick={() => setModalLocation(true)}
                >
                  <Image
                    className=''
                    src='/calendar.png'
                    width={20}
                    height={20}
                    alt=''
                  />

                  <span className='font-light text-[#ADBAD1]'>
                    Pilih Lokasi
                  </span>
                </div>
              </div>
              <div className='mt-[5px] flex flex-col gap-4 sm:hidden'>
                <span className='hidden text-[14px] font-medium text-black sm:flex'>
                  Diselenggarakan Oleh
                </span>
                <div className='flex items-center gap-4'>
                  <div className='h-[58px] w-[58px] overflow-hidden rounded-[40px] border'>
                    <Image
                      className=''
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
          </div>
        </div>
        <span className='flex justify-start text-[20px] text-black'>
          Kategori Tiket
        </span>
        <div>
          <div className='flex flex-col justify-center gap-4 px-[20px] sm:flex-row sm:px-0'>
            <Link href='#' onClick={() => setModalTicketPaid(true)}>
              <div className='flex h-[90px] w-[400px] items-center justify-between rounded-lg border bg-white p-[20px]'>
                <div className='flex flex-col gap-1 text-black'>
                  <span className=''>Buat Tiket</span>
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
            <Link href='#' onClick={() => setModalTicketFree(true)}>
              <div className='flex h-[90px] w-[400px] items-center justify-between rounded-lg border bg-white p-[20px]'>
                <div className='flex flex-col gap-1 text-black'>
                  <span className=''>Buat Tiket</span>
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

        <span className='text-[20px] text-black'>Deskripsi</span>
        <div className='px-[20px]'>
          <textarea
            className='h-[200px] w-screen text-black sm:h-[400px] lg:w-[900px]'
            name=''
            id=''
          ></textarea>
        </div>

        {modalDate && (
          <form action='' onSubmit={formik.handleSubmit}>
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='relative h-[300px] w-[300px] rounded-xl bg-white'>
                <button
                  className='absolute right-0 m-[10px] h-[20px] w-[20px]'
                  onClick={() => setModalDate(false)}
                >
                  X
                </button>
                <div className='flex h-full w-full flex-col items-center justify-center p-[20px]'>
                  <label htmlFor=''>Tanggal Mulai</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    className='w-full rounded border p-2'
                    placeholderText='Select a date'
                  />

                  <label htmlFor=''>Tanggal Berakhir</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    className='w-full rounded border p-2'
                    placeholderText='Select a date'
                  />
                </div>
              </div>
            </div>
          </form>
        )}

        {modalTime && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='relative w-[300px] rounded-xl bg-white p-4'>
              <button
                className='absolute right-0 m-[10px] h-[20px] w-[20px]'
                onClick={() => setModalTime(false)}
              >
                X
              </button>
              <div className='flex flex-col gap-4'>
                <label htmlFor='startTime'>Waktu Mulai</label>
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
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                    min='09:00'
                    max='18:00'
                    value={startTime || '09:00'} // CHANGED: Using state with default fallback
                    onChange={(e) => setStartTime(e.target.value)} // CHANGED: Update state on change
                    required
                  />
                </div>

                <label htmlFor='endTime'>Waktu Berakhir</label>
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
                    className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                    min='09:00'
                    max='18:00'
                    value={endTime || '18:00'} // CHANGED: Using state with default fallback
                    onChange={(e) => setEndTime(e.target.value)} // CHANGED: Update state on change
                    required
                  />
                </div>

                <button
                  className='mt-4 rounded-lg bg-blue-500 py-2 text-white'
                  onClick={() => setModalTime(false)}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {modalLocation && (
          <form action='' onSubmit={formik.handleSubmit}>
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='relative h-auto w-[300px] rounded-xl bg-white'>
                <button
                  className='absolute right-0 m-[10px] h-[20px] w-[20px]'
                  onClick={() => setModalLocation(false)}
                >
                  X
                </button>
                <div className='flex flex-col gap-4 p-[20px]'>
                  <label htmlFor=''>Alamat</label>
                  {formik.touched.alamat && formik.errors.alamat ? (
                    <div>{formik.errors.alamat}</div>
                  ) : null}
                  <input
                    type='text'
                    name='alamat'
                    id='alamat'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.alamat}
                  />

                  <label htmlFor=''>Kota</label>
                  {formik.touched.kota && formik.errors.kota ? (
                    <div>{formik.errors.kota}</div>
                  ) : null}
                  <input
                    type='text'
                    name='kota'
                    id='kota'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.kota}
                  />
                  <span>Provinsi</span>
                  <details className='dropdown'>
                    <summary className='btn btn-ghost m-0 flex w-full justify-start border bg-white p-2 font-light text-black shadow hover:bg-white'>
                      Pilih Provinsi
                    </summary>
                    <ul className='menu dropdown-content rounded-box z-[1] max-h-[230px] w-full overflow-y-auto bg-white p-2 shadow'>
                      {province.length > 0
                        ? province.map((province) => (
                            <li key={province.id} className='truncate'>
                              <Link
                                href='#'
                                className='text-black no-underline'
                              >
                                {province.name}
                              </Link>
                            </li>
                          ))
                        : null}
                    </ul>
                  </details>
                </div>
              </div>
            </div>
          </form>
        )}

        {modalTicketPaid && (
          <form action='' onSubmit={formik.handleSubmit}>
            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
              <div className='relative h-auto w-[300px] rounded-xl bg-white'>
                <button
                  className='absolute right-0 m-[10px] h-[20px] w-[20px]'
                  onClick={() => setModalTicketPaid(false)}
                >
                  X
                </button>
                <div className='flex flex-col gap-4 p-[20px]'>
                  <label htmlFor=''>Jumlah Tiket</label>
                  {formik.touched.jumlah_tiket_berbayar &&
                  formik.errors.jumlah_tiket_berbayar ? (
                    <div>{formik.errors.jumlah_tiket_berbayar}</div>
                  ) : null}
                  <input
                    type='text'
                    name='jumlah_tiket_berbayar'
                    id='jumlah_tiket_berbayar'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.jumlah_tiket_berbayar}
                  />

                  <label htmlFor=''>Harga</label>
                  {formik.touched.harga && formik.errors.harga ? (
                    <div>{formik.errors.harga}</div>
                  ) : null}
                  <input
                    type='text'
                    name='harga'
                    id='harga'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.harga}
                  />
                </div>
              </div>
            </div>
          </form>
        )}
        <div className='fixed bottom-0 h-[70px] w-full border-t bg-white px-[20px] py-[15px] md:px-[80px] lg:px-[100px]'>
          <div className='flex items-center justify-between'>
            <p className='hidden text-[14px] text-black md:block'>
              <span className='text-[24px] font-semibold text-black'>
                Yeay!
              </span>{' '}
              Tinggal Selangkah lagi dan event kamu berhasil dibuat.
            </p>
            <button className='h-[39px] rounded-lg bg-[#0049CC] font-bold text-white md:w-[190px] lg:w-[190px]'>
              Buat Event Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
