import DashboardHeader from '@/components/dashboard/dashboard-header'
import PageContent from './_components/page-content'

import { TransactionProvider } from '@/context/transaction-context'
import { fetchGetTransactionById } from '@/lib/apis/transaction.api'

type TransactionDetailPageProps = {
  params: Promise<{ transactionId: string }>
}

export default async function TransactionDetailPage({
  params
}: TransactionDetailPageProps) {
  const transactionId = (await params).transactionId
  const transaction = await fetchGetTransactionById(Number(transactionId))

  return (
    <>
      <DashboardHeader title='Transaksi' />
      <TransactionProvider>
        <PageContent transaction={transaction.data.transaction} />
      </TransactionProvider>
    </>
  )
}
