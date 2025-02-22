import { MONTHS } from '../helpers/contants'
import { prisma } from '../helpers/prisma'
import { Statistic } from '../interfaces/statistic.interface'

class DashboardRepository {
  async getDashboardSummary(organizerId: number) {
    const summary = await prisma.$transaction(async (trx) => {
      const totalActiveEvents = await prisma.event.count({
        where: {
          organizerId: organizerId,
          OR: [
            {
              registrationStartDate: { lte: new Date() },
              registrationEndDate: { gte: new Date() }
            },
            {
              eventStartDate: { lte: new Date() },
              eventEndDate: { gte: new Date() }
            }
          ]
        }
      })

      const totalPastEvents = await trx.event.count({
        where: {
          organizerId: organizerId,
          eventEndDate: { lt: new Date() }
        }
      })

      const totalTransactions = await trx.transactions.count({
        where: {
          event: {
            organizerId
          }
        }
      })

      const totalSoldTickets = await trx.transactions.count({
        where: {
          event: {
            organizerId
          },
          transactionStatus: 'DONE'
        }
      })

      const totalPrices = await trx.transactions.findMany({
        select: {
          totalPrice: true
        },
        where: {
          event: {
            organizerId
          },
          transactionStatus: 'DONE'
        }
      })

      const totalSales = totalPrices.reduce(
        (sum, transaction) => sum + transaction.totalPrice,
        0
      )

      return {
        totalPastEvents,
        totalActiveEvents,
        totalTransactions,
        totalSoldTickets,
        totalSales
      }
    })

    return summary
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
