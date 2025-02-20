'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'
import LoadingDots from '@/components/loading-dots';
interface ReviewData {
  id: number; // Transaction ID
  totalPrice: number;
  event: {
    id: number;
    title: string;
    eventStartDate: string;
    eventEndDate: string;
    eventStartTime: string;
    eventEndTime: string;
  };
  review: {
    id: number;
    status: 'DRAFT' | 'SUBMITTED' | null;
    content: string | null;
    rating: number | null;
  } | null;
}

export default function Review() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession()
  const [id, setId] = useState(0)

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user?.id) return; // ✅ Ensure session and userId are available

      try {
        const response = await fetch('http://localhost:8000/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (!response.ok) throw new Error('Failed to fetch reviews.');

        const data = await response.json();
        setReviews(data.result);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews(); // ✅ Call fetchReviews only after session is ready
  }, [session]); // ✅ Depend on session to wait for it to be fetched

  // ... Rest o


  const handleSubmit = async (reviewId: number) => {
    try {
      const response = await fetch(`/api/reviews/submit/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: reviewContent,
          rating: selectedRating,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review.');

      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white w-full min-h-screen flex justify-center items-center">
        <LoadingDots/>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white w-full min-h-screen flex justify-center items-center">
        <span>No reviews to fill out at the moment.</span>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen flex flex-col items-center md:p-5 ">
      {reviews.map((reviewData) => (
        <div
          key={reviewData.id}
          className="bg-white md:w-[1170px] w-[374px] h-auto border rounded-lg flex flex-col mb-8"
        >
          <div className="p-4 bg-white flex justify-between text-black">
            <span>RM {reviewData.totalPrice}</span>
          </div>

          <div className="bg-[#F2F3F3] p-4 text-black">
            <span>{reviewData.event.title}</span>
          </div>

          <div className="flex flex-col gap-4 p-4">
            <div className="bg-[#152955] p-2 rounded-full w-[170px] flex justify-center items-center text-white font-semibold">
              <span>Acara Selesai</span>
            </div>

            <div className="rating flex z-30">
              {[1, 2, 3, 4, 5].map((ratingValue) => (
                <input
                  key={ratingValue}
                  type="radio"
                  name={`rating-${reviewData.id}`}
                  className="mask mask-star-2 bg-orange-400"
                  checked={selectedRating === ratingValue}
                  onChange={() => setSelectedRating(ratingValue)}
                />
              ))}
            </div>

            <textarea
              className="h-[170px] text-black p-2 border rounded z-30"
              placeholder="Write your review here..."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            />

            <button
              onClick={() => handleSubmit(reviewData.review?.id ?? 0)}
              className="bg-[#152955] text-white p-2 rounded-lg w-full hover:bg-green-700"
            >
              Kirim Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
