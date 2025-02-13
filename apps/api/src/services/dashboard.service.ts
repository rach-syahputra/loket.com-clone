import dashboardRepository from '../repositories/dashboard.repository'

class StatisticService {
  async getDashboardSummary(organizerId: number) {
    const summary = await dashboardRepository.getDashboardSummary(organizerId)

    return {
      summary
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
