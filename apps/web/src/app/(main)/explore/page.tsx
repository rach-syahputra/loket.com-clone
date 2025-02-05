"use client"
import { CardExplore } from "@/components/cards";
import Link from "next/link";
import { useEffect, useState } from "react";
interface Province {
    id:string
    name:string
  }


export default function Explore() {
    const [province,setProvince] = useState<Province[]>([])
    useEffect(()=>{
        fetch("http://localhost:8000/api/provinces")
        .then((res)=>res.json())
        .then((data)=>{
            if (data.data){
                setProvince(data.data)
            }
        }).catch((error)=>
            console.log("Error fetching provinces: ",error)
        )
    },[])
    return (
        <div className="w-full h-full bg-white p-[20px] sm:p-0">
            <div className="sm:flex block gap-4">
                <div className="sm:block hidden bg-white border w-[300px] min-h-[100%] sticky top-0 p-[50px] md:p-[20px] relative z-20">
                    <div>
                        <span className="text-[20px] text-black font-bold">Filter</span>
                        <hr />
                        <div className="w-full">
                            <details className="collapse rounded-box">
                                <summary className="collapse-title text-lg font-medium text-black">
                                    Lokasi
                                </summary>
                                <div className="collapse-content">
                                    <div className="text-black flex flex-col gap-4">
                                        {
                                            province.length>0?(
                                                province.map((province)=>(
                                                    <Link href="#" key={province.id} className="text-black no-underline">
                                                        {province.name}

                                                    </Link>
                                                ))
                                            ):null
                                        }
                                    </div>
                                </div>
                            </details>

                            <details className="collapse mt-2">
                                <summary className="collapse-title text-lg font-medium text-black">
                                    Topik
                                </summary>
                                <div className="collapse-content">
                                    <div>
                                        <Link href="#" className="text-black no-underline">Semua Topik</Link><br />
                                        <Link href="#" className="text-black no-underline">Bisnis</Link><br />
                                        {/* Add more topics as needed */}
                                    </div>
                                </div>
                            </details>

                            <details className="collapse mt-2">
                                <summary className="collapse-title text-lg font-medium text-black">
                                    Waktu
                                </summary>
                                <div className="collapse-content">
                                    <div>
                                        <Link href="#" className="text-black no-underline">Hari Ini</Link><br />
                                        <Link href="#" className="text-black no-underline">Besok</Link><br />
                                        {/* Add more time options as needed */}
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 w-full">

                    <div className="w-full sm:p-[20px]">
                        <div className="flex sm:justify-end justify-between gap-2">
                            <button
                                tabIndex={0}
                                className="sm:hidden p-2 border rounded-lg w-[200px] h-[36px] text-black text-center"
                            >
                                Filter
                            </button>

                            <button 
                                id="dropdownHoverButton" 
                                data-dropdown-toggle="dropdownHover" 
                                data-dropdown-trigger="hover" 
                                className="p-2 border rounded-lg w-[200px] h-[36px] text-black text-center bg-white"
                                type="button"
                            >
                                Urutkan
                                <svg className="w-2.5 h-2.5 ms-3 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>

                            {/* Dropdown menu */}
                            <div id=" dropdownHover" className="z-50 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44">
                                <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownHoverButton">
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Earnings</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">Sign out</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2 w-full sm:px-0">
                        <CardExplore />
                        <CardExplore />
                        <CardExplore />
                        <CardExplore />
                        <CardExplore />
                        <CardExplore />
                        <CardExplore />
                        <CardExplore />
                    </div>
                </div>
            </div>
        </div>
    );
}
