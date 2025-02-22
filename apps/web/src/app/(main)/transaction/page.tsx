import { Suspense } from 'react'

import Transaction from './_components/page-content'

export default function TransactionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Transaction />
    </Suspense>
  )
}
