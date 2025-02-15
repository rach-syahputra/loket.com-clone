import { prisma } from '../helpers/prisma'
import { voucher } from '../interfaces/voucer.interface';

class VoucherRepository{
    async createVoucher(voucherData: voucher){
        return await prisma.voucher.create({
            data:voucherData
        })  
    }

    async getVoucherByEvent(eventId:number){
        return await prisma.voucher.findMany({
            where:{
                eventId
            }
        })
    }
}

export default new VoucherRepository()