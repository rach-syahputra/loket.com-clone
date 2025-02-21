import { fetchGetEVoucher } from '@/lib/apis/user.api'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import PageContent from './_components/page-content'

type TicketDetailPageProps = {
  params: Promise<{ ticketId: string }>
}

export default async function TicketDetailPage({
  params
}: TicketDetailPageProps) {
  const ticketId = (await params).ticketId
  const ticket = await fetchGetEVoucher(Number(ticketId))

  return (
    <>
      <DashboardHeader title='Tiket Saya' />
      <PageContent ticket={ticket.data.eVoucher} />
    </>
  )
}
