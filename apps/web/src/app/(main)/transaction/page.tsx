'use client'
import { fetchGetUserCoupons } from '@/lib/apis/user.api'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Coupons } from '@/lib/interfaces/user.interface'
import { API_BASE_URL } from '@/lib/constants'

interface transaction {
  quantity: number
}
interface voucher {
  id: number
  title: string
  eventId: number
  startDate: Date
  endDate: Date
  discountAmount: number
}
interface event {
  availableSeats: number
}
export default function Transaction() {
  const { data: session, status } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [id, setId] = useState(0)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [coupons, setCoupons] = useState<Coupons[]>([])
  const [vouchers, setVouchers] = useState<voucher[]>([])
  const [timeLeft, setTimeLeft] = useState<number>(7200) 
  const router = useRouter()
  const [events, setEvents] = useState<event>()
  const [transactions, setTransactions] = useState<transaction>()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('id')
  const title = searchParams.get('title') || 'Event'
  const price = parseInt(searchParams.get('price') || '0')
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const location = searchParams.get('location') || 'Unknown Location'
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const bannerUrl = searchParams.get('bannerUrl')
  const [useCoupons, setUseCoupons] = useState(false)
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null)
  const [selectedCoupon, setSelectedCoupon] = useState<string>('Pilih')
  const [selectedCouponpoints, setSelectedCouponPoints] = useState<number>(0)
  const [useVouchers, setUseVouchers] = useState(false)
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(
    null
  )
  const [selectedVoucher, setSelectedVoucher] = useState<string>('Pilih')
  const [selectedDiscountAmount, setSelectedDiscountAmount] =
    useState<number>(0)

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
      setId(session.user.id)
      getCoupons()
      getVoucher()
      getEventById()
      updateSeats()
    }
  }, [session])

  useEffect(() => {
    const checkTransactionStatus = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/transactions/${eventId}`
        )
        const data = await res.json()
        if (data.transactionStatus === 'EXPIRED') {
          alert('Transaction has expired. Redirecting to homepage.')
          router.push('/')
        }
      } catch (error) {
        console.error('Error checking transaction status:', error)
      }
    }

    checkTransactionStatus()

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          alert('Transaction time expired! Redirecting...')
          router.push('/') 
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer) 
  }, [router, eventId])
  const getVoucher = async () => {
    const voucherResponse = await fetch(
      `${API_BASE_URL}/voucher/${eventId}`
    )
    const voucherData = await voucherResponse.json()
    if (voucherData.result) {
      setVouchers(voucherData.result)
    }
  }
  const getEventById = async () => {
    const eventResponse = await fetch(
      `${API_BASE_URL}/event/${eventId}/transaction`
    )
    const eventData = await eventResponse.json()
    if (eventData.result) {
      setEvents(eventData.result)
    }
  }
  const getTransactionByEvent = async () => {
    const transactionResponse = await fetch(
      `${API_BASE_URL}/transactions/${eventId}`
    )
  }

  const totalPrice = price * quantity
  const totalPoints = coupons.reduce(
    (acc, voucher) => acc + voucher.discountAmount,
    0
  )
  const finalPrice = Math.max(
    totalPrice -
      (selectedCouponId ? selectedCouponpoints : 0) -
      (selectedVoucherId ? selectedDiscountAmount : 0),
    0
  )
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const updateSeats = async () => {
    try {
      const newAvailableSeats = events!.availableSeats - quantity

      const eventResponse = await fetch(
        `${API_BASE_URL}/transactions/${eventId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.accessToken}`
          },
          body: JSON.stringify({
            quantity: newAvailableSeats
          })
        }
      )
      const data = await eventResponse.json()
      console.log('Server response:', data)
    } catch (error) {
      console.error('Error patching available seats:', error)
    }
  }

  const handleBuyTicket = async () => {
    try {
      if (selectedCouponId) {
        const res = await fetch(`${API_BASE_URL}/users/coupons`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.accessToken}`
          },
          body: JSON.stringify({
            pointId: selectedCouponId
          })
        })
        const resultData = await res.json()
        if (!res.ok) {
          alert('Failed to apply coupon.')
          return
        }

        console.log(' Coupon status updated successfully', resultData)
      }

     

      const  latestTransactionId = await fetch(`${API_BASE_URL}/transactions/latest/${id}`)
      const latestTransactionIdData = await latestTransactionId.json()
      console.log('Latest Transaction Data',latestTransactionIdData)
      const transactionId = latestTransactionIdData.result?.id


      
      const resReview = await fetch(`${API_BASE_URL}/review/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          userId:id,
          eventId:eventId,
          transactionId:transactionId
        })
      })
      const reviewData = await resReview.json()
      console.log('review created',reviewData)


      const formData = new FormData()
      formData.append('userId', id.toString())
      formData.append('eventId', eventId || '')
      formData.append('transactionStatus', 'WAITING_FOR_ADMIN_CONFIRMATION')
      formData.append('totalPrice', finalPrice.toString())
      if (paymentProof) {
        formData.append('paymentProofImage', paymentProof)
      }

      const res = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'PATCH',
        headers: {          
          Authorization: `Bearer ${session?.user.accessToken}`
        },
        body: formData
      })

      const data = await res.json()
      alert('Transaksi berhasil dibuat!')
      router.push('/')
      console.log('Server response:', data)

    } catch (error) {
      console.error('Error creating transaction:', error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setPaymentProof(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const getCoupons = async () => {
    try {
      const response = await fetchGetUserCoupons()

      if (response.success) {
        setCoupons(response.data.user.coupons)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleUseCouponsChange = () => {
    setUseCoupons(!useCoupons) // Toggle the usePoints state
  }

 

  return (
    <div className='h-full w-full bg-white'>
      <div className='flex p-[20px] lg:gap-[50px] lg:p-[100px]'>
        <div className='flex w-full flex-col gap-4 text-black'>
          <div className='flex h-full w-full items-center justify-center gap-4 rounded-lg border bg-[#FFCC00] p-[10px] text-black lg:hidden lg:h-[48px] lg:w-[383px]'>
            <span className='countdown font-mono text-2xl'>
              {formatTime(timeLeft)}
            </span>
            <div className='h-10 border-l border-black'></div>
            <span>Segera selesaikan pesananmu</span>
          </div>
          <span className='text-[21px] font-bold'>Detail Pemesanan</span>
          <div className='flex w-full flex-col gap-4 rounded-lg border p-[20px]'>
            <div className='flex gap-4'>
              <Image
                className='hidden rounded-lg lg:block'
                src={bannerUrl || ''}
                width={260}
                height={122}
                alt=''
              />
              <div className='flex flex-col gap-4'>
                <span>{title}</span>
                <div className='flex gap-4'>
                  <span>
                    <Image src='/calendar.png' width={20} height={20} alt='' />
                  </span>

                  <span>{`${new Date(startDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}`}</span>
                </div>
                <div className='flex gap-4'>
                  <span>
                    <Image src='/clock.png' width={20} height={20} alt='' />
                  </span>

                  <span>06:00 - 15:00 WIB</span>
                </div>
                <div className='flex gap-4'>
                  <span>
                    <Image src='/location.png' width={20} height={20} alt='' />
                  </span>

                  <span>{location}</span>
                </div>
              </div>
            </div>
            <hr />
            <div className='flex justify-between'>
              <span>Jenis Tiket</span>
              <div className='flex gap-[50px]'>
                <span>Harga</span>
                <span>Jumlah</span>
              </div>
            </div>
            <hr />
            <div className='flex justify-between'>
              <span>{title}</span>
              <div className='flex gap-[50px]'>
                <span>{`Rp ${price.toLocaleString()}`}</span>
                <span>{`x${quantity}`}</span>
              </div>
            </div>
          </div>
          <span className='text-[21px] font-bold'>Detail Pemesanan</span>
          <div className='flex w-full flex-col gap-4 rounded-lg border p-[20px]'>
            <label htmlFor=''>Nama Lengkap</label>

            <input
              className='z-50 h-[47px] w-full rounded-lg'
              type='text'
              value={name}
            />

            <label htmlFor=''>Email</label>
            <label htmlFor=''>E-tiket akan dikirim ke email kamu.</label>

            <input
              className='h-[47px] w-full rounded-lg'
              type='text'
              value={email}
            />
          </div>
          <span className='text-[21px] font-bold'>Pembayaran</span>
          <div className='flex w-full items-center justify-center'>
            <label
              htmlFor='dropzone-file'
              className='flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-100 lg:h-64'
            >
              {preview ? (
                <Image
                  src={preview}
                  alt='Payment Proof Preview'
                  width={250}
                  height={180}
                  className='rounded-lg'
                />
              ) : (
                <div className='flex flex-col items-center justify-center pb-6 pt-5'>
                  <svg
                    className='mb-4 h-8 w-8 text-black'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 16'
                  >
                    <path
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                    />
                  </svg>
                  <p className='mb-2 text-sm text-black'>
                    <span className='font-semibold'>Click to upload</span> or
                    drag and drop
                  </p>
                  <p className='text-xs text-gray-500'>
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
              )}
              <input
                id='dropzone-file'
                type='file'
                className='hidden'
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className='flex h-full w-full flex-col gap-4 text-black lg:hidden'>
            <span>Detail Harga</span>
            <div className='flex justify-between'>
              <span>Total Harga Tiket</span>
              <span>{totalPrice.toLocaleString()}</span>
            </div>
            <div className='flex justify-between'>
              <span>Points</span>
              <span>
                {' '}
                {coupons.length > 0 && useCoupons ? (
                  coupons.map((coupons, index) => (
                    <span key={index}>
                      {coupons.discountAmount.toLocaleString()}
                    </span>
                  ))
                ) : (
                  <span>{`${selectedCouponpoints.toLocaleString() || 0}`}</span>
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Vouchers</span>
              <span>
                {' '}
                {vouchers.length > 0 && useVouchers ? (
                  vouchers.map((vouchers, index) => (
                    <span key={index}>
                      {vouchers.discountAmount.toLocaleString()}
                    </span>
                  ))
                ) : (
                  <span>{`${selectedCouponpoints.toLocaleString() || 0}`}</span>
                )}
              </span>
            </div>
            <hr />
            <div className='flex w-full justify-between'>
              <div className='flex flex-col'>
                <span>Gunakan Kupon</span>
                <span>Sisa Kupon ({coupons.length})</span>
              </div>
              <details className='dropdown dropdown-top z-50 rounded-md border'>
                <summary className='btn btn-ghost m-0 flex w-[155px] justify-center rounded-md border bg-white p-2 font-light text-black hover:bg-white'>
                  {selectedCoupon}
                </summary>
                <ul className='menu dropdown-content rounded-box z-50 w-full bg-white shadow'>
                  <li>
                    <button
                      type='button'
                      className='text-black no-underline'
                      onClick={() => {
                        setSelectedCoupon('Pilih')
                        setSelectedCouponId(null)
                        setSelectedCouponPoints(0)
                      }}
                    >
                      Pilih
                    </button>
                  </li>

                  {coupons.map((coupon) => (
                    <li key={coupon.id}>
                      <button
                        type='button'
                        className='text-black no-underline'
                        onClick={() => {
                          setSelectedCouponId(coupon.id)
                          setSelectedCoupon(
                            `${coupon.discountAmount.toLocaleString()} \nExp:${new Date(coupon.expiryDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                          )
                          //   formik.setFieldValue("categoryId", cat.id);
                          setSelectedCouponPoints(coupon.discountAmount)
                        }}
                      >
                        <div className='flex flex-col gap-1'>
                          <span>{`${coupon.discountAmount.toLocaleString()}  `}</span>
                          <span>{`Exp:${new Date(coupon.discountAmount).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
            <div className='flex w-full justify-between'>
              <div className='flex flex-col'>
                <span>Gunakan Voucher</span>
                <span>Sisa Voucher ({vouchers.length})</span>
              </div>
              <details className='dropdown z-50 rounded-md border'>
                <summary className='btn btn-ghost m-0 flex w-[155px] justify-center rounded-md border bg-white p-2 font-light text-black hover:bg-white'>
                  {selectedVoucher}
                </summary>
                <ul className='menu dropdown-content rounded-box z-[1] w-full bg-white shadow'>
                  <li>
                    <button
                      type='button'
                      className='text-black no-underline'
                      onClick={() => {
                        setSelectedVoucher('Pilih')
                        setSelectedVoucherId(null)
                      }}
                    >
                      Pilih
                    </button>
                  </li>

                  {vouchers.map((voucher) => (
                    <li key={voucher.id}>
                      <button
                        type='button'
                        className='text-black no-underline'
                        onClick={() => {
                          setSelectedVoucher(voucher.title)
                          setSelectedVoucherId(voucher.id)
                          setSelectedDiscountAmount(voucher.discountAmount)
                        }}
                      >
                        <div className='flex flex-col gap-1'>
                          <span>{voucher.title}</span>
                          <span>{voucher.discountAmount.toLocaleString()}</span>
                          <span>{`Exp:${new Date(voucher.endDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            <div className='flex justify-between'>
              <span>Total Bayar</span>
              <span>{totalPrice.toLocaleString()}</span>
            </div>
            <div>
              <button className='h-[48px] w-full rounded-lg bg-[#0049CC] font-bold text-white'>
                Bayar Tiket
              </button>
            </div>
          </div>
        </div>
        <div className='hidden flex-col gap-4 lg:flex'>
          <div className='flex h-[48px] w-[383px] justify-center gap-4 rounded-lg border bg-[#FFCC00] p-[10px] text-black'>
            <span className='countdown font-mono text-2xl'>
              {formatTime(timeLeft)}
            </span>
            <div className='h-6 border-l border-black'></div>
            <span>Segera selesaikan pesanan</span>
          </div>
          <div className='z-50 flex h-[450px] w-[383px] flex-col justify-between gap-4 rounded-lg border p-[30px] text-black'>
            <span>Detail Harga</span>
            <div className='flex justify-between'>
              <span>Total Harga Tiket</span>
              <span>{totalPrice.toLocaleString()}</span>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between'>
                <span>Kupon</span>
                <span>
                  {' '}
                  {coupons.length > 0 && useCoupons ? (
                    coupons.map((coupons, index) => (
                      <span key={index}>
                        {coupons.discountAmount.toLocaleString()}
                      </span>
                    ))
                  ) : (
                    <span>{`${selectedCouponpoints.toLocaleString() || 0}`}</span>
                  )}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Voucher</span>
                <span>
                  {' '}
                  {vouchers.length > 0 && useCoupons ? (
                    vouchers.map((vouchers, index) => (
                      <span key={index}>
                        {vouchers.discountAmount.toLocaleString()}
                      </span>
                    ))
                  ) : (
                    <span>{`${selectedDiscountAmount.toLocaleString() || 0}`}</span>
                  )}
                </span>
              </div>
            </div>
            <hr />
            <div className='flex justify-between'>
              <div className='flex w-full justify-between'>
                <div className='flex flex-col'>
                  <span>Gunakan Kupon</span>
                  <span>Sisa Kupon ({coupons.length})</span>
                </div>
                <details className='dropdown dropdown-top z-50 rounded-md border'>
                  <summary className='btn btn-ghost m-0 flex w-[155px] justify-center rounded-md border bg-white p-2 font-light text-black hover:bg-white'>
                    {selectedCoupon}
                  </summary>
                  <ul className='menu dropdown-content rounded-box z-40 w-full bg-white shadow'>
                    <li>
                      <button
                        type='button'
                        className='text-black no-underline'
                        onClick={() => {
                          setSelectedCoupon('Pilih')
                          setSelectedCouponId(null)
                          setSelectedCouponPoints(0)
                        }}
                      >
                        Pilih
                      </button>
                    </li>

                    {coupons.map((coupon) => (
                      <li key={coupon.id}>
                        <button
                          type='button'
                          className='text-black no-underline'
                          onClick={() => {
                            setSelectedCouponId(coupon.id)
                            setSelectedCoupon(
                              `${coupon.discountAmount.toLocaleString()} \nExp:${new Date(coupon.expiryDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                            )
                            //   formik.setFieldValue("categoryId", cat.id);
                            setSelectedCouponPoints(coupon.discountAmount)
                          }}
                        >
                          <div className='flex flex-col gap-1'>
                            <span>{`${coupon.discountAmount.toLocaleString()}  `}</span>
                            <span>{`Exp:${new Date(coupon.expiryDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex w-full justify-between'>
                <div className='flex flex-col'>
                  <span>Gunakan Voucher</span>
                  <span>Sisa Voucher ({vouchers.length})</span>
                </div>
                <details className='dropdown z-50 rounded-md border'>
                  <summary className='btn btn-ghost m-0 flex h-full w-[155px] justify-center whitespace-pre-line rounded-md border bg-white p-2 font-light text-black hover:bg-white'>
                    {selectedVoucher}
                  </summary>
                  <ul className='menu dropdown-content rounded-box z-[1] w-full bg-white shadow'>
                    <li>
                      <button
                        type='button'
                        className='text-black no-underline'
                        onClick={() => {
                          setSelectedVoucher('Pilih')
                          setSelectedVoucherId(null)
                        }}
                      >
                        Pilih
                      </button>
                    </li>

                    {vouchers.map((voucher) => (
                      <li key={voucher.id}>
                        <button
                          type='button'
                          className='text-black no-underline'
                          onClick={() => {
                            setSelectedVoucher(
                              `${voucher.title} \n${voucher.discountAmount} \nExp:${new Date(voucher.endDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                            )
                            setSelectedVoucherId(voucher.id)
                            setSelectedDiscountAmount(voucher.discountAmount)
                          }}
                        >
                          <div className='flex flex-col gap-1'>
                            <span>{voucher.title}</span>
                            <span>
                              {voucher.discountAmount.toLocaleString()}
                            </span>
                            <span>{`Exp:${new Date(voucher.endDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}</span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
            <div className='flex justify-between'>
              <span>Total Bayar</span>
              <span>{finalPrice.toLocaleString()}</span>
            </div>
            <div>
              <button
                className='h-[48px] w-full rounded-lg bg-[#0049CC] font-bold text-white'
                onClick={handleBuyTicket}
              >
                Bayar Tiket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
