import dashboardRepository from '../repositories/dashboard.repository'

class StatisticService {
  async getTotalActiveEvents(organizerId: number) {
    const totalActiveEvents =
      await dashboardRepository.getTotalActiveEvents(organizerId)

    return {
      totalActiveEvents
    }
  }
  async getSalesStatistic(organizerId: number) {
    const sales = await dashboardRepository.getSalesStatistic(organizerId)

    return {
      sales
    }
  }
}

export default new StatisticService()
