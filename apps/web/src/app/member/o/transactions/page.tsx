import DashboardHeader from '@/components/dashboard/dashboard-header'
import PageContent from './_components/page-content'

import { TransactionProvider } from '@/context/transaction-context'

export default function TransactionsPage() {
  return (
    <>
      <DashboardHeader title='Transaksi' />
      <TransactionProvider>
        <PageContent />
      </TransactionProvider>
    </>
  )
}
