import { Event } from '@/lib/interfaces/organizer.interface'
import { Category } from '@/lib/interfaces/category.interface'
import { Province } from '@/lib/interfaces/location.interface'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import UpdateEventForm from './update-event-form'

type PageContentProps = {
  event: Event
  categories: Category[]
  provinces: Province[]
}

export default function PageContent({
  event,
  categories,
  provinces
}: PageContentProps) {
  return (
    <DashboardContent>
      <UpdateEventForm
        event={event}
        categories={categories}
        provinces={provinces}
      />
    </DashboardContent>
  )
}
