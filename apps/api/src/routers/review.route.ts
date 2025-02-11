import { Router } from 'express'
import reviewController from '../controllers/review.controller'

export const reviewRouter = () => {
    const router = Router()
    router.post("/review",reviewController.createReview)
    router.get('/events/:eventId/reviews', reviewController.getReviewsByEventId);
    return router
}
