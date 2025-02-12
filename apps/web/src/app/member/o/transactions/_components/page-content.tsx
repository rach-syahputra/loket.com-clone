'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import { useNavigationContenxt } from '@/context/navigation-context'
import { TRANSACTION_STATUSES } from '@/lib/constants'
import { fetchGetTransactions } from '@/lib/apis/transaction.api'
import { OrderType } from '@/lib/interfaces/shared.interface'
import { TransactionStatus } from '@/lib/interfaces/transaction.interface'
import {
  DashboardContent,
  DashboardContentHeader
} from '@/components/dashboard/dashboard-content'
import { DataTable } from '@/components/table/data-table'
import Pagination from '@/components/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn-ui/select'
import Icon from '@/components/icon'
import LoadingDots from '@/components/loading-dots'
import { columns, TransactionTable } from './table/column'

export default function PageContent() {
  const { activeMenu } = useNavigationContenxt()
  const router = useRouter()

  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const page = searchParams.get('page') || 1
  const order = searchParams.get('order') || 'desc'

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [transactions, setTransactions] = useState<TransactionTable[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalTransactions, setTotalTransactions] = useState<number>(0)
  const [totalDisplayedTransactions, setTotalDisplayedTransactions] =
    useState<number>(0)

  const getTransactions = async () => {
    try {
      setIsLoading(true)

      const response = await fetchGetTransactions(
        getStatusNames(status!) as TransactionStatus[],
        Number(page),
        order as OrderType
      )

      console.log(response)

      if (response.success) {
        setTransactions(
          response.data.transactions.map((transaction) => ({
            id: transaction.id,
            emailPembeli: transaction.user.email,
            namaEvent: transaction.event.title,
            buktiPembayaran: transaction.paymentProofImage,
            totalHarga: transaction.totalPrice,
            statusTransaksi: transaction.transactionStatus
          }))
        )
        setTotalPages(response.data.pagination.totalPages)
        setTotalTransactions(response.data.totalTransactions)
        setTotalDisplayedTransactions(response.data.transactions.length)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusNames = (statusQuery: string) => {
    if (!statusQuery) return []

    const statusIds = decodeURIComponent(statusQuery).split(',').map(Number)

    // Check if every ID is within the valid range (1-6)
    const isValid = statusIds.every((id) =>
      TRANSACTION_STATUSES.some((status) => status.id === id)
    )

    if (!isValid) return []

    return statusIds
      .map(
        (id) => TRANSACTION_STATUSES.find((status) => status.id === id)?.name
      )
      .filter(Boolean) as string[]
  }

  const handlePageChange = (page: number) => {
    const urlParams = new URLSearchParams()

    if (status) urlParams.append('status', status)
    urlParams.append('page', page.toString())
    if (order) urlParams.append('order', order)

    router.push(`/member/o/transactions?${urlParams.toString()}`)
  }

  useEffect(() => {
    getTransactions()
  }, [status, page, order, searchParams])

  const searchableColumns = [
    {
      id: 'emailPembeli',
      label: 'Email Pembeli'
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

        <div className='flex w-full items-start justify-between gap-4 lg:items-center'>
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
          <div className='flex items-center justify-center gap-2 md:flex-col md:items-end lg:flex-row lg:items-center'>
            <span className='text-gray-secondary text-sm font-semibold'>
              Urutkan:
            </span>
            <Select
              defaultValue={order || 'desc'}
              onValueChange={(value) => {
                const urlParams = new URLSearchParams()

                if (status) urlParams.append('status', status)
                if (page) urlParams.append('page', page.toString())
                urlParams.append('order', value)
                router.push(`/member/o/transactions?${urlParams.toString()}`)
              }}
            >
              <SelectTrigger className='text-gray-secondary w-[220px]'>
                <SelectValue />
                <Icon icon={faChevronDown} className='w-3' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Urutan Transaksi</SelectLabel>
                  <SelectItem value='desc'>Terbaru</SelectItem>
                  <SelectItem value='asc'>Terlama</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
