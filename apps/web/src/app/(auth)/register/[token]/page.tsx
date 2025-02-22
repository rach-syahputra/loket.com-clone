import AuthChar from '../../_components/auth-char'
import PageContent from './_components/page-content'

type RegisterPageProps = {
  params: Promise<{ token: string }>
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const token = (await params).token

  return (
    <div className='flex w-full items-center justify-center'>
      <AuthChar />
      <PageContent token={token} />
    </div>
  )
}
