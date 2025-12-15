import React, { useState } from 'react';
import { LocationState, StoreResult, OpenTimeFilter as OpenTimeFilterType } from './types';
import LocationSelector from './components/LocationSelector';
import FilterBar from './components/FilterBar';
import OpenTimeFilter from './components/OpenTimeFilter';
import StoreCard from './components/StoreCard';
import { searchPoolStores } from './services/geminiService';
import { Search, Map as MapIcon, Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [location, setLocation] = useState<LocationState>({
    mode: 'device',
    zipCode: '',
    city: '',
    state: ''
  });
  
  const [range, setRange] = useState<string>('5');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [openTime, setOpenTime] = useState<OpenTimeFilterType>('all');
  const [results, setResults] = useState<StoreResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleFilter = (id: string) => {
    if (id === 'all') {
      setSelectedFilters([]);
      return;
    }
    setSelectedFilters(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id) 
        : [...prev, id]
    );
  };

  const validateSearch = (): boolean => {
    if (location.mode === 'zip' && location.zipCode.length < 5) {
      setError("Please enter a valid 5-digit Zip Code.");
      return false;
    }
    if (location.mode === 'town' && (!location.city || !location.state)) {
      setError("Please select both a City and a State.");
      return false;
    }
    if (location.mode === 'device' && !location.latitude) {
      setError("Please enable location services or choose another method.");
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    setError(null);
    if (!validateSearch()) return;

    setLoading(true);
    setResults(null);

    try {
      const stores = await searchPoolStores(location, range, selectedFilters, openTime);
      setResults(stores);
      if (stores.length === 0) {
        setError(`No pool stores found within ${range} miles matching your criteria. Try adjusting the filters.`);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 font-sans">
      {/* Header */}
      <header className="bg-brand-contrast4 text-white p-6 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🏊</span>
            <h1 className="text-2xl font-bold tracking-tight">Tim's Pool Store Finder</h1>
          </div>
          <div className="hidden md:block text-sm text-brand-base1 font-medium">
            Locate top-rated pool stores & services
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Left Column: Consolidated Input Card */}
          <div className="lg:col-span-1">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-base2">
                <LocationSelector 
                  location={location} 
                  onLocationChange={setLocation} 
                  selectedRange={range}
                  onRangeChange={setRange}
                />
                
                <div className="my-6 border-t border-gray-100"></div>

                <OpenTimeFilter 
                  value={openTime}
                  onChange={setOpenTime}
                />
                
                <div className="my-6 border-t border-gray-100"></div>
                
                <FilterBar 
                  selectedFilters={selectedFilters} 
                  onToggleFilter={handleToggleFilter} 
                />
                
                <div className="mt-8">
                  <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full bg-brand-accent1 hover:bg-red-700 text-white text-lg font-bold py-4 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><Loader2 className="animate-spin" /> Searching...</>
                    ) : (
                      <><Search size={24} /> Find Stores</>
                    )}
                  </button>
                </div>
             </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2">
            {/* Initial State Placeholder */}
            {!results && !loading && !error && (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center h-full flex flex-col items-center justify-center text-gray-400">
                <MapIcon size={48} className="mb-4 text-gray-300" />
                <p className="text-lg">Enter your location details and click "Find Stores" to begin.</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-brand-accent1 p-4 mb-6 rounded-r-lg flex items-start">
                <AlertCircle className="text-brand-accent1 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-800">Search Alert</h4>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {results && results.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-2">
                  Top Results ({results.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {results.map((store) => (
                    <StoreCard key={store.id} store={store} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Interactive Map Area */}
        {results && results.length > 0 && (
          <section className="mt-12">
             <div className="bg-white p-4 rounded-xl shadow-lg border border-brand-base2">
               <h3 className="text-lg font-bold text-brand-contrast1 mb-4 flex items-center">
                 <MapIcon className="mr-2" /> Interactive Map View
               </h3>
               <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden relative">
                 <iframe
                    title="Google Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=pool+stores+near+${results[0].address}&output=embed`}
                    allowFullScreen
                  ></iframe>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg text-xs shadow-md max-w-xs">
                    <p className="font-bold text-brand-contrast4">Map Tips:</p>
                    <p>Explore the area around the top rated result. Click "Get Directions" on individual cards for specific directions.</p>
                  </div>
               </div>
             </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default App;