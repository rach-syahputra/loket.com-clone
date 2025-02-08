"use client";

import { error } from "console";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function DetailPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [event,setEvent] = useState<Event|null>(null)
  const {slug} = useParams()

  interface Event{
    id:number
    title:string
    registrationStartDate:string | Date
    registrationEndDate:string | Date
    price:number
    description:string
   location:{
    streetAddress:string
    city:string
   }
}
  console.log('DetailPage id:', slug);
  function formatDate(date: string | Date) {
    if (!date) return "";
    const parsedDate = new Date(date);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate);
  }

  function formatTime(date: string | Date): string {
    if (!date) return "";
    const parsedDate = new Date(date);
    return parsedDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Ensures 24-hour format
    });
  }
  
  useEffect(() => {
    // Only fetch if slug is defined
    if (!slug) return;

    fetch(`http://localhost:8000/api/event/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        // Log the response to verify its structure
        console.log("API response:", data);
        if (data.result) {
          setEvent(data.result);
        }
      })
      .catch((error) => {
        console.log("Error fetching detail page", error);
      });
  }, [slug]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white w-full min-h-full lg:p-[100px] pb-[120px]">
      <div className="p-[20px] lg:p-0">
        <div className="flex lg:flex-row flex-col gap-[50px]">
          {/* Left Section */}
          <div className="flex flex-col gap-[20px] h-full lg:w-[720px] w-full">
            {/* Image Section */}
            <div className="w-full">
              <div className="border rounded-xl">
                <Image
                  className="rounded-t-lg w-full"
                  src="https://assets.loket.com/neo/production/images/banner/VGSBz_1733741307486312.jpeg"
                  width={720}
                  height={340}
                  alt="Event Banner"
                />
                <div className="flex lg:flex-col lg:gap-[70px] lg:hidden">
                  <div className="flex bg-white h-full w-[360px] p-[30px] text-black flex-col gap-4 justify-between">
                    <span>Norten Bali Diving Special Package</span>
                    <div className="flex gap-4">
                      <span>
                        <Image src="/calendar.png" width={20} height={20} alt="Calendar" />
                      </span>
                      <span>24 Jan - 24 Jan 2025</span>
                    </div>
                    <div className="flex gap-4">
                      <span>
                        <Image src="/clock.png" width={20} height={20} alt="Clock" />
                      </span>
                      <span>06:00 - 15:00 WIB</span>
                    </div>
                    <div className="flex gap-4">
                      <span>
                        <Image src="/location.png" width={20} height={20} alt="Location" />
                      </span>
                      <span>Northen Bali Diving, Bali</span>
                    </div>
                    <hr />
                    <div className="flex items-center gap-4">
                      <div className="w-[58px] h-[58px] rounded-[40px] overflow-hidden border">
                        <Image
                          src="https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png"
                          width={58}
                          height={58}
                          alt="Organizer"
                        />
                      </div>
                      <span className="text-black font-light">Andi Farrel Athalla Pasha</span>
                    </div>
                  </div>
                  <div className="hidden lg:flex border rounded-xl bg-white h-[270px] w-[360px] p-[30px] text-black flex-col gap-4 justify-between">
                    <div className="flex justify-between">
                      <span>Tiket</span>
                      <span>Rp5.000.000</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span>Total 1 tiket</span>
                      <span>Rp5.000.000</span>
                    </div>
                    <div>
                      <button className="bg-[#0049CC] w-[312px] h-[48px] p-[10px] text-white font-bold rounded-lg">
                        Beli Tiket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="tabs tabs-bordered w-full relative z-20">
              <button
                type="button"
                role="tab"
                className={`tab ${activeTab === 1 ? "tab-active" : ""} text-black`}
                onClick={() => setActiveTab(1)}
              >
                DESKRIPSI
              </button>
              <button
                type="button"
                role="tab"
                className={`tab ${activeTab === 2 ? "tab-active" : ""} text-black`}
                onClick={() => setActiveTab(2)}
              >
                TIKET
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 1 && (
                <div className="text-black h-full">
                  {event?.description}
                 
                </div>
              )}
              {activeTab === 2 && (
                <div className="h-full">
                  <div className="border rounded-lg p-[20px] text-black bg-[#EBF5FF] border-[#0049CC]">
                    <div className="flex flex-col gap-4">
                      <span>{event?.title}</span>
                    
                      <div className="flex gap-4">
                        <span>
                          <Image src="/clock.png" width={20} height={20} alt="Clock" />
                        </span>
                        <p>{`Berakhir ${formatDate(event?.registrationEndDate)}`}</p>
                      </div>
                      <hr className="bg-[#0049CC]" />
                      <div className="flex justify-between font-bold">
                        <span>{`Rp ${event?.price.toLocaleString()}`}</span>
                        <div className="flex gap-4">
                          <button className="relative border border-[#0049CC] rounded-[20px] w-[24px] h-[24px] bg-[#EBF5FF]">
                            <div className="absolute bottom-[1px] left-[9px]">-</div>
                          </button>
                          <span>1</span>
                          <button className="relative border border-[#0049CC] rounded-[20px] w-[24px] h-[24px] bg-[#EBF5FF]">
                            <div className="absolute bottom-[0px] left-[8px]">+</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:flex lg:flex-col lg:gap-[70px] hidden">
            <div className="flex border rounded-xl bg-white h-full w-[360px] p-[30px] text-black flex-col gap-4 justify-between">
              <span>{event?.title}</span>
              <div className="flex gap-4">
                <span>
                  <Image src="/calendar.png" width={20} height={20} alt="Calendar" />
                </span>
                {`${formatDate(event?.registrationStartDate)} - ${formatDate(event?.registrationEndDate)}`}
                </div>
              <div className="flex gap-4">
                <span>
                  <Image src="/clock.png" width={20} height={20} alt="Clock" />
                </span>
                <span>{`${formatTime(event?.registrationStartDate)} - ${formatTime(event?.registrationEndDate)} WIB`}</span>
                </div>
              <div className="flex gap-4">
                <span>
                  <Image src="/location.png" width={20} height={20} alt="Location" />
                </span>
                <span>{`${event?.location?.streetAddress}, ${event?.location?.city}`}</span>
              </div>
              <hr />
              <div className="flex items-center gap-4">
                <div className="w-[58px] h-[58px] rounded-[40px] overflow-hidden border">
                  <Image
                    src="https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png"
                    width={58}
                    height={58}
                    alt="Organizer"
                  />
                </div>
                <span className="text-black font-light">Andi Farrel Athalla Pasha</span>
              </div>
            </div>
            <div className="hidden lg:flex border rounded-xl bg-white h-[270px] w-[360px] p-[30px] text-black flex-col gap-4 justify-between">
              <div className="flex justify-between">
                <span>Tiket</span>
                <span>Rp5.000.000</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span>Total 1 tiket</span>
                <span>Rp5.000.000</span>
              </div>
              <div>
                <button className="bg-[#0049CC] w-[312px] h-[48px] p-[10px] text-white font-bold rounded-lg">
                  Beli Tiket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Section */}
      <div className="lg:hidden fixed bottom-0 bg-white h-[120px] w-screen p-[20px] text-black flex flex-col gap-4 z-10">
        <div className="flex justify-between">
          <span>Total 1 tiket</span>
          <span>Rp5.000.000</span>
        </div>
        <div>
          <button className="bg-[#0049CC] w-full h-[48px] p-[10px] text-white font-bold rounded-lg">
            Beli Tiket
          </button>
        </div>
      </div>
    </div>
  );
}
