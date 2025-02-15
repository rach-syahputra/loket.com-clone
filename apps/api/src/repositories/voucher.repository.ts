import { prisma } from '../helpers/prisma'
import { voucher } from '../interfaces/voucer.interface';

class VoucherRepository{
    async createVoucher(voucherData: voucher){
        return await prisma.voucher.create({
            data:voucherData
        })  
    }
}

export default new VoucherRepository()