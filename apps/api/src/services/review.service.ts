
import { Review } from '@prisma/client'
import { prisma } from '../helpers/prisma'
import reviewRepository from '../repositories/review.repository'

class reviewService{
    async createReview(reviewData:Review){

        const {userId,eventId,content,rating} = reviewData
        return await reviewRepository.createReview(reviewData)
    }

}

export default new reviewService()
