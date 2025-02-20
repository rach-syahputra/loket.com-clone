import { Review } from '@prisma/client'
import { prisma } from '../helpers/prisma'

class reviewRepository{
    async createReview(userId: number, transactionId: number, eventId: number) {
        return await prisma.review.create({
          data: {
            userId,
            transactionId,
            eventId,
            status: 'DRAFT',    // Status set to DRAFT
            content: '',      // Content is null initially
            rating: 0,       // Rating is null initially
          },
        });
      }

    

   
}

export default new reviewRepository()