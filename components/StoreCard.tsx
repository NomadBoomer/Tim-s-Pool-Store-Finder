import React from 'react';
import { StoreResult } from '../types';
import { Phone, MapPin, Star, Trophy, Navigation, ExternalLink, BadgePercent } from 'lucide-react';

interface StoreCardProps {
  store: StoreResult;
}

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const isRatingAvailable = store.rating !== "Not Available" && store.rating !== undefined;
  const isPhoneAvailable = store.phone && store.phone !== "Not Available";
  
  // Logic to determine if this is a "Top Rated" store (4.8 stars or higher)
  const isTopRated = !store.isSponsored && isRatingAvailable && typeof store.rating === 'number' && store.rating >= 4.8;

  return (
    <div className={`
      bg-white rounded-xl shadow-lg transition-all duration-300 border overflow-hidden flex flex-col h-full group relative
      ${store.isSponsored 
        ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-xl' 
        : isTopRated 
          ? 'border-yellow-400 shadow-xl ring-1 ring-yellow-100' 
          : 'border-brand-base2 hover:shadow-2xl'
      }
    `}>
      {/* Visual Indicator for Sponsored Stores */}
      {store.isSponsored && (
         <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-bl-lg z-10 flex items-center shadow-sm">
           Sponsored
         </div>
      )}

      {/* Visual Indicator for Top Rated Stores */}
      {isTopRated && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-950 text-xs font-bold px-3 py-1.5 rounded-bl-lg z-10 flex items-center shadow-sm border-b border-l border-white/20">
          <Trophy size={13} className="mr-1.5" /> Top Rated
        </div>
      )}

      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2 pr-16">
          <h3 className={`text-xl font-bold transition-colors leading-tight ${store.isSponsored ? 'text-indigo-900' : 'text-gray-900 group-hover:text-brand-accent1'}`}>
            {store.name}
          </h3>
        </div>
        
        <div className="flex items-center mb-3">
            {isRatingAvailable ? (
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                <div className="flex text-yellow-400 mr-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < Math.floor(store.rating as number) ? "currentColor" : "none"} 
                      className={i < Math.floor(store.rating as number) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">{store.rating}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Rating N/A</span>
            )}
        </div>
        
        <p className="text-sm text-gray-500 mb-4 flex items-start">
          <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-brand-contrast4" />
          {store.address}
        </p>

        <div className={`p-4 rounded-lg mb-4 border-l-4 ${store.isSponsored ? 'bg-indigo-50 border-indigo-400' : 'bg-brand-base2/30 border-brand-base1'}`}>
          <p className="text-sm text-gray-700 italic leading-relaxed">"{store.reviewSummary}"</p>
        </div>

        {/* Special Offer for Sponsored Cards */}
        {store.isSponsored && store.specialOffer && (
          <div className="flex items-center text-sm font-semibold text-green-700 bg-green-50 p-2 rounded mb-3 border border-green-200">
             <BadgePercent size={18} className="mr-2" />
             {store.specialOffer}
          </div>
        )}

        <div className="flex flex-col space-y-2 border-t border-gray-100 pt-3">
          {/* Phone */}
          <div className="flex items-center text-sm">
            <Phone size={16} className="mr-2 text-gray-400" />
            {isPhoneAvailable ? (
              <a 
                href={`tel:${store.phone.replace(/\D/g,'')}`} 
                className="font-medium text-brand-notice1 hover:text-green-700 transition-colors"
              >
                {store.phone}
              </a>
            ) : (
              <span className="text-gray-400 italic">Not Available</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-px bg-gray-200">
        <a 
          href={store.mapUri} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`bg-brand-base1 hover:bg-cyan-400 text-brand-contrast1 font-bold py-3 px-2 text-center transition-colors flex items-center justify-center gap-2 text-sm ${store.isSponsored ? 'col-span-1' : 'col-span-2'}`}
        >
          <Navigation size={16} />
          Directions
        </a>

        {/* Extra Button for Sponsored: Visit Website */}
        {store.isSponsored && (
          <a 
            href={store.website || '#'}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-2 text-center transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ExternalLink size={16} />
            Visit Site
          </a>
        )}
      </div>
    </div>
  );
};

export default StoreCard;