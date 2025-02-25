"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSearch } from "@/context/search-context";

import { Card } from '@/components/cards'
import Carousel from '@/components/carousel'
import MobileTabletNavbar from '@/components/mobile-tablet-navbar'
export default function Home() {

  const searchParams = useSearchParams();
  const queryFromURL = searchParams.get("search") || "";

  // from your SearchContext
  const { events, allEvents, setEvents } = useSearch();

  useEffect(() => {
    // if no search query => show all events
    if (!queryFromURL.trim()) {
      setEvents(allEvents);
    } else {
      const filtered = allEvents.filter((event) =>
        event.title.toLowerCase().includes(queryFromURL.toLowerCase())
      );
      setEvents(filtered);
    }
  }, [queryFromURL, allEvents, setEvents]);
  return (
    <div className='flex min-h-screen w-full flex-col gap-[50px] bg-white pb-[100px]'>
      <Carousel />
      <span className='px-[20px] text-[24px] font-semibold text-black lg:px-[50px]'>
        Event Pilihan
      </span>

      <Card />
      <MobileTabletNavbar />
    </div>
  )
}
