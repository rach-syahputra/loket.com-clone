import Image from "next/image"
import Link from "next/link"



export  function Card() {
    return (
       <Link href="/detailpage"> <div className="border sm:w-[290px] min-w-[300px] h-auto rounded-[10px]">
            <div className="flex flex-col">
                <div className="relative w-full h-[137px]">
                    <Image
                        className="rounded-t-[10px] object-cover"
                        src="https://assets.loket.com/neo/production/images/banner/VGSBz_1733741307486312.jpeg"
                        alt="Event Image"
                        fill
                    />
                </div>               <div className=" text-[20px] flex flex-col gap-2 p-[10px]">
                    <span className="text-black">Whisky Live Jakarta</span>
                    <span className="text-[#989AA4]">01 Feb - 02 Feb 2025</span>
                    <span className="font-bold text-black">Rp350.000</span>
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
        </div></Link>
    )
}

export  function CardExplore() {
    return (
       <Link href="/detailpage"> <div className="border sm:w-[290px] w-full h-auto rounded-[10px]">
            <div className="flex flex-col">
                <div className="relative w-full h-[137px]">
                    <Image
                        className="rounded-t-[10px] object-cover"
                        src="https://assets.loket.com/neo/production/images/banner/VGSBz_1733741307486312.jpeg"
                        alt="Event Image"
                        fill
                    />
                </div>               <div className=" text-[20px] flex flex-col gap-2 p-[10px]">
                    <span className="text-black">Whisky Live Jakarta</span>
                    <span className="text-[#989AA4]">01 Feb - 02 Feb 2025</span>
                    <span className="font-bold text-black">Rp350.000</span>
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
        </div></Link>
    )
}