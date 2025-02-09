import { Router } from 'express'
import reviewController from '../controllers/review.controller'

export const reviewRouter = () => {
    const router = Router()
    router.post("/review",reviewController.createReview)
    return router
}
