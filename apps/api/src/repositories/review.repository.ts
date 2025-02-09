import { Review } from '@prisma/client'
import { prisma } from '../helpers/prisma'

class reviewRepository{
    async createReview(reviewData:Review){
        return await prisma.review.create({
            data:reviewData
        })
    }
}

export default new reviewRepository()