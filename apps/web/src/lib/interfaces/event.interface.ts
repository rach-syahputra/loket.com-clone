export interface Event {
  slug:string
  id: number
  title: string
  registrationStartDate: string | Date
  registrationEndDate: string | Date
  eventStartDate: string | Date
  eventEndDate: string | Date
  eventStartTime: string
  eventEndTime: string
  availableSeats:number
  price: number
  description: string
  bannerUrl: string
  location: {
    streetAddress: string
    city: string
  }
  organizerId: number
  organizer?: {
    pictureUrl: string
    name: string
  }
}