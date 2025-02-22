import AuthChar from '../_components/auth-char'
import RegisterForm from './_components/register-form'

export default function RegisterPage() {
  return (
    <div className='grid w-full gap-24 lg:grid-cols-2'>
      <AuthChar />
      <RegisterForm />
    </div>
  )
}
