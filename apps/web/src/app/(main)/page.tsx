import {Card} from "@/components/cards";
import Carousel from "@/components/carousel";
import Image from "next/image";

export default function Home() {
  return (
  <div className="bg-white w-full min-h-screen flex flex-col gap-[50px]">

  
    <Carousel/>
    <span className="text-[24px] text-black font-semibold lg:px-[50px] px-[20px]">
    Event Pilihan
    </span>
    <Card/>
    
   
  </div>
  );
}
