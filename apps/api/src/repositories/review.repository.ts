import { Review } from '@prisma/client'
import { prisma } from '../helpers/prisma'

class reviewRepository{
    async createReview(reviewData:Review){
        return await prisma.review.create({
            data:reviewData
        })
    }

    async getReviewByEventId(eventId:number){
        return await prisma.review.findFirst({
            where:{
                eventId:eventId
            },
            include:{
                event:true,
                user:true
            }
        })
    }

   
}

export default new reviewRepository()