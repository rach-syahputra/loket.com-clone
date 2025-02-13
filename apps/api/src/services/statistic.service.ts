import statisticRepository from '../repositories/statistic.repository'

class StatisticService {
  async getSalesStatistic(organizerId: number) {
    const sales = await statisticRepository.getSalesStatistic(organizerId)

    return {
      sales
    }
  }
}

export default new StatisticService()
