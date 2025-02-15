import { Request, Response, NextFunction } from 'express'
import voucherService from '../services/voucher.service'

class VoucherController {
    async createVoucher(req:Request,res:Response,next:NextFunction){
        try {
            const {title,eventId,discountAmount,startDate,endDate} = req.body

            const voucherData ={
                title: String(title), 
                eventId: Number(eventId),
                discountAmount: Number(discountAmount), 
                startDate: new Date(startDate),
                endDate: new Date(endDate) 
            }
            const result = await voucherService.createVoucher(voucherData)
            
            res.status(200).send({
                message:"Voucher created successfully",
                result
            })
            
        } catch (error) {
            next(error)
        }

    }

    async getVoucherByEvent(req:Request,res:Response,next:NextFunction){
       try {
        const {eventId} = req.params

        const result = await voucherService.getVoucherByEvent(Number(eventId))

        res.status(200).send({
            message:"Voucher by event fetched successfully",
            result
        })
       } catch (error) {
         next(error)
       }

    }
}

export default new VoucherController()