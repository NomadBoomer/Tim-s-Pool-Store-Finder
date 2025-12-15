import React, { useState, useEffect, useMemo } from 'react';
import { LocationState, SearchMode } from '../types';
import { US_STATES, CITIES_BY_STATE } from '../constants';
import { MapPin, Navigation, Building } from 'lucide-react';

interface LocationSelectorProps {
  location: LocationState;
  onLocationChange: (loc: LocationState) => void;
  onRangeChange: (range: string) => void;
  selectedRange: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  location, 
  onLocationChange,
  selectedRange,
  onRangeChange
}) => {
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleModeChange = (mode: SearchMode) => {
    onLocationChange({ ...location, mode });
    setGeoError(null);
  };

  const requestGeolocation = () => {
    setLoadingGeo(true);
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      setLoadingGeo(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationChange({
          ...location,
          mode: 'device',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLoadingGeo(false);
      },
      () => {
        setGeoError("Unable to retrieve your location");
        setLoadingGeo(false);
      }
    );
  };

  useEffect(() => {
    if (location.mode === 'device' && !location.latitude) {
      requestGeolocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.mode]);

  // Derive available cities based on selected state
  const availableCities = useMemo(() => {
    if (!location.state) return [];
    // Get cities for state or empty array, then sort alphabetically
    const cities = CITIES_BY_STATE[location.state] || [];
    return [...cities].sort((a, b) => a.localeCompare(b));
  }, [location.state]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onLocationChange({ 
      ...location, 
      state: e.target.value,
      city: '' // Clear city when state changes to avoid mismatch
    });
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-brand-contrast1 mb-4 flex items-center">
        <MapPin className="mr-2 text-brand-accent1" /> Location Settings
      </h2>

      {/* Mode Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => handleModeChange('device')}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            location.mode === 'device' 
              ? 'bg-brand-contrast4 text-white shadow-md' 
              : 'bg-brand-base2 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Navigation size={16} /> Device
        </button>
        <button
          onClick={() => handleModeChange('zip')}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            location.mode === 'zip' 
              ? 'bg-brand-contrast4 text-white shadow-md' 
              : 'bg-brand-base2 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <span className="font-bold">123</span> Zip Code
        </button>
        <button
          onClick={() => handleModeChange('town')}
          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
            location.mode === 'town' 
              ? 'bg-brand-contrast4 text-white shadow-md' 
              : 'bg-brand-base2 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Building size={16} /> Town
        </button>
      </div>

      {/* Input Area */}
      <div className="mb-6 min-h-[80px]">
        {location.mode === 'device' && (
          <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-100">
            {loadingGeo ? (
              <span className="text-brand-contrast4 animate-pulse">Locating you...</span>
            ) : geoError ? (
              <span className="text-brand-accent1 font-medium">{geoError}</span>
            ) : (
              <div className="text-brand-notice1 font-medium flex flex-col items-center">
                <span>📍 Using Current Device Location</span>
                <button onClick={requestGeolocation} className="text-xs text-brand-contrast4 underline mt-1">Refresh</button>
              </div>
            )}
          </div>
        )}

        {location.mode === 'zip' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Zip Code</label>
            <input
              type="text"
              maxLength={5}
              placeholder="e.g. 90210"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-base1 focus:border-transparent outline-none"
              value={location.zipCode}
              onChange={(e) => onLocationChange({ ...location, zipCode: e.target.value })}
            />
          </div>
        )}

        {location.mode === 'town' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-base1 outline-none"
                value={location.state}
                onChange={handleStateChange}
              >
                <option value="">Select State</option>
                {US_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City / Town</label>
              <input
                list="town-suggestions"
                type="text"
                placeholder={location.state ? "Select or Type City" : "Select State First"}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-base1 outline-none ${!location.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                value={location.city}
                onChange={(e) => onLocationChange({ ...location, city: e.target.value })}
                disabled={!location.state}
              />
              <datalist id="town-suggestions">
                {availableCities.map(town => (
                  <option key={town} value={town} />
                ))}
              </datalist>
            </div>
          </div>
        )}
      </div>

      {/* Range Selector */}
      <div className="pt-2">
        <label className="block text-xl font-bold text-brand-contrast1 mb-3 flex items-center">
           <MapPin className="mr-2 text-brand-accent1" /> Search Radius
        </label>
        <div className="flex items-center space-x-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          {['5', '10', '15'].map((r) => (
            <label key={r} className="flex items-center cursor-pointer group">
              <input
                type="radio"
                name="range"
                value={r}
                checked={selectedRange === r}
                onChange={() => onRangeChange(r)}
                className="w-5 h-5 text-brand-contrast4 focus:ring-brand-contrast4 border-gray-300"
              />
              <span className={`ml-2 font-medium transition-colors ${selectedRange === r ? 'text-brand-contrast4' : 'text-gray-600'}`}>
                Within {r} miles
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
