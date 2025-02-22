export interface Location {
  streetAddress: string
  city: string
  provinceId: number
  createdAt: Date
}

export interface LocationUpdateRequest {
  id: number
  streetAddress?: string
  city?: string
  provinceId?: number
}
