import { Router } from 'express'
import voucherController from '../controllers/voucher.controller'

export const voucherRouter=()=>{
    const router = Router()

    router.post('/voucher',voucherController.createVoucher)
    return router
}
