import React from 'react';
import { SERVICE_OPTIONS } from '../constants';
import { ListFilter } from 'lucide-react';

interface FilterBarProps {
  selectedFilters: string[];
  onToggleFilter: (id: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedFilters, onToggleFilter }) => {
  
  const isAllSelected = selectedFilters.length === 0;

  return (
    <div>
      <h3 className="text-xl font-bold text-brand-contrast1 mb-4 flex items-center">
        <ListFilter className="mr-2 text-brand-accent1" /> Product & Service Filters
      </h3>
      <div id="product-filter-container" className="flex flex-wrap gap-2">
        {/* Show All Button */}
        <button
          onClick={() => onToggleFilter('all')}
          className={`filter-btn px-4 py-2 rounded-full font-medium transition-transform active:scale-95 shadow-sm border text-sm ${
            isAllSelected
              ? 'bg-brand-contrast1 text-white border-brand-contrast1 ring-2 ring-offset-2 ring-brand-contrast1'
              : 'bg-brand-base2 text-gray-900 border-transparent hover:bg-gray-300'
          }`}
        >
          ⭐ Show All
        </button>

        {/* Dynamic Service Buttons */}
        {SERVICE_OPTIONS.map((option) => {
          const isSelected = selectedFilters.includes(option.id);
          return (
            <button
              key={option.id}
              data-filter={option.id}
              onClick={() => onToggleFilter(option.id)}
              className={`filter-btn px-3 py-2 rounded-full font-medium transition-all active:scale-95 shadow-sm border text-sm ${
                isSelected 
                  ? `${option.colorClass} ring-2 ring-offset-2 ring-brand-contrast4 scale-105` 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {option.icon} {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;