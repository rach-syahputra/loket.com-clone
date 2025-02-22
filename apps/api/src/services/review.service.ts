
import { Review } from '@prisma/client'
import reviewRepository from '../repositories/review.repository'

class reviewService{
    async createReview(userId:number,transactionId:number,eventId:number){
        return await reviewRepository.createReview(userId,transactionId,eventId)
       
    }

    
   

}

export default new reviewService()
