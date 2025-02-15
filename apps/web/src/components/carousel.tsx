'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Carousel() {
  const slides = [
    {
      src: 'https://assets.loket.com/images/ss/1722926397_pztZaq.jpg',
      alt: 'Slide 1',
    },
    {
      src: 'https://assets.loket.com/images/ss/1728879571_AWSgN8.jpg',
      alt: 'Slide 2',
    },
    {
      src: 'https://assets.loket.com/images/ss/1736479528_VMd6gW.png',
      alt: 'Slide 3',
    },
    {
      src: 'https://loket-production-sg.s3.ap-southeast-1.amazonaws.com/images/ss/1721024027_4fclnB.jpg',
      alt: 'Slide 4',
    },
   
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full p-4 sm:p-8">
      <div className="relative h-48 overflow-hidden rounded-lg sm:h-64 md:h-80 lg:h-96">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute sm:bottom-14 bottom-10 sm:right-12 right-28 z-30 flex -translate-x-1/2 space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`h-3 w-3 rounded-full ${index === currentSlide ? 'bg-gray-800' : 'bg-gray-400'}`}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Previous Button */}
      <button
        type="button"
        onClick={prevSlide}
        className="group absolute sm:left-10 left-4 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50">
          <svg
            className="h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1L1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={nextSlide}
        className="group absolute sm:right-10 right-4 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50">
          <svg
            className="h-4 w-4 text-white"
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
  )
}
