'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { useNavigationContenxt } from '@/context/navigation-context'
import { useTransactionContext } from '@/context/transaction-context'
import {
  DashboardContent,
  DashboardContentHeader
} from '@/components/dashboard/dashboard-content'
import { DataTable } from '@/components/table/data-table'
import Pagination from '@/components/pagination'
import LoadingDots from '@/components/loading-dots'
import { columns } from './table/column'
import OrderSelect from './order-select'
import StatusDropdown from './status-dropdown'

export default function PageContent() {
  const { activeMenu } = useNavigationContenxt()
  const {
    isLoading,
    transactions,
    totalTransactions,
    totalPages,
    totalDisplayedTransactions
  } = useTransactionContext()
  const router = useRouter()

  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const page = searchParams.get('page') || 1
  const order = searchParams.get('order') || 'desc'

  const handlePageChange = (page: number) => {
    const urlParams = new URLSearchParams()

    if (status) urlParams.append('status', status)
    urlParams.append('page', page.toString())
    if (order) urlParams.append('order', order)

    router.push(`/member/o/transactions?${urlParams.toString()}`)
  }

  const searchableColumns = [
    {
      id: 'emailCustomer',
      label: 'Email Customer'
    },
    {
      id: 'namaEvent',
      label: 'Nama Event'
    },
    {
      id: 'statusTransaksi',
      label: 'Status Transaksi'
    }
  ]

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <DashboardContentHeader>{activeMenu}</DashboardContentHeader>

        <div className='h-[1.5px] w-full bg-gray-200'></div>

        <div className='flex w-full items-start justify-end gap-4 md:justify-between lg:items-center'>
          <div className='text-gray-secondary text-sm max-md:hidden'>
            Menampilkan{' '}
            <span className='text-dark-primary font-semibold'>
              {totalDisplayedTransactions}
            </span>{' '}
            dari total{' '}
            <span className='text-dark-primary font-semibold'>
              {totalTransactions}
            </span>{' '}
            transaksi
          </div>
          <div className='flex flex-col items-end justify-end gap-6 lg:flex-row lg:items-center lg:justify-center'>
            <StatusDropdown />
            <OrderSelect />
          </div>
        </div>

        <div className='py-6'>
          {isLoading ? (
            <div className='mt-20 flex min-h-[100px] w-full items-center justify-center'>
              <LoadingDots />
            </div>
          ) : transactions.length > 0 ? (
            <DataTable
              columns={columns}
              searchableColumns={searchableColumns}
              data={transactions}
            />
          ) : (
            <span className='text-lg'>Tidak ada transaksi</span>
          )}
        </div>

        {transactions.length > 0 && !isLoading && (
          <Pagination
            page={Number(page)}
            onPageChange={handlePageChange}
            totalPages={totalPages}
            className='place-self-end'
          />
        )}
      </div>
    </DashboardContent>
  )
}
