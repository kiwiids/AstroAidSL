import { Search, MapPin, Map, LayoutDashboard, Download, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { SriLankaLocation } from '../types/location';

interface MobileLocationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locations: SriLankaLocation[];
  onLocationSelect: (location: SriLankaLocation) => void;
  selectedDisasterTypes: Set<string>;
  toggleDisasterType: (type: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const disasterTypes = ['Flood', 'Storm', 'Landslide', 'Drought', 'Heat Wave'];

export function MobileLocationSearch({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  locations,
  onLocationSelect,
  selectedDisasterTypes,
  toggleDisasterType,
  activeView,
  setActiveView,
}: MobileLocationSearchProps) {
  const filteredLocations = searchQuery
    ? locations.filter((loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.district.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : locations;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] bg-[#111111] border-white/5 p-0">
        <div className="h-full flex flex-col px-6 py-6">
          {/* Logo */}
          <SheetHeader className="mb-6">
            <SheetTitle className="tracking-[0.2em] text-[#E0E0E0] font-mono text-left">
              ASTROAID
            </SheetTitle>
            <p className="text-[#B0B0B0] text-left">Sri Lanka</p>
          </SheetHeader>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B0B0B0]" />
            <Input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1A1A1A] border-white/10 text-[#E0E0E0] placeholder:text-[#B0B0B0] focus:border-[#3B82F6] transition-colors rounded-xl h-11"
            />
          </div>

          {/* Filters & Location List */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Disaster Type Filter */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="w-4 h-4 text-[#3B82F6]" />
                <h3 className="text-[#E0E0E0]">Filter by Disaster</h3>
              </div>
              <div className="space-y-2">
                {disasterTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-3">
                    <Checkbox
                      id={`mobile-disaster-${type}`}
                      checked={selectedDisasterTypes.has(type)}
                      onCheckedChange={() => toggleDisasterType(type)}
                      className="border-white/20 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]"
                    />
                    <Label
                      htmlFor={`mobile-disaster-${type}`}
                      className="text-[#B0B0B0] cursor-pointer hover:text-[#E0E0E0] transition-colors"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location List */}
            <div>
              <h3 className="text-[#E0E0E0] mb-3">
                {searchQuery ? 'Search Results' : 'Locations'}
              </h3>
              <div className="space-y-2">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => {
                      onLocationSelect(location);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-[#3B82F6] hover:bg-white/5 transition-all group"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-3 h-3 text-[#3B82F6]" strokeWidth={1.5} />
                      <span className="text-[#E0E0E0]">{location.name}</span>
                    </div>
                    <p className="text-[#B0B0B0] ml-5">{location.currentWeather.temperature}°C</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <button
              onClick={() => {
                setActiveView('map');
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeView === 'map'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#B0B0B0] hover:bg-white/5 hover:text-[#E0E0E0]'
              }`}
            >
              <Map className="w-5 h-5" strokeWidth={1.5} />
              <span>Map View</span>
            </button>
            <button
              onClick={() => {
                setActiveView('dashboard');
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeView === 'dashboard'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#B0B0B0] hover:bg-white/5 hover:text-[#E0E0E0]'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActiveView('export');
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeView === 'export'
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-[#B0B0B0] hover:bg-white/5 hover:text-[#E0E0E0]'
              }`}
            >
              <Download className="w-5 h-5" strokeWidth={1.5} />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
