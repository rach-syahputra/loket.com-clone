import cron from 'node-cron'

import { prisma } from './prisma'

export const couponExpirationScheduler = () => {
  cron.schedule(
    '0 0 * * *',
    async () => {
      await prisma.coupon.updateMany({
        where: {
          expiryDate: {
            lte: new Date() // in utc
          },
          status: 'ACTIVE'
        },
        data: {
          status: 'EXPIRED'
        }
      })
    },
    {
      timezone: 'Asia/Jakarta'
    }
  )
}
