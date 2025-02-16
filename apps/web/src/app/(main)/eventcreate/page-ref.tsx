"use client"
import Image from "next/image"
import Link from "next/link";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import TimePicker from "react-time-picker"
import { useFormik } from "formik";
import * as Yup from "yup"  
import { log } from "console";

export default function Eventbrowsing() {
    const [activeTab, setActiveTab] = useState(1);
    const [modalDate, setModalDate] = useState(false)
    const [modalTime, setModalTime] = useState(false)
    const [modalLocation,setModalLocation] = useState(false)
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [startTime, setStartTime] = useState<string | null>(null)
    const [endTime, setEndTime] = useState<string | null>(null)

    const formik = useFormik({
        initialValues:{
            alamat:"",
            kota:"",
            provinsi:""
        },
        validationSchema:Yup.object({
                    alamat:Yup.string().required("Alamat Wajib Diisi"),
                    kota:Yup.string().required("Kota Wajib Diisi"),
                    provinsi:Yup.string().required("Provinsi Wajib Diisi")
        }),onSubmit:(values)=>{
            console.log(values)
        }
        
    })
    return (
        <div className=" bg-white w-full h-full py-[100px]">
            <div className="flex flex-col items-center justify-center gap-[50px] ">
                
                <div className="flex flex-col  sm:w-[900px] border rounded-[20px]">
                    <div className="relative">
                        <Image className="rounded-t-[20px] md:rounded-t-[70px] lg:rounded-t-[20px]" src="https://assets.loket.com/images/banner-event.jpg" width={900} height={421} alt="" />
                        <div className="absolute bottom-[80px] left-[165px] sm:bottom-[180px]  sm:left-[415px] flex flex-col gap-4">

                            <Image className="" src="/add.png" width={60} height={128} alt="" />
                        </div>
                        <div className="absolute bottom-[50px] left-[100px] sm:bottom-[130px] sm:left-[290px] flex flex-col gap-4">

                            <span className="sm:text-[24px] text-[13px]">Unggah gambar/poster/banner</span>
                        </div>

                    </div>
                    <div className="sm:p-[50px] p-[20px] flex flex-col gap-4">
                        <span className="text-[24px] text-[#ADBAD1]">Nama Event*</span>
                        <input type="text" className="border-none focus:outline-none focus:ring-0 text-[24px]" placeholder="Nama Event*"/>
                        <span className="text-[#ADBAD1] text-[15px]">Pilih Kategori*</span>
                        <hr />
                        <div className="sm:grid sm:grid-cols-3 flex flex-col gap-2 ">
                            <div className="sm:flex hidden flex-col gap-4 ">
                                <span className=" text-[14px] text-black font-medium sm:flex hidden">Diselenggarakan Oleh</span>
                                <div className="flex items-center gap-4">
                                    <div className="w-[58px] h-[58px] rounded-[40px] overflow-hidden border">
                                        <Image className="" src="https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png" width={58} height={58} alt="" />
                                    </div>
                                    <span className="text-black font-light">Andi Farrel Athalla Pasha</span>

                                </div>
                            </div>

                            <div className="flex flex-col gap-4 sm:ml-[50px]">
                                <span className="text-[14px] text-black font-medium sm:flex hidden">Tanggal & Waktu</span>
                                <div className="flex items-center gap-4" onClick={() => setModalDate(true)}>
                                    <Image className="" src="/calendar.png" width={20} height={20} alt="" />

                                    {startDate && endDate ?
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[#ADBAD1] font-light ">
                                                {startDate.toLocaleDateString("en-US", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </span>
                                            <span className="text-[#ADBAD1] font-light ">
                                                {endDate.toLocaleDateString("en-US", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </span>
                                        </div> :
                                        <span >Pilih Tanggal</span>


                                    }

                                </div>
                                <div className="flex items-center gap-4" onClick={() => setModalTime(true)}>
                                    <Image className="" src="/clock.png" width={20} height={20} alt="" />
                                    {
                                        startTime && endTime ?
                                        <div className="flex  gap-2">
                                            <span className="text-[#ADBAD1] font-light">
                                            {`${startTime} - ${endTime} `} 
                                        </span>
                                       
                                        </div>
                                        
                                        :
                                        <span className="text-[#ADBAD1] font-light">Pilih Waktu</span>

                                    }

                                </div>
                            </div>
                            <div className="flex flex-col gap-4  sm:ml-[20px]">
                                <span className="text-[14px] text-black font-medium sm:flex hidden">Lokasi</span>
                                <div className="flex items-center gap-4" onClick={()=>setModalLocation(true)}>
                                    <Image className="" src="/calendar.png" width={20} height={20} alt="" />

                                    <span className="text-[#ADBAD1] font-light">Pilih Lokasi</span>

                                </div>
                            </div>
                            <div className="flex sm:hidden flex-col gap-4 mt-[5px]">
                                <span className=" text-[14px] text-black font-medium sm:flex hidden">Diselenggarakan Oleh</span>
                                <div className="flex items-center gap-4">
                                    <div className="w-[58px] h-[58px] rounded-[40px] overflow-hidden border">
                                        <Image className="" src="https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png" width={58} height={58} alt="" />
                                    </div>
                                    <span className="text-black font-light">Andi Farrel Athalla Pasha</span>

                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <span className="flex justify-start text-black text-[20px]">
                    Kategori Tiket
                </span>
                <div >

                    <div className="flex sm:flex-row flex-col px-[20px] sm:px-0 gap-4 justify-center">
                        <Link href="/"><div className="w-[400px] h-[90px] bg-white border rounded-lg p-[20px] flex justify-between items-center">
                            <div className="flex flex-col gap-1 text-black">
                                <span className="">Buat Tiket</span>
                                <span className="font-semibold">Berbayar</span>
                            </div>

                            <Image className="rounded-t-[20px]" src="/add.png" width={40} height={50} alt="" />

                        </div></Link>
                        <Link href="/">
                            <div className="w-[400px] h-[90px] bg-white border rounded-lg p-[20px] flex justify-between items-center">
                                <div className="flex flex-col gap-1 text-black">
                                    <span className="">Buat Tiket</span>
                                    <span className="font-semibold">Gratis</span>
                                </div>

                                <Image className="rounded-t-[20px]" src="/add.png" width={40} height={50} alt="" />

                            </div></Link>
                    </div>
                </div>

                <span className="text-[20px] text-black">
                    Deskripsi
                </span>
                <div className="px-[20px]">
                    <textarea className="lg:w-[900px] w-screen h-[200px]  sm:h-[400px] text-black" name="" id=""></textarea>
                </div>

                {modalDate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="relative bg-white w-[300px] h-[300px] rounded-xl">
                            <button className="absolute right-0 w-[20px] h-[20px] m-[10px]" onClick={() => setModalDate(false)}>
                                X
                            </button>
                            <div className="p-[20px]  flex flex-col items-center justify-center w-full h-full">
                                <label htmlFor="">Tanggal Mulai</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date: Date | null) => setStartDate(date)}
                                    className="border rounded p-2 w-full"
                                    placeholderText="Select a date"
                                />


                                <label htmlFor="">Tanggal Berakhir</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date: Date | null) => setEndDate(date)}
                                    className="border rounded p-2 w-full"
                                    placeholderText="Select a date"
                                />

                            </div>
                        </div>
                    </div>
                )

                }

                {modalTime && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
                        <div className="relative bg-white w-[300px] h-[300px] rounded-xl ">
                            <button className="absolute right-0 w-[20px] h-[20px] m-[10px]" onClick={() => setModalTime(false)}>
                                X
                            </button>
                            <div className="p-[20px] w-full h-full flex flex-col justify-center items-center">
                                <label htmlFor="">Waktu Mulai</label>


                                <input
                                    type="time"
                                    id="start-time"
                                    value={startTime || ""}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />

                                <label htmlFor="">Waktu Berakhir</label>

                                <input
                                    type="time"
                                    id="start-time"
                                    value={endTime || ""}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"

                                />

                            </div>
                        </div>
                    </div>
                )

                }

                {  modalLocation && (
                    <form action="" onSubmit={formik.handleSubmit}>
                         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="relative bg-white w-[300px] h-auto rounded-xl ">
                            
                        <button className="absolute right-0 w-[20px] h-[20px] m-[10px]" onClick={() => setModalLocation(false)}>
                                X
                            </button>
                        <div className="flex flex-col gap-4 p-[20px]">
                        <label htmlFor="">Alamat</label>
                        {
                            formik.touched.alamat && formik.errors.alamat ?(
                               <div>{formik.errors.alamat}</div> 
                            ):null
                        }
                        <input type="text" 
                        name="alamat"
                        id="alamat"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.alamat}
                        />
                        
                        <label htmlFor="">Kota</label>
                        {
                            formik.touched.kota && formik.errors.kota ?(
                               <div>{formik.errors.kota}</div> 
                            ):null
                        }
                        <input type="text" 
                        name="kota"
                        id="kota"
                        onBlur={formik.handleBlur}

                        onChange={formik.handleChange}
                        value={formik.values.kota}
                        />
                      
                        <label htmlFor="">Provinsi</label>
                        {
                            formik.touched.provinsi && formik.errors.provinsi ?(
                               <div>{formik.errors.provinsi}</div> 
                            ):null
                        }
                        <input type="text" 
                        name="provinsi"
                        id="provinsi"
                        onBlur={formik.handleBlur}

                        onChange={formik.handleChange}
                        value={formik.values.provinsi}
                        />
                        </div>
                        
                     
                        </div>

                    </div>
                    </form>
                   
                )

                }
                <div className="fixed bottom-0 border-t w-full h-[70px] bg-white py-[15px] lg:px-[100px] px-[20px] md:px-[80px]">
                    <div className="flex justify-between items-center">
                        <p className="text-[14px] text-black hidden md:block "><span className="text-black text-[24px] font-semibold">Yeay!</span> Tinggal Selangkah lagi dan event kamu berhasil dibuat.</p>
                        <button className="bg-[#0049CC]  md:w-[190px] lg:w-[190px]   h-[39px] rounded-lg font-bold">Buat Event Sekarang</button>
                    </div>

                </div>
            </div>
        </div>

        
    )
}