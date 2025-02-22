export interface ReviewData {
  id: number
  totalPrice: number
  event: {
    id: number
    title: string
    eventStartDate: string
    eventEndDate: string
    eventStartTime: string
    eventEndTime: string
  }
  review: {
    id: number
    status: 'DRAFT' | 'SUBMITTED' | null
    content: string | null
    rating: number | null
  } | null
}
