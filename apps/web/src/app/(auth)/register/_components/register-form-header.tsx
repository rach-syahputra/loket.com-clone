import Link from 'next/link'

import AuthFormHeader, {
  AuthFormHeaderDescription,
  AuthFormHeaderTitle
} from '../../_components/auth-form-header'

export default function RegisterFormHeader() {
  return (
    <AuthFormHeader>
      <AuthFormHeaderTitle>Buat akun Loket kamu</AuthFormHeaderTitle>
      <AuthFormHeaderDescription>
        Sudah punya akun?{' '}
        <Link href='/login' className='text-blue-primary font-semibold'>
          Masuk
        </Link>
      </AuthFormHeaderDescription>
    </AuthFormHeader>
  )
}
