'use client'

import { formatNumber } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TransactionTable = {
  id: number
  emailPembeli: string
  buktiPembayaran: string
  totalHarga: number
  statusTransaksi: string
  namaEvent: string
}

export const columns: ColumnDef<TransactionTable>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <div className='md:w-[400px]'>ID Transaksi</div>
    },
    cell: ({ row }) => <div className='md:w-[400px]'>{row.original.id}</div>
  },
  {
    accessorKey: 'emailPembeli',
    header: ({ column }) => {
      return <div className='md:w-[400px]'>Email Pembeli</div>
    },
    cell: ({ row }) => (
      <div className='md:w-[400px]'>{row.original.emailPembeli}</div>
    )
  },
  {
    accessorKey: 'namaEvent',
    header: ({ column }) => {
      return <div className='md:w-[400px]'>Nama Event</div>
    },
    cell: ({ row }) => (
      <div className='md:w-[400px]'>{row.original.namaEvent}</div>
    )
  },
  {
    accessorKey: 'buktiPembayaran',
    header: ({ column }) => {
      return <div className='md:w-[400px]'>Bukti Pembayaran</div>
    },
    cell: ({ row }) => <div className='md:w-[400px]'>Bukti Pembayaran</div>
  },
  {
    accessorKey: 'totalHarga',
    header: ({ column }) => {
      return <div className='md:w-[180px]'>Total Harga</div>
    },
    cell: ({ row }) => (
      <div className='md:w-[180px]'>
        {formatNumber(row.original.totalHarga)}
      </div>
    )
  },
  {
    accessorKey: 'statusTransaksi',
    header: ({ column }) => {
      return <div className='md:w-[400px]'>Status Transaksi</div>
    },
    cell: ({ row }) => (
      <div className='md:w-[400px]'>{row.original.statusTransaksi}</div>
    )
  }
]
