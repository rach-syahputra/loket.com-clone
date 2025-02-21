import { TicketType } from "./transaction.interface"

export interface CardExploreProps {
  selectedProvinceId: number  | null
  selectedCategoryId: number   | null
  selectedTicketType: TicketType | null
}

export interface CardExploreComponentProps {
    selectedProvinceId: string  | null
    selectedCategoryId: string   | null
    selectedTicketType: TicketType | null
  }
