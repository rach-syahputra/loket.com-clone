export interface EventCreate {
    slug: string;
    title: string;
    description: string;
    bannerUrl: string;
    registrationStartDate: string | Date; // Accept both strings and Date objects
    registrationEndDate: string | Date;
    eventStartDate: string | Date;
    eventEndDate: string | Date;
    price: number;
    availableSeats: number;
    locationId: number;
    categoryId: number;
    ticketType: "FREE" | "PAID"; // Assuming TicketType is an enum with these values
    organizerId: number;
}