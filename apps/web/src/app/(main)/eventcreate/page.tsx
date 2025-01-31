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
  const [endTime, setEndTime] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      alamat: '',
      kota: '',
      provinsi: ''
    },
    validationSchema: Yup.object({
      alamat: Yup.string().required('Alamat Wajib Diisi'),
      kota: Yup.string().required('Kota Wajib Diisi'),
      provinsi: Yup.string().required('Provinsi Wajib Diisi')
    }),
    onSubmit: (values) => {
      console.log(values)
    }
  })

  interface Category {
    id: string
    name: string
  }
  const [category, setCategory] = useState<Category[]>([])

  useEffect(()=>{
    fetch("http://localhost:8000/api/eventcreate")
    .then((res)=>res.json())
    .then((data)=>{
        if (data.data){
            setCategory(data.data)
        }
    }).catch((err)=>
        console.log("Error fetching categories: ",err)

    )
    
  },[])
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
            <details className='dropdown '>
              <summary className='btn btn-ghost border bg-white hover:bg-white text-[#ADBAD1] font-light p-0 m-0 w-full flex justify-start'>
                Pilih Kategory*
              </summary>
              <ul className='menu dropdown-content rounded-box z-[1] w-full bg-white p-2 shadow '>
              {
                category.length>0?(
                    category.map((category)=>
                        <li key={category.id}>
                    <Link href="#"className='text-black no-underline'>{category.name}</Link>
                </li>
                    )
                  
                ):null
              }
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
                      <span className='font-light text-[#ADBAD1]'>
                        {startDate.toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span className='font-light text-[#ADBAD1]'>
                        {endDate.toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  ) : (
                    <span>Pilih Tanggal</span>
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
            <Link href='/'>
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
            <Link href='/'>
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
        )}

        {modalTime && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
            <div className='relative h-[300px] w-[300px] rounded-xl bg-white'>
              <button
                className='absolute right-0 m-[10px] h-[20px] w-[20px]'
                onClick={() => setModalTime(false)}
              >
                X
              </button>
              <div className='flex h-full w-full flex-col items-center justify-center p-[20px]'>
                <label htmlFor=''>Waktu Mulai</label>

                <input
                  type='time'
                  id='start-time'
                  value={startTime || ''}
                  onChange={(e) => setStartTime(e.target.value)}
                  className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                />

                <label htmlFor=''>Waktu Berakhir</label>

                <input
                  type='time'
                  id='start-time'
                  value={endTime || ''}
                  onChange={(e) => setEndTime(e.target.value)}
                  className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>
          </div>
        )}

        {modalLocation && (
          <form action='' onSubmit={formik.handleSubmit}>
            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
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

                  <label htmlFor=''>Provinsi</label>
                  {formik.touched.provinsi && formik.errors.provinsi ? (
                    <div>{formik.errors.provinsi}</div>
                  ) : null}
                  <input
                    type='text'
                    name='provinsi'
                    id='provinsi'
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.provinsi}
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
