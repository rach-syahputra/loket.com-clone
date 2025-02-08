import { fetchGetCategories } from '@/lib/apis/category.api'
import { fetchGetProvinces } from '@/lib/apis/location.api'
import UpdateEventForm from './_components/update-event-form'

type EditEventPageProps = {
  params: Promise<{ slug: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const slug = (await params).slug
  const categories = (await fetchGetCategories()).data
  const provinces = (await fetchGetProvinces()).data

  const event = {
    id: 18,
    slug: 'anime-art-fest-2025-1738740819066',
    title: 'Anime Art Fest 2025',
    description:
      'A grand festival celebrating anime cultur , cosplay, and J-pop music.',
    bannerUrl:
      'https://res.cloudinary.com/dlicymktd/image/upload/v1738740817/loket-event-banners/dnofgg88mnrcthwbnihy.jpg',
    registrationStartDate: new Date('2025-01-31T09:00:00.000Z'),
    registrationEndDate: new Date('2025-02-05T23:59:59.999Z'),
    eventStartDate: new Date('2025-03-15T08:00:00.000Z'),
    eventEndDate: new Date('2025-03-30T08:00:00.000Z'),
    location: {
      id: 25,
      address: 'Jl. Jendral Gatot Subtoro, Gedung DPR',
      city: 'Berau',
      province: {
        id: 22,
        name: 'Kalimantan Timur'
      }
    },
    categoryId: 3,
    availableSeats: 10,
    price: 0,
    ticketType: 'FREE' as 'FREE' | 'PAID',
    organizerId: 10
  }

  if (categories && provinces && event)
    return (
      <>
        <UpdateEventForm
          event={event}
          categories={categories}
          provinces={provinces}
        />
      </>
    )
}
