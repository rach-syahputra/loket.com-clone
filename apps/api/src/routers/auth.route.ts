import express from 'express'

import authController from '../controllers/auth.controller'

const router = express.Router()

router.post('/new', authController.register)
router.post('/', authController.login)

export default router
