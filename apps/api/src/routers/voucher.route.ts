import { Router } from 'express'
import voucherController from '../controllers/voucher.controller'

export const voucherRouter=()=>{
    const router = Router()

    router.post('/voucher',voucherController.createVoucher)
    router.get("/voucher/:eventId",voucherController.getVoucherByEvent)
    return router
}
