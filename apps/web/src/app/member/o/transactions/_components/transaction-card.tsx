'use client'

import { useState } from 'react'
import Image from 'next/image'

import { cn, formatDate, formatNumber } from '@/lib/utils'
import {
  Transaction,
  TransactionStatus as TransactionStatusType
} from '@/lib/interfaces/transaction.interface'
import PaymentProofImageModal from './payment-proof-image-modal'
import Icon from '@/components/icon'
import { faMagnifyingGlassPlus } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/button'

type TransactionCardProps = {
  transaction: Transaction
}

type TransactionStatusProps = {
  status: TransactionStatusType
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <div className='shadow-default grid grid-cols-4 items-start justify-between gap-4 rounded-lg lg:flex-row'>
      <div className='col-span-1 flex flex-col gap-2 border-b border-r border-gray-300 px-5 py-4'>
        <span className='text-orange-primary text-xs font-medium'>
          ID TRANSAKSI :
        </span>
        <span className='text-dark-primary text-lg font-semibold'>
          {transaction.id}
        </span>
      </div>

      <div className='col-span-1 flex flex-col gap-2 border-b border-r border-gray-300 px-5 py-4'>
        <span className='text-orange-primary text-xs font-medium'>TOTAL :</span>
        <span className='text-dark-primary text-lg font-semibold'>
          Rp. {formatNumber(transaction.totalPrice)}
        </span>
      </div>

      <div className='col-span-2 flex flex-col gap-2 border-b border-r border-gray-300 px-5 py-4'>
        <span className='text-orange-primary text-xs font-medium'>
          STATUS TRANSAKSI :
        </span>
        <TransactionStatus status={transaction.transactionStatus} />
      </div>

      <PaymentProofImageModal
        image='https://assets.loket.com/neo/production/images/banner/20250110144523_6780d0137d5ff.jpg'
        isOpen={openModal}
        handleClose={() => setOpenModal(false)}
      />
    </div>
  )
}

function TransactionStatus({ status }: TransactionStatusProps) {
  const getTransactionStatusName = (status: TransactionStatusType) => {
    if (status === 'WAITING_FOR_PAYMENT') return 'Menunggu Pembayaran'
    if (status === 'WAITING_FOR_ADMIN_CONFIRMATION')
      return 'Menunggu Konfirmasi Admin'
  }

  return (
    <span
      className={cn('text-dark-primary text-lg font-semibold', {
        'text-orange-primary': status === 'WAITING_FOR_PAYMENT',
        'text-blue-primary': status === 'WAITING_FOR_ADMIN_CONFIRMATION'
      })}
    >
      {getTransactionStatusName(status)}
    </span>
  )
}
