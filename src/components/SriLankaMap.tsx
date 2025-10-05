import { MapPin, Cloud, Droplets, Wind } from 'lucide-react';
import { SriLankaLocation } from '../types/location';

interface SriLankaMapProps {
  searchQuery: string;
  selectedLocation: SriLankaLocation | null;
  onLocationSelect: (location: SriLankaLocation) => void;
  selectedDisasterTypes: Set<string>;
  locations: SriLankaLocation[];
}

const getProbabilityColor = (probability: number) => {
  if (probability >= 70) return '#FF3B30';
  if (probability >= 50) return '#FF9500';
  return '#34C759';
};

export function SriLankaMap({ searchQuery, selectedLocation, onLocationSelect, selectedDisasterTypes, locations }: SriLankaMapProps) {
  const filteredLocations = locations.filter((loc) => {
    // Filter by search query
    const matchesSearch = !searchQuery || 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.district.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by disaster types (if any are selected)
    const matchesDisasterType = selectedDisasterTypes.size === 0 ||
      loc.predictions.some(pred => selectedDisasterTypes.has(pred.type));

    return matchesSearch && matchesDisasterType;
  });

  return (
    <div className="relative w-full h-full bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10">
      {/* Map Background - Sri Lanka focused */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F1A] to-[#0A0A0A]">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Simplified Sri Lanka map outline */}
        <svg viewBox="0 0 400 600" className="w-full h-full opacity-20">
          {/* Sri Lanka island shape (simplified) */}
          <path
            d="M200,50 L220,80 L240,120 L250,180 L260,250 L270,320 L280,400 L275,480 L260,540 L240,570 L210,590 L180,595 L150,590 L120,570 L100,530 L90,480 L85,420 L80,350 L85,280 L95,220 L110,160 L130,110 L160,70 L180,55 Z"
            fill="#1A1A1A"
            stroke="#333"
            strokeWidth="2"
          />
        </svg>

        {/* Location markers - Sri Lanka coordinates normalized */}
        {filteredLocations.map((location) => {
          // Normalize Sri Lanka coordinates (5.9°N to 9.8°N, 79.7°E to 81.9°E)
          const x = ((location.lng - 79.7) / (81.9 - 79.7)) * 100;
          const y = ((9.8 - location.lat) / (9.8 - 5.9)) * 100;

          const isSelected = selectedLocation?.id === location.id;
          const maxProbability = Math.max(...location.predictions.map((p) => p.probability));
          const markerColor = getProbabilityColor(maxProbability);

          return (
            <div
              key={location.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => onLocationSelect(location)}
            >
              <div
                className={`w-4 h-4 rounded-full transition-all ${
                  isSelected ? 'scale-150' : 'scale-100 group-hover:scale-125'
                }`}
                style={{
                  backgroundColor: markerColor,
                  boxShadow: `0 0 ${isSelected ? '30px' : '20px'} ${markerColor}80`,
                  animation: isSelected ? 'pulse 2s infinite' : 'pulse 3s infinite',
                }}
              />
              
              {/* Location label on hover */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-[#111111] border border-white/10 rounded-lg px-3 py-2 whitespace-nowrap">
                  <div className="text-[#E0E0E0]">{location.name}</div>
                  <div className="text-[#B0B0B0]">{location.currentWeather.temperature}°C</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Location Preview Card */}
      {selectedLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#111111]/95 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 w-[calc(100%-2rem)] sm:w-[400px] max-w-[400px] shadow-2xl z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-[#E0E0E0]">{selectedLocation.name}</h3>
              <p className="text-[#B0B0B0]">{selectedLocation.district} District</p>
            </div>
            <button
              onClick={() => onLocationSelect(selectedLocation)}
              className="text-[#3B82F6] hover:text-[#2563EB] transition-colors"
            >
              View Details
            </button>
          </div>

          {/* Current Weather */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
              <Cloud className="w-4 h-4 text-[#3B82F6] mb-1" />
              <div className="text-[#E0E0E0]">{selectedLocation.currentWeather.temperature}°C</div>
              <div className="text-[#B0B0B0]">Temp</div>
            </div>
            <div className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
              <Droplets className="w-4 h-4 text-[#3B82F6] mb-1" />
              <div className="text-[#E0E0E0]">{selectedLocation.currentWeather.humidity}%</div>
              <div className="text-[#B0B0B0]">Humidity</div>
            </div>
            <div className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
              <Wind className="w-4 h-4 text-[#3B82F6] mb-1" />
              <div className="text-[#E0E0E0]">{selectedLocation.currentWeather.windSpeed} km/h</div>
              <div className="text-[#B0B0B0]">Wind</div>
            </div>
          </div>

          {/* Top Risk */}
          <div className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#B0B0B0] mb-1">Highest Risk</div>
                <div className="text-[#E0E0E0]">{selectedLocation.predictions[0].type}</div>
              </div>
              <div
                className="px-3 py-1 rounded-lg"
                style={{
                  backgroundColor: `${getProbabilityColor(selectedLocation.predictions[0].probability)}20`,
                  color: getProbabilityColor(selectedLocation.predictions[0].probability),
                }}
              >
                {selectedLocation.predictions[0].probability}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[#111111]/90 backdrop-blur-sm border border-white/10 rounded-xl p-3 md:p-4">
        <div className="text-[#E0E0E0] mb-2">Risk Level</div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF3B30]" />
            <span className="text-[#B0B0B0]">High (≥70%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF9500]" />
            <span className="text-[#B0B0B0]">Medium (50-69%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#34C759]" />
            <span className="text-[#B0B0B0]">Low {'(<50%)'}</span>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-[#111111]/90 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-[#3B82F6]" strokeWidth={1.5} />
          <span className="text-[#E0E0E0]">{filteredLocations.length} Locations</span>
        </div>
      </div>
    </div>
  );
}
