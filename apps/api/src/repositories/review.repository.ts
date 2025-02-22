import { Review } from '@prisma/client'
import { prisma } from '../helpers/prisma'

class reviewRepository{
    async createReview(userId: number, transactionId: number, eventId: number) {
        return await prisma.review.create({
          data: {
            userId,
            transactionId,
            eventId,
            status: 'DRAFT',    
            content: '',     
            rating: 0,     
          },
        });
      }

    

   
}

export default new reviewRepository()