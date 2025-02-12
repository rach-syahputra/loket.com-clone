export const BASE_URL = 'http://localhost:8000/api'

export const HOURS = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23'
]

export const MINUTES = [
  '00',
  '05',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '45',
  '50',
  '55'
]

export const TRANSACTION_STATUSES = [
  {
    id: 1,
    name: 'WAITING_FOR_PAYMENT'
  },
  {
    id: 2,
    name: 'WAITING_FOR_ADMIN_CONFIRMATION'
  },
  {
    id: 3,
    name: 'DONE'
  },
  {
    id: 4,
    name: 'REJECTED'
  },
  {
    id: 5,
    name: 'EXPIRED'
  },
  {
    id: 6,
    name: 'CANCELED'
  }
]
