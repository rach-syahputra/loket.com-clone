'use client'
import { fetchGetUserCoupons } from '@/lib/apis/user.api'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { title } from 'process'
import { useEffect, useRef, useState } from 'react'
import { Coupons } from '@/lib/interfaces/user.interface'

export default function Transaction() {
  const { data: session, status } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [id, setId] = useState(0)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [coupons, setCoupons] = useState<Coupons[]>([])
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
      setId(session.user.id)
      getCoupons()
    }
  }, [session])

  const searchParams = useSearchParams()
  const eventId = searchParams.get('id')
  const title = searchParams.get('title') || 'Event'
  const price = parseInt(searchParams.get('price') || '0')
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const location = searchParams.get('location') || 'Unknown Location'
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const [useCoupons, setUseCoupons] = useState(false) // Track if the checkbox is checked
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null)
  const [selectedCoupon, setSelectedCoupon] = useState<string>('Pilih')
  const [selectedCouponpoints,setSelectedCouponPoints] = useState<number>(0)
  const totalPrice = price * quantity
  // Sum all points from your vouchers
  const totalPoints = coupons.reduce((acc, voucher) => acc + voucher.points, 0)
  // Deduct total points from total price (ensure it doesn't go negative)
  const finalPrice = Math.max(totalPrice - (selectedCouponId ? selectedCouponpoints : 0), 0)

  const handleBuyTicket = async () => {
    try {

        if(selectedCouponId){
            const res = await fetch('http://localhost:8000/api/users/coupons',{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    Authorization:`Bearer ${session?.user.accessToken}`
                },
                body:JSON.stringify({
                    pointId:selectedCouponId
                })
            })
            const resultData = await res.json();
            if (!res.ok) {
              alert("Failed to apply coupon.");
              return;
            }
      
            console.log(" Coupon status updated successfully",resultData);
          }

        
      const formData = new FormData()
      formData.append('userId', id.toString())
      formData.append('eventId', eventId || '')
      formData.append('transactionStatus', 'WAITING_FOR_ADMIN_CONFIRMATION')
      formData.append('totalPrice', finalPrice.toString())
      
      if (paymentProof) {
        formData.append('paymentProofImage', paymentProof)
      }

      const res = await fetch('http://localhost:8000/api/transactions', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      alert('Transaction created successfully!')
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
              <span>10</span>:<span>24</span>:<span>54</span>
            </span>
            <div className='h-10 border-l border-black'></div>
            <span>Segera selesaikan pesananmu</span>
          </div>
          <span className='text-[21px] font-bold'>Detail Pemesanan</span>
          <div className='flex w-full flex-col gap-4 rounded-lg border p-[20px]'>
            <div className='flex gap-4'>
              <Image
                className='hidden rounded-lg lg:block'
                src='https://assets.loket.com/neo/production/images/banner/VGSBz_1733741307486312.jpeg'
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
            <span>Detail Harga</span>
            <div className='flex justify-between'>
              <span>Points</span>
              <span>0</span>
            </div>
            <hr />
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
              <span>10</span>:<span>24</span>:<span>54</span>
            </span>
            <div className='h-6 border-l border-black'></div>
            <span>Segera selesaikan pesananmu</span>
          </div>
          <div className='z-50 flex h-[300px] w-[383px] flex-col justify-between rounded-lg border p-[30px] text-black'>
            <span>Detail Harga</span>
            <div className='flex justify-between'>
              <span>Total Harga Tiket</span>
              <span>{totalPrice.toLocaleString()}</span>
            </div>
            <div className='flex justify-between'>
              <span>Kupon</span>
              <span>
                {' '}
                {coupons.length > 0 && useCoupons ? (
                  coupons.map((coupons, index) => (
                    <span key={index}>{coupons.points.toLocaleString()}</span>
                  ))
                ) : (
                  <span>{`${selectedCouponpoints.toLocaleString() || 0}`}</span>
                )}
              </span>
            </div>
            <hr />
            <div className='flex justify-between'>
              <div className='flex w-full justify-between'>
                <div className='flex flex-col'>
                  <span>Gunakan Kupon</span>
                  <span>Sisa Kupon ({coupons.length})</span>
                </div>
                <div>
                  <details className='dropdown z-50 rounded-md border'>
                    <summary className='btn btn-ghost m-0 flex w-[155px] justify-center rounded-md border bg-white p-2 font-light text-black hover:bg-white'>
                      {selectedCoupon}
                    </summary>
                    <ul className='menu dropdown-content rounded-box z-[1] w-full bg-white shadow'>
                      <li>
                        <button
                          type='button'
                          className=' text-black no-underline'
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
                                `${coupon.points.toLocaleString()} \nExp:${new Date(coupon.pointsExpiryDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                              )
                              //   formik.setFieldValue("categoryId", cat.id);
                              setSelectedCouponPoints(coupon.points)
                            }}
                          >
                            <div className='flex flex-col gap-1'>
                              <span>{`${coupon.points.toLocaleString()}  `}</span>
                              <span>{`Exp:${new Date(coupon.pointsExpiryDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
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
