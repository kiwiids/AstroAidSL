import { useState } from 'react';
import { AlertTriangle, MapPin } from 'lucide-react';

interface DisasterLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  riskType: string;
  riskLevel: string;
  description: string;
}

interface MapViewProps {
  selectedRiskTypes: Set<string>;
  selectedRiskLevels: Set<string>;
  searchQuery: string;
}

// Mock data for disaster locations
const mockLocations: DisasterLocation[] = [
  { id: 1, name: 'California', lat: 36.7783, lng: -119.4179, riskType: 'Wildfire', riskLevel: 'High', description: 'Severe wildfire risk in dry season' },
  { id: 2, name: 'Bangladesh', lat: 23.685, lng: 90.3563, riskType: 'Flood', riskLevel: 'High', description: 'Monsoon flooding expected' },
  { id: 3, name: 'Tokyo', lat: 35.6762, lng: 139.6503, riskType: 'Earthquake', riskLevel: 'High', description: 'Seismically active region' },
  { id: 4, name: 'Florida', lat: 27.6648, lng: -81.5158, riskType: 'Hurricane', riskLevel: 'Medium', description: 'Hurricane season active' },
  { id: 5, name: 'Nepal', lat: 28.3949, lng: 84.124, riskType: 'Landslide', riskLevel: 'High', description: 'Mountainous terrain risk' },
  { id: 6, name: 'Australia', lat: -25.2744, lng: 133.7751, riskType: 'Wildfire', riskLevel: 'Medium', description: 'Bushfire season ongoing' },
  { id: 7, name: 'Philippines', lat: 12.8797, lng: 121.774, riskType: 'Hurricane', riskLevel: 'High', description: 'Typhoon corridor' },
  { id: 8, name: 'Italy', lat: 41.8719, lng: 12.5674, riskType: 'Earthquake', riskLevel: 'Medium', description: 'Moderate seismic activity' },
  { id: 9, name: 'Netherlands', lat: 52.1326, lng: 5.2913, riskType: 'Flood', riskLevel: 'Low', description: 'Well-managed water systems' },
  { id: 10, name: 'Chile', lat: -35.6751, lng: -71.543, riskType: 'Earthquake', riskLevel: 'High', description: 'Ring of Fire location' },
];

const getRiskColor = (level: string) => {
  switch (level) {
    case 'High':
      return '#FF3B30';
    case 'Medium':
      return '#FF9500';
    case 'Low':
      return '#34C759';
    default:
      return '#B0B0B0';
  }
};

export function MapView({ selectedRiskTypes, selectedRiskLevels, searchQuery }: MapViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<DisasterLocation | null>(null);

  const filteredLocations = mockLocations.filter((loc) => {
    const matchesRiskType = selectedRiskTypes.size === 0 || selectedRiskTypes.has(loc.riskType);
    const matchesRiskLevel = selectedRiskLevels.size === 0 || selectedRiskLevels.has(loc.riskLevel);
    const matchesSearch = searchQuery === '' || loc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRiskType && matchesRiskLevel && matchesSearch;
  });

  return (
    <div className="relative w-full h-full bg-[#0A0A0A] rounded-2xl overflow-hidden border border-white/10">
      {/* Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#0F0F1A] to-[#0A0A0A]">
        {/* Grid overlay for futuristic effect */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Simplified world map representation */}
        <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20">
          {/* Continents as simple shapes */}
          <path d="M100,200 L180,180 L250,200 L220,250 L150,260 Z" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
          <path d="M300,150 L450,140 L520,180 L480,240 L350,250 L280,200 Z" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
          <path d="M520,180 L650,160 L720,200 L680,270 L600,280 L520,250 Z" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
          <path d="M150,300 L220,280 L280,320 L250,370 L180,360 Z" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
          <path d="M650,300 L750,290 L800,340 L740,380 L670,370 Z" fill="#1A1A1A" stroke="#333" strokeWidth="1" />
        </svg>

        {/* Location markers */}
        {filteredLocations.map((location) => {
          const x = ((location.lng + 180) / 360) * 100;
          const y = ((90 - location.lat) / 180) * 100;
          
          return (
            <div
              key={location.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => setSelectedLocation(location)}
            >
              <div
                className="w-4 h-4 rounded-full animate-pulse"
                style={{
                  backgroundColor: getRiskColor(location.riskLevel),
                  boxShadow: `0 0 20px ${getRiskColor(location.riskLevel)}80`
                }}
              />
              <div
                className="absolute w-8 h-8 rounded-full border-2 -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  borderColor: getRiskColor(location.riskLevel),
                  animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Location popup card */}
      {selectedLocation && (
        <div className="absolute top-2 md:top-4 left-1/2 -translate-x-1/2 bg-[#111111] border border-white/10 rounded-2xl p-4 md:p-6 w-[calc(100%-2rem)] sm:w-[360px] max-w-[360px] shadow-2xl z-10">
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getRiskColor(selectedLocation.riskLevel) }}
              />
              <h3 className="text-[#E0E0E0]">{selectedLocation.name}</h3>
            </div>
            <button
              onClick={() => setSelectedLocation(null)}
              className="text-[#B0B0B0] hover:text-[#E0E0E0] transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#B0B0B0]">Risk Type</span>
              <span className="text-[#E0E0E0]">{selectedLocation.riskType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#B0B0B0]">Risk Level</span>
              <span
                className="px-3 py-1 rounded-lg"
                style={{
                  backgroundColor: `${getRiskColor(selectedLocation.riskLevel)}20`,
                  color: getRiskColor(selectedLocation.riskLevel)
                }}
              >
                {selectedLocation.riskLevel}
              </span>
            </div>
            <div>
              <p className="text-[#B0B0B0]">{selectedLocation.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-[#111111]/90 backdrop-blur-sm border border-white/10 rounded-xl p-3 md:p-4">
        <div className="space-y-1.5 md:space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF3B30]" />
            <span className="text-[#B0B0B0]">High Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#FF9500]" />
            <span className="text-[#B0B0B0]">Medium Risk</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#34C759]" />
            <span className="text-[#B0B0B0]">Low Risk</span>
          </div>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-[#111111]/90 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center space-x-2">
          <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#3B82F6]" strokeWidth={1.5} />
          <span className="text-[#E0E0E0]">{filteredLocations.length} Locations</span>
        </div>
      </div>
    </div>
  );
}
