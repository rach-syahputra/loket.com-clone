import { fetchGetTransactionById } from '@/lib/apis/transaction.api'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import PageContent from './_components/page-content'

type TicketDetailPageProps = {
  params: Promise<{ transactionId: string }>
}

export default async function TicketDetailPage({
  params
}: TicketDetailPageProps) {
  const transactionId = (await params).transactionId
  const transaction = await fetchGetTransactionById(Number(transactionId))

  return (
    <>
      <DashboardHeader title='Tiket Saya' />
      <PageContent transaction={transaction.data.transaction} />
    </>
  )
}
