'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'

import { TRANSACTION_STATUSES } from '@/lib/constants'
import { fetchGetTransactions } from '@/lib/apis/transaction.api'
import { OrderType } from '@/lib/interfaces/shared.interface'
import { TransactionStatus } from '@/lib/interfaces/transaction.interface'
import { TransactionTable } from '@/app/member/o/transactions/_components/table/column'

interface ITransactionContext {
  isLoading: boolean
  transactions: TransactionTable[]
  setTransactions: Dispatch<SetStateAction<TransactionTable[]>>
  totalPages: number
  totalTransactions: number
  totalDisplayedTransactions: number
  getTransactions: () => void
}

const TransactionContext = createContext<ITransactionContext | undefined>(
  undefined
)

const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const status = searchParams.get('status') || '2'
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

      if (response.success) {
        setTransactions(
          response.data.transactions.map((transaction) => ({
            id: transaction.id,
            emailCustomer: transaction.user.email,
            namaEvent: transaction.event.title,
            buktiPembayaran: transaction.paymentProofImage,
            totalHarga: transaction.totalPrice,
            statusTransaksi: transaction.transactionStatus,
            tanggalDibuat: transaction.createdAt
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
    if (!statusQuery) return ['WAITING_FOR_ADMIN_CONFIRMATION']

    const statusIds = decodeURIComponent(statusQuery).split(',').map(Number)

    // Check if every ID is within the valid range (1-6)
    const isValid = statusIds.every((id) =>
      TRANSACTION_STATUSES.some((status) => status.id === id)
    )

    if (!isValid) return ['WAITING_FOR_ADMIN_CONFIRMATION']

    return statusIds
      .map(
        (id) => TRANSACTION_STATUSES.find((status) => status.id === id)?.name
      )
      .filter(Boolean) as string[]
  }

  useEffect(() => {
    getTransactions()
  }, [status, page, order, searchParams])

  return (
    <TransactionContext.Provider
      value={{
        isLoading,
        transactions,
        setTransactions,
        totalPages,
        totalTransactions,
        totalDisplayedTransactions,
        getTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

const useTransactionContext = (): ITransactionContext => {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error(
      'useTransactionContext must be used within a TransactionProvider'
    )
  }
  return context
}

export { TransactionProvider, useTransactionContext }
