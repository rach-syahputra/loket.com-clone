'use client'

import { formatNumber } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type AttendeeTable = {
  id: number
  nama: string
  jumlahTiket: number
  totalHarga: number
}

export const columns: ColumnDef<AttendeeTable>[] = [
  {
    accessorKey: 'nama',
    header: ({ column }) => {
      return <div className='md:w-[400px]'>Nama</div>
    },
    cell: ({ row }) => <div className='md:w-[400px]'>{row.original.nama}</div>
  },
  {
    accessorKey: 'jumlahTiket',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='text-start md:w-[140px]'
        >
          Jumlah Tiket
        </button>
      )
    },
    cell: ({ row }) => (
      <div className='md:w-[140px]'>{row.original.jumlahTiket}</div>
    )
  },
  {
    accessorKey: 'totalHarga',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='text-start md:w-[180px]'
        >
          Total Harga
        </button>
      )
    },
    cell: ({ row }) => (
      <div className='md:w-[180px]'>
        {formatNumber(row.original.totalHarga)}
      </div>
    )
  }
]
