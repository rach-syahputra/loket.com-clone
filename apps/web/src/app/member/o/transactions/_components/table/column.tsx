'use client'

import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { TRANSACTION_STATUSES } from '@/lib/constants'
import { cn, formatDate, formatNumber } from '@/lib/utils'
import { TransactionStatus } from '@/lib/interfaces/transaction.interface'
import { fetchUpdateTransaction } from '@/lib/apis/transaction.api'
import { useTransactionContext } from '@/context/transaction-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/shadcn-ui/dropdown-menu'
import PaymentProofImageModal from '../payment-proof-image-modal'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TransactionTable = {
  id: number
  namaEvent: string
  emailCustomer: string
  buktiPembayaran: string
  totalHarga: number
  statusTransaksi: TransactionStatus
  tanggalDibuat: string
}

export const columns: ColumnDef<TransactionTable>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return <div className='w-[100px]'>ID Transaksi</div>
    },
    cell: ({ row }) => <div className='w-[100px]'>{row.original.id}</div>
  },
  {
    accessorKey: 'emailCustomer',
    header: ({ column }) => {
      return <div className='w-[240px]'>Email Customer</div>
    },
    cell: ({ row }) => (
      <div className='w-[240px]'>{row.original.emailCustomer}</div>
    )
  },
  {
    accessorKey: 'namaEvent',
    header: ({ column }) => {
      return <div className='w-[400px]'>Nama Event</div>
    },
    cell: ({ row }) => <div className='w-[400px]'>{row.original.namaEvent}</div>
  },
  {
    accessorKey: 'buktiPembayaran',
    header: ({ column }) => {
      return <div className='w-[200px]'>Bukti Pembayaran</div>
    },
    cell: ({ row }) => {
      const [openModal, setOpenModal] = useState<boolean>(false)

      return (
        <div className='w-[180px]'>
          {row.original.buktiPembayaran ? (
            <button
              type='button'
              onClick={() => {
                if (row.original.buktiPembayaran) setOpenModal(true)
              }}
              className='font-medium text-blue-500 underline'
            >
              Lihat
            </button>
          ) : (
            <button type='button'>Belum ada</button>
          )}

          {openModal && (
            <PaymentProofImageModal
              isOpen={openModal}
              handleClose={() => setOpenModal(false)}
              image={row.original.buktiPembayaran}
            />
          )}
        </div>
      )
    }
  },

  {
    accessorKey: 'totalHarga',
    header: ({ column }) => {
      return <div className='w-[150px]'>Total Harga</div>
    },
    cell: ({ row }) => (
      <div className='w-[150px]'>{formatNumber(row.original.totalHarga)}</div>
    )
  },
  {
    accessorKey: 'statusTransaksi',
    header: ({ column }) => {
      return <div className='w-[220px]'>Status Transaksi</div>
    },
    cell: ({ row }) => {
      const statusTransaksi = row.original.statusTransaksi

      return (
        <div className='w-[220px]'>
          <span
            className={cn('rounded-md px-3 py-1', {
              'bg-red-200 text-red-500':
                statusTransaksi === 'REJECTED' ||
                statusTransaksi === 'CANCELED' ||
                statusTransaksi === 'EXPIRED',
              'bg-orange-200 text-orange-500':
                statusTransaksi === 'WAITING_FOR_PAYMENT',
              'bg-blue-200 text-blue-500':
                statusTransaksi === 'WAITING_FOR_ADMIN_CONFIRMATION',
              'bg-green-200 text-green-500': statusTransaksi === 'DONE'
            })}
          >
            {
              TRANSACTION_STATUSES.find(
                (transactionStatus) =>
                  transactionStatus.name === statusTransaksi
              )?.label
            }
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: 'tanggalDibuat',
    header: ({ column }) => {
      return <div className='w-[200px]'>Tanggal Dibuat</div>
    },
    cell: ({ row }) => (
      <div className='w-[200px]'>
        {formatDate(new Date(row.original.tanggalDibuat), {
          includeTime: true,
          includeSecond: true
        })}
      </div>
    )
  },
  {
    id: 'aksi',
    header: ({ column }) => {
      return <div className='w-[50px]'>Aksi</div>
    },
    cell: ({ row }) => {
      const { getTransactions } = useTransactionContext()

      const handleUpdateTransaction = async (
        transactionId: number,
        status: TransactionStatus
      ) => {
        const formData = new FormData()

        if (status) {
          formData.append('transactionStatus', status)
          const response = await fetchUpdateTransaction(transactionId, formData)

          if (response.success) {
            getTransactions()
          }
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='h-8 w-8 p-0 focus-within:outline-none'>
              <span className='sr-only'>Buka Aksi</span>
              <MoreHorizontal className='h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleUpdateTransaction(row.original.id, 'DONE')}
              disabled={
                !['WAITING_FOR_ADMIN_CONFIRMATION'].includes(
                  row.original.statusTransaksi
                )
              }
              className='text-success cursor-pointer py-2'
            >
              Konfirmasi Pembayaran
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleUpdateTransaction(row.original.id, 'REJECTED')
              }
              disabled={
                !['WAITING_FOR_ADMIN_CONFIRMATION'].includes(
                  row.original.statusTransaksi
                )
              }
              className='text-destructive cursor-pointer py-2'
            >
              Tolak Pembayaran
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]
