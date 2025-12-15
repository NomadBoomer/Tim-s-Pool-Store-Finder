import React from 'react';
import { OpenTimeFilter } from '../types';
import { Clock } from 'lucide-react';

interface OpenTimeFilterProps {
  value: OpenTimeFilter;
  onChange: (value: OpenTimeFilter) => void;
}

const OpenTimeFilter: React.FC<OpenTimeFilterProps> = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-brand-contrast1 mb-3 flex items-center">
        <Clock className="mr-2 text-brand-accent1" /> Open Time
      </h3>
      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="openTime"
            value="all"
            checked={value === 'all'}
            onChange={() => onChange('all')}
            className="w-5 h-5 text-brand-contrast4 focus:ring-brand-contrast4 border-gray-300"
          />
          <span className={`ml-2 font-medium transition-colors ${value === 'all' ? 'text-brand-contrast4' : 'text-gray-600'}`}>
            Show All
          </span>
        </label>

        <label className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="openTime"
            value="now"
            checked={value === 'now'}
            onChange={() => onChange('now')}
            className="w-5 h-5 text-brand-contrast4 focus:ring-brand-contrast4 border-gray-300"
          />
          <span className={`ml-2 font-medium transition-colors ${value === 'now' ? 'text-brand-contrast4' : 'text-gray-600'}`}>
            Open Now
          </span>
        </label>

        <label className="flex items-center cursor-pointer group">
          <input
            type="radio"
            name="openTime"
            value="weekend"
            checked={value === 'weekend'}
            onChange={() => onChange('weekend')}
            className="w-5 h-5 text-brand-contrast4 focus:ring-brand-contrast4 border-gray-300"
          />
          <span className={`ml-2 font-medium transition-colors ${value === 'weekend' ? 'text-brand-contrast4' : 'text-gray-600'}`}>
            Weekend Working
          </span>
        </label>
      </div>
    </div>
  );
};

export default OpenTimeFilter;