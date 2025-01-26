import Image from "next/image";

export default function Carousel() {
  return (
    <div>
      <div
        id="indicators-carousel"
        className="relative w-full p-4 sm:p-8"
        data-carousel="static"
      >
        {/* Carousel wrapper */}
        <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg">
          {/* Item 1 */}
          <div
            className="hidden duration-700 ease-in-out"
            data-carousel-item="active"
          >
            <Image
              src="https://assets.loket.com/images/ss/1722926397_pztZaq.jpg"
              width={1000}
              height={500}
              className="absolute block w-full h-full object-cover"
              alt="Slide 1"
            />
          </div>
          {/* Item 2 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <Image
              src="https://assets.loket.com/images/ss/1728879571_AWSgN8.jpg"
              width={1000}
              height={500}
              className="absolute block w-full h-full object-cover"
              alt="Slide 2"
            />
          </div>
          {/* Item 3 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <Image
              src="https://assets.loket.com/images/ss/1736479528_VMd6gW.png"
              width={1000}
              height={500}
              className="absolute block w-full h-full object-cover"
              alt="Slide 3"
            />
          </div>
          {/* Item 4 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <Image
              src="https://loket-production-sg.s3.ap-southeast-1.amazonaws.com/images/ss/1721024027_4fclnB.jpg"
              width={1000}
              height={500}
              className="absolute block w-full h-full object-cover"
              alt="Slide 4"
            />
          </div>
          {/* Item 5 */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <Image
              src="https://assets.loket.com/images/ss/1736479665_zRytUN.png"
              width={1000}
              height={500}
              className="absolute block w-full h-full object-cover"
              alt="Slide 5"
            />
          </div>
        </div>

        {/* Slider indicators */}
        <div className="absolute bottom-8 sm:bottom-14 lg:bottom-[60px] lg:left-[1400px] left-1/2 z-30 flex -translate-x-1/2 space-x-3">
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-gray-400"
            aria-current="true"
            aria-label="Slide 1"
            data-carousel-slide-to="0"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-gray-400"
            aria-current="false"
            aria-label="Slide 2"
            data-carousel-slide-to="1"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-gray-400"
            aria-current="false"
            aria-label="Slide 3"
            data-carousel-slide-to="2"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-gray-400"
            aria-current="false"
            aria-label="Slide 4"
            data-carousel-slide-to="3"
          ></button>
          <button
            type="button"
            className="w-3 h-3 rounded-full bg-gray-400"
            aria-current="false"
            aria-label="Slide 5"
            data-carousel-slide-to="4"
          ></button>
        </div>

        {/* Slider controls */}
        <div>
          <button
            type="button"
            className="absolute top-0 left-4 lg:top-0 lg:left-[90px] z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg
                className="w-4 h-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 right-4 lg:top-0 lg:right-[80px] z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
              <svg
                className="w-4 h-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 9l4-4-4-4"
                />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
