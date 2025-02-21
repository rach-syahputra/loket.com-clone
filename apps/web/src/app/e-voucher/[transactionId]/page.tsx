import { Metadata } from 'next'

import { fetchGetEVoucher } from '@/lib/apis/user.api'
import PageContent from './_components/page-content'

export const metadata: Metadata = {
  title: 'E-Voucher - LOKET',
  description: 'E-Voucher - LOKET'
}

type EVoucherPageProps = {
  params: Promise<{ transactionId: string }>
}

export default async function EVoucherPage({ params }: EVoucherPageProps) {
  const transactionId = (await params).transactionId
  const transaction = await fetchGetEVoucher(Number(transactionId))

  return (
    <div className='min-w-screen min-h-screen bg-gray-100 md:py-4'>
      <PageContent transaction={transaction.data.eVoucher} />
    </div>
  )
}
