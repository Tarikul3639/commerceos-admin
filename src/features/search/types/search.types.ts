export interface SearchResult {
  id: string
  title: string
  category: string
  description: string
  href: string
  imageUrl?: string | null
}

export interface SearchResponse {
  data: SearchResult[]
}
