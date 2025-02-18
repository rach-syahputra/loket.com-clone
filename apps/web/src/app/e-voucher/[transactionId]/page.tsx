import { fetchGetTransactionById } from '@/lib/apis/transaction.api'
import PageContent from './_components/page-content'

type EVoucherPageProps = {
  params: Promise<{ transactionId: string }>
}

export default async function EVoucherPage({ params }: EVoucherPageProps) {
  const transactionId = (await params).transactionId
  const transaction = await fetchGetTransactionById(Number(transactionId))

  return (
    <div className='min-w-screen min-h-screen bg-gray-100 md:py-4'>
      <PageContent transaction={transaction.data.transaction} />
    </div>
  )
}
