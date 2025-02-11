"use client"
import { useSession } from "next-auth/react";
import Image from "next/image"
import { useSearchParams } from "next/navigation";
import { title } from "process";
import { useEffect, useState } from "react";


export default function Transaction() {
    const { data: session, status } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const[id,setId] = useState(0)
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setEmail(session.user.email || '')
      setId(session.user.id)
    }
  }, [session])

    const searchParams = useSearchParams();
    const eventId = searchParams.get("id")
    const title = searchParams.get("title") || "Event";
    const price = parseInt(searchParams.get("price") || "0");
    const quantity = parseInt(searchParams.get("quantity") || "1");
    const location = searchParams.get("location") || "Unknown Location";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const totalPrice = (price * quantity)
    const handleBuyTicket = async()=>{
        try {
            const res = await fetch("http://localhost:8000/api/transaction",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'

                },
                body:JSON.stringify({
                    userId:id,
                    eventId:Number(eventId),
                    transactionStatus:"WAITING_FOR_PAYMENT",
                    totalPrice:totalPrice

                })
            })
          
        
            const data = await res.json();
            alert("Transaction created successfully!");
            console.log("Server response:", data);
        } catch (error) {
            console.error("Error creating transaction:", error);
            alert(`Error creating transaction: ${error}`);
        }
    }
    return (
        <div className="bg-white w-full h-full">
            <div className="flex lg:gap-[50px] lg:p-[100px] p-[20px]">
                <div className="flex flex-col gap-4 text-black w-full">
                <div className="lg:hidden  border rounded-lg bg-[#FFCC00] lg:w-[383px] w-full lg:h-[48px] h-full p-[10px] text-black flex gap-4 justify-center items-center">
                     <span className="countdown font-mono text-2xl">
                            <span >10</span>:
                            <span >24</span>:
                            <span >54</span>
                        </span>
                        <div className="border-l border-black h-10">

                        </div>
                        <span >Segera selesaikan pesananmu
                        </span>

                    </div>
                    <span className="text-[21px] font-bold">Detail Pemesanan</span>
                    <div className="border rounded-lg p-[20px] flex flex-col gap-4 w-full ">
                        <div className="flex gap-4">
                            <Image className="rounded-lg hidden lg:block" src="https://assets.loket.com/neo/production/images/banner/VGSBz_1733741307486312.jpeg" width={260} height={122} alt="" />
                            <div className="flex flex-col gap-4">
                                <span>{title}
                                </span>
                                <div className="flex gap-4">
                                    <span><Image src="/calendar.png" width={20} height={20} alt="" /></span>

                                    <span>24 Jan - 24 Jan 2025
                                    </span>

                                </div>
                                <div className="flex gap-4">
                                    <span><Image src="/clock.png" width={20} height={20} alt="" /></span>

                                    <span>06:00 - 15:00 WIB
                                    </span>

                                </div>
                                <div className="flex gap-4">
                                    <span><Image src="/location.png" width={20} height={20} alt="" /></span>

                                    <span>{location}</span>

                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <span>Jenis Tiket</span>
                            <div className="flex gap-[50px]">
                                <span>Harga</span>
                                <span>Jumlah</span>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <span>{title}</span>
                            <div className="flex gap-[50px]">
                                <span>{`Rp ${price.toLocaleString()}`}
                                </span>
                                <span>{`x${quantity}`}</span>
                            </div>
                        </div>
                    </div>
                    <span className="text-[21px] font-bold">Detail Pemesanan</span>
                    <div className="border rounded-lg p-[20px] flex flex-col gap-4 w-full ">
                        <label htmlFor="">Nama Lengkap</label>

                        <input className=" w-full h-[47px] rounded-lg z-50" type="text" value={name} />
                      
                        <label htmlFor="">Email</label>
                        <label htmlFor="">E-tiket akan dikirim ke email kamu.</label>

                        <input className="w-full h-[47px] rounded-lg" type="text" value={email} />
                    </div>
                    <span className="text-[21px] font-bold">Pembayaran</span>
                    <div className="flex items-center justify-center w-full ">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-36 lg:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-black"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div>
                    <div className="lg:hidden   flex flex-col gap-4 w-full h-full  text-black">
                        <span>Detail Harga</span>
                        <div className="flex justify-between">
                            <span>Total Harga Tiket
                            </span>
                            <span>{totalPrice.toLocaleString()}
                            </span>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <span>Total Bayar
                            </span>
                            <span>{totalPrice.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <button  className="w-full h-[48px] bg-[#0049CC] rounded-lg text-white font-bold">Bayar Tiket</button>
                        </div>
                    </div>

                </div>
                <div className="hidden lg:flex flex-col gap-4 ">
                    <div className="border rounded-lg bg-[#FFCC00] w-[383px] h-[48px] p-[10px] text-black flex gap-4 justify-center">
                     <span className="countdown font-mono text-2xl">
                            <span >10</span>:
                            <span >24</span>:
                            <span >54</span>
                        </span>
                        <div className="border-l border-black h-6">

                        </div>
                        <span >Segera selesaikan pesananmu
                        </span>

                    </div>
                    <div className="border rounded-lg p-[30px] flex flex-col w-[383px] h-[300px] justify-between text-black z-50">
                        <span>Detail Harga</span>
                        <div className="flex justify-between">
                            <span>Total Harga Tiket
                            </span>
                            <span>{totalPrice.toLocaleString()}
                            </span>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <span>Total Bayar
                            </span>
                            <span>{totalPrice.toLocaleString()}
                            </span>
                        </div>
                        <div>
                            <button  className="w-full h-[48px] bg-[#0049CC] rounded-lg text-white font-bold" onClick={handleBuyTicket}>Bayar Tiket</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}