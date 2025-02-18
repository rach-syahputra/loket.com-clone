import jwt from 'jsonwebtoken'

import AuthChar from '@/app/(auth)/_components/auth-char'
import PasswordRecoveryForm from './_components/password-recovery-form'

type PasswordRecoveryPageProps = {
  params: Promise<{ token: string }>
}

interface User {
  email: string
}

export default async function PasswordRecoveryPage({
  params
}: PasswordRecoveryPageProps) {
  const token = (await params).token
  const user = jwt.decode(token) as User

  return (
    <div className='grid w-full gap-24 lg:grid-cols-2'>
      <AuthChar />
      <PasswordRecoveryForm email={user.email} />
    </div>
  )
}
