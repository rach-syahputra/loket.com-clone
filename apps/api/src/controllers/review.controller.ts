import { Request, Response, NextFunction } from 'express'
import reviewService from '../services/review.service'

class reviewController{
    async createReview(req: Request, res: Response, next: NextFunction){
        try {
            const { userId, transactionId, eventId } = req.body;
            const result = await reviewService.createReview(userId, transactionId, Number(eventId));
            
            res.status(200).send({
                message:"Review created successfully",
                result
            })
        } catch (error) {
            next(error)
        }
    }

    
  
}

export default new reviewController()