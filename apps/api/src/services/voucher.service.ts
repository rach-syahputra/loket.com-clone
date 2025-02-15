import { prisma } from "../helpers/prisma"
import { voucher } from "../interfaces/voucer.interface";
import voucherRepository from "../repositories/voucher.repository";

class VoucherService{
    async createVoucher(voucherData:voucher){
        const voucher = await voucherRepository.createVoucher(voucherData)

        return voucher
    }
}

export default new VoucherService()