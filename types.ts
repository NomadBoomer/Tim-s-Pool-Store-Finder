export type SearchMode = 'device' | 'zip' | 'town';
export type OpenTimeFilter = 'all' | 'now' | 'weekend';

export interface LocationState {
  mode: SearchMode;
  zipCode: string;
  city: string;
  state: string;
  latitude?: number;
  longitude?: number;
}

export interface StoreResult {
  id: string;
  name: string;
  address: string;
  phone: string;
  reviewSummary: string;
  distance?: string;
  rating?: number | string; // Can be a number or "Not Available"
  mapUri?: string; // From grounding
  coordinates?: { lat: number; lng: number }; // Inferred or from grounding
}

export interface ServiceOption {
  id: string;
  label: string;
  icon: string;
  colorClass: string; // Tailwind class string for bg/text
}

export interface SearchResponse {
  stores: StoreResult[];
  center?: { lat: number; lng: number };
}