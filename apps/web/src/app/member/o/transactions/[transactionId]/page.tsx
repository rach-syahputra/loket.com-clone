import { fetchGetTransactionById } from '@/lib/apis/transaction.api'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import PageContent from './_components/page-content'

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
      <PageContent transaction={transaction.data.transaction} />
    </>
  )
}
