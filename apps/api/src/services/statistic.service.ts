import statisticRepository from '../repositories/statistic.repository'

class StatisticService {
  async getTotalActiveEvents(organizerId: number) {
    const totalActiveEvents =
      await statisticRepository.getTotalActiveEvents(organizerId)

    return {
      totalActiveEvents
    }
  }
  async getSalesStatistic(organizerId: number) {
    const sales = await statisticRepository.getSalesStatistic(organizerId)

    return {
      sales
    }
  }
}

export default new StatisticService()
