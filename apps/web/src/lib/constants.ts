export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string

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
    name: 'WAITING_FOR_PAYMENT',
    label: 'Menunggu Pembayaran'
  },
  {
    id: 2,
    name: 'WAITING_FOR_ADMIN_CONFIRMATION',
    label: 'Menunggu Konfirmasi Admin'
  },
  {
    id: 3,
    name: 'DONE',
    label: 'Selesai'
  },
  {
    id: 4,
    name: 'REJECTED',
    label: 'Tertolak'
  },
  {
    id: 5,
    name: 'EXPIRED',
    label: 'Kadaluarsa'
  },
  {
    id: 6,
    name: 'CANCELED',
    label: 'Dibatalkan'
  }
]
