import Link from 'next/link'

import AuthFormHeader, {
  AuthFormHeaderDescription,
  AuthFormHeaderTitle
} from '../../_components/auth-form-header'

export default function LoginFormHeader() {
  return (
    <AuthFormHeader>
      <AuthFormHeaderTitle>Masuk ke akunmu</AuthFormHeaderTitle>
      <AuthFormHeaderDescription>
        Tidak punya akun Loket?{' '}
        <Link href='/register' className='text-blue-primary font-semibold'>
          Daftar
        </Link>
      </AuthFormHeaderDescription>
    </AuthFormHeader>
  )
}
