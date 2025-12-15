import { ServiceOption } from './types';

export const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'chemicals', label: 'Pool Chemicals', icon: '🧪', colorClass: 'bg-green-600 hover:bg-green-700 text-white' },
  { id: 'testing', label: 'Water Testing', icon: '💧', colorClass: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { id: 'equipment', label: 'Pool Equipment', icon: '🛠️', colorClass: 'bg-pink-600 hover:bg-pink-700 text-white' },
  { id: 'repair', label: 'Equipment Repair', icon: '🔧', colorClass: 'bg-gray-800 hover:bg-gray-900 text-white' },
  { id: 'maintenance', label: 'Maintenance Plans', icon: '🗓️', colorClass: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' },
  { id: 'remodeling', label: 'Resurfacing & Tile', icon: '🧱', colorClass: 'bg-green-600 hover:bg-green-700 text-white' },
  { id: 'installation', label: 'Installation', icon: '⚙️', colorClass: 'bg-blue-600 hover:bg-blue-700 text-white' },
  { id: 'above-ground', label: 'Above Ground Pools', icon: '🏊', colorClass: 'bg-pink-600 hover:bg-pink-700 text-white' },
  { id: 'construction', label: 'Construction', icon: '🚧', colorClass: 'bg-gray-800 hover:bg-gray-900 text-white' },
  { id: 'spas', label: 'Hot Tubs & Spas', icon: '🛁', colorClass: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900' },
];

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

// Organized by State for filtered dropdowns
export const CITIES_BY_STATE: Record<string, string[]> = {
  "AZ": ["Chandler", "Gilbert", "Glendale", "Mesa", "Phoenix", "Scottsdale", "Tempe", "Tucson"],
  "CA": ["Anaheim", "Bakersfield", "Fresno", "Irvine", "Long Beach", "Los Angeles", "Oakland", "Riverside", "Sacramento", "San Diego", "San Francisco", "San Jose", "Santa Ana", "Stockton"],
  "CO": ["Aurora", "Colorado Springs", "Denver"],
  "FL": ["Hialeah", "Jacksonville", "Miami", "Orlando", "St. Petersburg", "Tampa"],
  "GA": ["Atlanta"],
  "IL": ["Chicago"],
  "IN": ["Fort Wayne", "Indianapolis"],
  "KY": ["Lexington", "Louisville"],
  "LA": ["Baton Rouge", "New Orleans"],
  "MA": ["Boston"],
  "MD": ["Baltimore"],
  "MI": ["Detroit"],
  "MN": ["Minneapolis", "St. Paul"],
  "MO": ["Kansas City", "St. Louis"],
  "NC": ["Charlotte", "Durham", "Greensboro", "Raleigh"],
  "NE": ["Lincoln", "Omaha"],
  "NJ": ["Jersey City", "Newark"],
  "NM": ["Albuquerque"],
  "NV": ["Henderson", "Las Vegas", "North Las Vegas", "Reno"],
  "NY": ["Buffalo", "New York City"],
  "OH": ["Cincinnati", "Cleveland", "Columbus", "Toledo"],
  "OK": ["Oklahoma City", "Tulsa"],
  "OR": ["Portland"],
  "PA": ["Philadelphia", "Pittsburgh"],
  "TN": ["Memphis", "Nashville"],
  "TX": ["Arlington", "Austin", "Corpus Christi", "Dallas", "El Paso", "Fort Worth", "Garland", "Houston", "Irving", "Laredo", "Lubbock", "Plano", "San Antonio"],
  "VA": ["Chesapeake", "Norfolk", "Virginia Beach"],
  "WA": ["Seattle", "Spokane"],
  "WI": ["Madison", "Milwaukee"],
  "DC": ["Washington"]
};
