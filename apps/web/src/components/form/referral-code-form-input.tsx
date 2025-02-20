'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { FormControl, FormItem, FormLabel } from '@/components/shadcn-ui/form'

type ReferralCodeFormInputProps = {
  value: string
}

export function ReferralCodeFormInput({ value }: ReferralCodeFormInputProps) {
  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
  }

  return (
    <FormItem className='space-y-1'>
      <FormLabel className='text-gray-secondary'>Kode Referral</FormLabel>
      <FormControl>
        <div className='flex h-10 w-fit items-center justify-between gap-4 rounded-md border border-gray-400 px-2'>
          <p className='text-gray-primary'>{value}</p>
          {copied ? (
            <Check className='text-gray-primary w-4 cursor-pointer' />
          ) : (
            <Copy
              onClick={handleCopy}
              className='text-gray-primary w-4 cursor-pointer'
            />
          )}
        </div>
      </FormControl>
    </FormItem>
  )
}
