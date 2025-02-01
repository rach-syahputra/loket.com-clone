export interface Event {
    registration_start_date: Date;
    registration_end_date: Date;
    event_start_date: Date;
    event_end_date: Date;
    price: number;
    available_seats: number;
    location_id: number;
    category_id: number;
    ticket_type: string;
    organizer_id: number;
    created_at?: Date;
    updated_at?: Date;

}