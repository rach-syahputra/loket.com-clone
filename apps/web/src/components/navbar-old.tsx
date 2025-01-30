import Image from "next/image"
import Link from "next/link"


export  function MainNavbar(){
    return(
        <div className="w-full h-[70px] bg-[#152955] lg:px-[50px] px-[20px] py-[10px] ">
            <div className="flex justify-between items-center">
                <Link href="/"><Image className="" src="https://assets.loket.com/images/logo-loket-white.png" height={35} width={136} alt=""/></Link>
                <form className="lg:w-[600px] hidden md:w-[300px] md:block lg:block">
                        <div className="flex ">
                            <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
                          
                            <div className="relative w-full ">
                                <input  type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-md border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Cari brand, produk, atau seller" required />
                                <button type="submit"  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-md border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                    <span className="sr-only">Search</span>
                                </button>
                            </div>
                        </div>
                    </form>
                    <div  className="flex gap-[30px] items-center">
                    <Link href="/event">
                    <div className="lg:flex md:flex hidden gap-4 items-center ">
                            <Image src="https://assets.loket.com/web/assets/img/ic_schedule.svg" height={20} width={20} alt=""/>
                            <span>Buat Event</span>
                        </div></Link>
                        <Link href="/explore">
                        <div className="lg:flex md:flex hidden gap-4 items-center">
                        <Image src="https://assets.loket.com/web/assets/img/ic_explore_compass.svg" height={20} width={20} alt=""/>

                            <span>Jelajah</span>
                        </div></Link>
                        <div className="lg:hidden md:hidden block">
                        <Image src="https://assets.loket.com/web/assets/img/search-new.svg" height={30} width={20} alt=""/>

                        </div>
                        <div className="w-[40px] h-[40px] dropdown dropdown-hover dropdown-end">
                        <Image src="https://assets.loket.com/web/assets/img/avatar.svg" height={40} width={40} alt=""/>
                        <ul tabIndex={0} className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 shadow text-black">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
                        </div>
                    </div>
            </div>
            
        </div>
    )
}

export function SecondNavbar(){
    return(
        <div className="h-[80px] w-full bg-white border-b">
            <div className="flex justify-between lg:px-[100px] px-[20px] py-[20px] items-center">
            <Link href="/"><Image src="https://assets.loket.com/images/logo-loket-blue.png" height={35} width={160} alt=""/></Link>

            <Link href="/">
            <span className="text-black font-normal">
                BANTUAN
            </span></Link>
            </div>
          
        </div>
    )
}