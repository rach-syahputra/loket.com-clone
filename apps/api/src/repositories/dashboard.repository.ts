import { MONTHS } from '../helpers/contants'
import { prisma } from '../helpers/prisma'
import { Statistic } from '../interfaces/statistic.interface'

class DashboardRepository {
  async getTotalActiveEvents(organizerId: number) {
    return await prisma.event.count({
      where: {
        organizerId: organizerId,
        eventEndDate: { lt: new Date() }
      }
    })
  }

  async getSalesStatistic(organizerId: number) {
    const transactions = await prisma.transactions.findMany({
      select: { totalPrice: true, createdAt: true },
      where: {
        event: {
          organizerId
        }
      }
    })

    const sales = transactions.reduce((acc, trx) => {
      const date = new Date(trx.createdAt)
      const year = date.getFullYear().toString()
      const month = date.toLocaleString('id-ID', { month: 'long' })

      // Find or create year group
      let yearGroup = acc.find((group) => group.year === year)
      if (!yearGroup) {
        yearGroup = {
          year,
          data: MONTHS.map((m) => ({ month: m, total: 0 })) // Pre-fill all months with 0
        }
        acc.push(yearGroup)
      }

      // Find the month and update total
      let monthData = yearGroup.data.find((item) => item.month === month)
      if (monthData) {
        monthData.total += trx.totalPrice
      }

      return acc
    }, [] as Statistic[])

    return sales
  }
}

export default new DashboardRepository()
