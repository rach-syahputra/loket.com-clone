import { fetchGetEventBySlug } from '@/lib/apis/organizer.api'
import { fetchGetCategories } from '@/lib/apis/category.api'
import { fetchGetProvinces } from '@/lib/apis/location.api'
import PageContent from './_components/page-content'

type EditEventPageProps = {
  params: Promise<{ slug: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const slug = (await params).slug
  const event = await fetchGetEventBySlug(slug)
  const categories = await fetchGetCategories()
  const provinces = await fetchGetProvinces()

  if (categories.data && provinces.data && event.data)
    return (
      <>
        <PageContent
          event={event.data.event}
          categories={categories.data}
          provinces={provinces.data}
        />
      </>
    )
}
