import { Router } from 'express'
import reviewController from '../controllers/review.controller'
import transactionController from '../controllers/transaction.controller'

export const reviewRouter = () => {
    const router = Router()
    router.post("/reviews",transactionController.getReviews)
    router.get("/reviews",transactionController.getReviews)
    router.post("/review/create",reviewController.createReview)
    return router
}

