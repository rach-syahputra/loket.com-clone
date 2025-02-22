import { prisma } from '../helpers/prisma'
import { voucher } from '../interfaces/voucher.interface'
import voucherRepository from '../repositories/voucher.repository'

class VoucherService {
  async createVoucher(voucherData: voucher) {
    const voucher = await voucherRepository.createVoucher(voucherData)

    return voucher
  }

  async getVoucherByEvent(eventId: number) {
    return await voucherRepository.getVoucherByEvent(eventId)
  }
}

export default new VoucherService()
