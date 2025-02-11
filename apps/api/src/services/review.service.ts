
import { Review } from '@prisma/client'
import reviewRepository from '../repositories/review.repository'

class reviewService{
    async createReview(reviewData:Review){

        const {userId,eventId,content,rating} = reviewData
        return await reviewRepository.createReview(reviewData)
    }

    async getReviewByEventId(eventId:number){
        return await reviewRepository.getReviewByEventId(eventId)
    }

   

}

export default new reviewService()
