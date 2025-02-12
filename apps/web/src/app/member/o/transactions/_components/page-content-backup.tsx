'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { TRANSACTION_STATUSES } from '@/lib/constants'
import { fetchGetTransactions } from '@/lib/apis/transaction.api'
import {
  Transaction,
  TransactionStatus
} from '@/lib/interfaces/transaction.interface'
import { OrderType } from '@/lib/interfaces/shared.interface'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import TransactionTabLink from './transaction-tab-link'
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
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import TransactionCard from './transaction-card'
import TransactionCardSkeleton from './transaction-card-skeleton'
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/pagination'

export default function PageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const currentPage = Number(searchParams.get('page')) || 1
  const order = searchParams.get('order') || 'desc'

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalDisplayedTransactions, setTotalDisplayedTransactions] =
    useState<number>(0)
  const [totalTransactions, setTotalTransactions] = useState<number>(0)

  const getTransactions = async () => {
    try {
      setIsLoading(true)

      const response = await fetchGetTransactions(
        getStatusNames(status!) as TransactionStatus[],
        currentPage,
        order as OrderType
      )

      if (response.success) {
        setTransactions(response.data.transactions)
        setTotalPages(response.data.pagination.totalPages)
        setTotalDisplayedTransactions(response.data.transactions.length)
        setTotalTransactions(response.data.totalTransactions)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusNames = (statusQuery: string) => {
    if (!statusQuery)
      return ['WAITING_FOR_PAYMENT', 'WAITING_FOR_ADMIN_CONFIRMATION']

    const statusIds = statusQuery.split(',').map(Number)

    // Check if every ID is within the valid range (1-6)
    const isValid = statusIds.every((id) =>
      TRANSACTION_STATUSES.some((status) => status.id === id)
    )

    if (!isValid)
      return ['WAITING_FOR_PAYMENT', 'WAITING_FOR_ADMIN_CONFIRMATION']

    return statusIds
      .map(
        (id) => TRANSACTION_STATUSES.find((status) => status.id === id)?.name
      )
      .filter(Boolean) as string[]
  }

  useEffect(() => {
    getTransactions()
  }, [status, currentPage, order, searchParams])

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <div className='grid min-h-[54px] grid-cols-2 border-b-[1.5px] border-gray-400 lg:grid-cols-3'>
          <TransactionTabLink
            href='/member/o/transactions'
            label='TRANSAKSI BERLANGSUNG'
            isActive
          />
          <TransactionTabLink
            href='/member/o/transactions/history'
            label='RIWAYAT TRANSAKSI'
          />
        </div>
        <div className='flex flex-col gap-5 py-5'>
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
          <div className='flex flex-col gap-6'>
            {isLoading ? (
              <>
                <TransactionCardSkeleton />
                <TransactionCardSkeleton />
                <TransactionCardSkeleton />
              </>
            ) : transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction} />
              ))
            ) : (
              <div className='flex h-full w-full flex-col items-center justify-center gap-4 p-16 lg:col-span-2 xl:col-span-3'>
                <Image
                  src='/icon-no-transactions.svg'
                  alt='No transactions icon'
                  width={94}
                  height={78}
                  className='w-[94px]'
                />
                <p className='text-gray-secondary text-center text-[19px]'>
                  Tidak ada transaksi
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Pagination className={`${totalPages === 1 && 'hidden'} place-self-end`}>
        <PaginationPrevious
          href={`/member/o/transactions?status=${status ? status : '1,2'}&page=${currentPage - 1}&order=${order}`}
          className={`${currentPage === 1 && 'hidden'}`}
        />
        {Array.from({ length: totalPages >= 5 ? 5 : totalPages }).map(
          (_, index) => {
            let startPage = 1

            if (
              totalPages > 5 &&
              currentPage > 2 &&
              currentPage < totalPages - 2
            ) {
              startPage = currentPage - 2 // Keep active page in the middle
            } else if (totalPages > 5 && currentPage >= totalPages - 2) {
              startPage = totalPages - 4 // Adjust for last pages
            }

            const page = startPage + index

            return (
              <PaginationItem key={index} isActive={currentPage === page}>
                <PaginationLink
                  href={`/member/o/transactions?status=${status}&page=${page}&order=${order}`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          }
        )}
        <PaginationNext
          href={`/member/o/transactions?status=${status ? status : '1,2'}&page=${currentPage + 1}&order=${order}`}
          className={`${currentPage === totalPages && 'hidden'}`}
        />
      </Pagination>
    </DashboardContent>
  )
}
