'use client'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

interface Event {
  id: number
  title: string
  price: number
}

interface Review {
  content: string
  rating: number
  userId: number
  eventId: number
}

function ReviewForm({
  event,
  eventReviewOnSubmitted
}: {
  event: Event
  eventReviewOnSubmitted: (eventId: number) => void
}) {
  const formik = useFormik<Review>({
    initialValues: {
      content: '',
      rating: 0,
      userId: 20,
      eventId: event.id
    },
    validationSchema: Yup.object({
      content: Yup.string().required('Review content is required'),
      rating: Yup.number().min(1).max(5).required('Rating is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch('http://localhost:8000/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        })

        if (response.ok) {
          alert('Review submitted successfully')
          eventReviewOnSubmitted(event.id)
          resetForm()
        } else {
          const error = await response.json()
          alert(`Error: ${error.message}`)
        }
      } catch (error) {
        alert('An error occurred while submitting the review')
      }
    }
  })

  return (
    <div className='mx-auto mb-4 max-w-md rounded bg-white p-4 shadow'>
      <h2 className='mb-2 text-lg font-semibold'>{event.title}</h2>
      <p className='mb-4 text-sm text-gray-500'>Price: RM {event.price}</p>
      <form onSubmit={formik.handleSubmit}>
        <textarea
          name='content'
          placeholder='Write your review...'
          className='mb-2 w-full rounded border p-2'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.content}
        />
        {formik.errors.content && (
          <p className='text-sm text-red-500'>{formik.errors.content}</p>
        )}
        <input
          type='number'
          name='rating'
          placeholder='Rating (1-5)'
          className='mb-2 w-full rounded border p-2'
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.rating}
        />
        {formik.errors.rating && (
          <p className='text-sm text-red-500'>{formik.errors.rating}</p>
        )}
        <button
          type='submit'
          className='w-full rounded bg-blue-500 py-2 text-white'
        >
          Submit Review
        </button>
      </form>
    </div>
  )
}

export default function Review() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userId = 20 // Replace with actual logged-in user ID
        const response = await fetch(
            `http://localhost:8000/api/events/reviews?userId=${userId}`
        )
        const data = await response.json()
        console.log('Fetched data:', data)

        if (data) {
          setEvents(data.result)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleReviewSubmitted = (eventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    )
  }
  return (
    <div className='min-h-screen bg-gray-100 p-5'>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events available to review.</p>
      ) : (
        events.map((event) => (
          <ReviewForm
            key={event.id}
            event={event}
            eventReviewOnSubmitted={handleReviewSubmitted}
          />
        ))
      )}
    </div>
  )
}
