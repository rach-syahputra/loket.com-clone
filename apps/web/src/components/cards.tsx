"use client"
import { useSearch } from "@/context/search-context"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export  function Card() {
    const { events } = useSearch(); // Access global events


   
   
    return (
        <div className="lg:grid  lg:grid-cols-4 lg:px-[50px] px-[20px] flex  gap-4 overflow-x-auto">
        {events.length > 0 ? (
            events.map((event) => (
                <Link key={event.id} href={`/detail/${event.slug}`}>
                    <div className="border sm:w-[290px] min-w-[300px] h-auto rounded-[10px]">
                        <div className="flex flex-col">
                            <div className="relative w-full h-[137px]">
                                <Image
                                    className="rounded-t-[10px] object-cover"
                                    src="https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png"
                                    alt=""
                                    fill
                                />
                            </div>
                            <div className="text-[20px] flex flex-col gap-2 p-[10px]">
                                <span className="text-black">{event.title}</span>
                                <span className="text-[#989AA4]"></span>
                                <span className="font-bold text-black">Rp{event.price.toLocaleString()}</span>
                            </div>
                            <hr />
                            <div className="flex gap-4 p-[10px]">
                    <div className="w-[30px] h-[30px] rounded-[20px] overflow-hidden">
                        <Image className="" src="https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png" width={30} height={30} alt="" />
                    </div>
                    <span className="text-black">                    Caledonia Live
                    </span>
                </div>
                        </div>
                    </div>
                </Link>
            ))
        ) : (
            <p>No events available</p>
        )}
    </div>
    )
}

interface event {
    id:number
    slug: string
    title: string
    description: string
    bannerUrl: string
    registrationStartDate: string | Date // Accept both strings and Date objects
    registrationEndDate: string | Date
    eventStartDate: string | Date
    eventEndDate: string | Date
    eventStartTime:string
    eventEndTime:string
    price: number
    availableSeats: number
    locationId: number
    categoryId: number
    ticketType: 'FREE' | 'PAID' // Assuming TicketType is an enum with these values
    organizerId: number
}

// The `event` interface you shared in your snippet:


// We define the types for our props (the user’s selected filters)
type TicketType = "FREE" | "PAID" | null;

interface CardExploreProps {
  selectedProvinceId: string | null;
  selectedCategoryId: string | null;
  selectedTicketType: TicketType;
}

export function CardExplore({
  selectedProvinceId,
  selectedCategoryId,
  selectedTicketType,
}: CardExploreProps) {
  const [events, setEvents] = useState<event[]>([]);

  // Each time these props change, re-fetch from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (selectedProvinceId) {
          params.append("locationId", selectedProvinceId);
        }
        if (selectedCategoryId) {
          params.append("categoryId", selectedCategoryId);
        }
        if (selectedTicketType) {
          params.append("ticketType", selectedTicketType);
        }

        // Example endpoint with dynamic query
        const response = await fetch(
          `http://localhost:8000/api/events/filter?${params.toString()}`
        );
        const data = await response.json();

        if (data.result) {
          setEvents(data.result);
        } else {
          // If no 'result' field, handle accordingly
          setEvents([]);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        setEvents([]);
      }
    };

    fetchData();
  }, [selectedProvinceId, selectedCategoryId, selectedTicketType]);

  return (
    <div className="lg:grid lg:grid-cols-4 lg:px-[20px] px-[20px] flex gap-4 overflow-x-auto z-50">
      {events.length > 0 ? (
        events.map((event) => (
          <Link key={event.id} href={`/detail/${event.slug}`}>
            <div className="border sm:w-[290px] min-w-[300px] h-auto rounded-[10px]">
              <div className="flex flex-col">
                <div className="relative w-full h-[137px]">
                  <Image
                    className="rounded-t-[10px] object-cover"
                    src={
                      
                      "https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png"
                    }
                    alt={event.title}
                    fill
                  />
                </div>
                <div className="text-[20px] flex flex-col gap-2 p-[10px]">
                  <span className="text-black">{event.title}</span>
                  <span className="font-bold text-black">
                    Rp{event.price.toLocaleString()}
                  </span>
                </div>
                <hr />
                <div className="flex gap-4 p-[10px]">
                  <div className="w-[30px] h-[30px] rounded-[20px] overflow-hidden">
                    <Image
                      src="https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png"
                      width={30}
                      height={30}
                      alt=""
                    />
                  </div>
                  <span className="text-black">Caledonia Live</span>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
}
