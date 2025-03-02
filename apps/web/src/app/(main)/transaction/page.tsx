import { Suspense } from 'react'

import Transaction from './_components/page-content'
import LoadingDots from '@/components/loading-dots'

export default function TransactionPage() {
  return (
    <Suspense fallback={ <div className='flex h-screen w-screen items-center justify-center'>
            <LoadingDots/>
          </div>}>
      <Transaction />
    </Suspense>
  )
}
