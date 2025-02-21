'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import LoadingDots from '@/components/loading-dots'
import { API_BASE_URL } from '@/lib/constants'

interface ReviewData {
  id: number
  totalPrice: number
  event: {
    id: number
    title: string
    eventStartDate: string
    eventEndDate: string
    eventStartTime: string
    eventEndTime: string
  }
  review: {
    id: number
    status: 'DRAFT' | 'SUBMITTED' | null
    content: string | null
    rating: number | null
  } | null
}

export default function Review() {
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [ratings, setRatings] = useState<{ [key: number]: number }>({})
  const [contents, setContents] = useState<{ [key: number]: string }>({})
  const [loading, setLoading] = useState<boolean>(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.id) return 

      try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id })
        })

        if (!response.ok) throw new Error('Failed to fetch reviews.')

        const data = await response.json()
        setReviews(data.result)

        // Initialize states for ratings and contents
        const initialRatings: { [key: number]: number } = {}
        const initialContents: { [key: number]: string } = {}
        data.result.forEach((reviewData: ReviewData) => {
          initialRatings[reviewData.id] = reviewData.review?.rating ?? 0
          initialContents[reviewData.id] = reviewData.review?.content ?? ''
        })

        setRatings(initialRatings)
        setContents(initialContents)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews() 
  }, [session]) 


  const handleSubmit = async (reviewId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/submit/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: contents[reviewId],
          rating: ratings[reviewId]
        })
      })

      if (!response.ok) throw new Error('Failed to submit review.')

      alert('Review submitted successfully!')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review.')
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center bg-white'>
        <LoadingDots />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center bg-white'>
        <span>No reviews to fill out at the moment.</span>
      </div>
    )
  }

  function formatDate(date: string | Date) {
    if (!date) return ''
    const parsedDate = new Date(date)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(parsedDate)
  }

  return (
    <div className='flex min-h-screen w-full flex-col items-center bg-white md:p-5'>
      {reviews.map((reviewData) => (
        <div
          key={reviewData.id}
          className='mb-8 flex h-auto w-[374px] flex-col rounded-lg border bg-white md:w-[1170px]'
        >
          <div className='flex justify-between bg-white p-4 text-black'>
            <span>{reviewData.totalPrice}</span>
          </div>

          <div className='bg-[#F2F3F3] p-4 text-black flex justify-between'>
            <span>{reviewData.event.title}</span>
            <span>{`${formatDate(reviewData.event.eventStartDate)} - ${formatDate(reviewData.event.eventEndDate)}`}</span>

          </div>

          <div className='flex flex-col gap-4 p-4'>
            <div className='flex w-[170px] items-center justify-center rounded-full bg-[#152955] p-2 font-semibold text-white'>
              <span>Acara Selesai</span>
            </div>

            <div className='rating z-30 flex'>
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <input
                  key={ratingValue}
                  type='radio'
                  name={`rating-${reviewData.id}`}
                  className='mask mask-star-2 bg-orange-400'
                  checked={ratings[reviewData.id] === ratingValue}
                  onChange={() =>
                    setRatings((prev) => ({ ...prev, [reviewData.id]: ratingValue }))
                  }
                />
              ))}
            </div>

            <textarea
              className='z-30 h-[170px] rounded border p-2 text-black'
              placeholder='Write your review here...'
              value={contents[reviewData.id] ?? ''}
              onChange={(e) =>
                setContents((prev) => ({ ...prev, [reviewData.id]: e.target.value }))
              }
            />

            <button
              onClick={() => handleSubmit(reviewData.review?.id ?? 0)}
              className='w-full rounded-lg bg-[#152955] p-2 text-white hover:bg-green-700'
            >
              Kirim Review
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
