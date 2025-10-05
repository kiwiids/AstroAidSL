import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SriLankaMap } from './components/SriLankaMap';
import { NasaGibsMap } from './components/NasaGibsMap';
import { SidebarMenu } from './components/SidebarMenu';
import { LocationSearch } from './components/LocationSearch';
import { LocationDetails } from './components/LocationDetails';
import { MobileLocationDetails } from './components/MobileLocationDetails';
import { MobileLocationSearch } from './components/MobileLocationSearch';
import { SriLankaLocation } from './types/location';
import { useNasaLocations } from './hooks/useNasaLocations';

export default function App() {
  const { data: locations, loading, error } = useNasaLocations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<SriLankaLocation | null>(null);
  const [selectedDisasterTypes, setSelectedDisasterTypes] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState('map');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const toggleDisasterType = (type: string) => {
    const newSet = new Set(selectedDisasterTypes);
    if (newSet.has(type)) {
      newSet.delete(type);
    } else {
      newSet.add(type);
    }
    setSelectedDisasterTypes(newSet);
  };

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLocationSelect = (location: SriLankaLocation | null) => {
    setSelectedLocation(location);
    setDetailsOpen(!!location);
  };

  return (
    <div className="h-screen w-screen bg-[#0A0A0A] overflow-hidden">
      {/* Desktop Left Sidebar - Search */}
      <div className="hidden lg:block">
        <LocationSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          locations={locations}
          onLocationSelect={handleLocationSelect}
          selectedDisasterTypes={selectedDisasterTypes}
          toggleDisasterType={toggleDisasterType}
          activeView={activeView}
          setActiveView={setActiveView}
        />
      </div>

      {/* Mobile Location Search Drawer */}
      <MobileLocationSearch
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locations={locations}
        onLocationSelect={handleLocationSelect}
        selectedDisasterTypes={selectedDisasterTypes}
        toggleDisasterType={toggleDisasterType}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Mobile Location Details Drawer */}
      <MobileLocationDetails
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        location={selectedLocation}
      />

      {/* Main Content Area */}
      <div className="lg:ml-[280px] xl:mr-[380px] h-screen flex flex-col">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onInsightsClick={() => setDetailsOpen(true)}
        />
        
        {/* Map Container */}
        <div className="flex-1 p-3 md:p-4 lg:p-6">
          {error && (
            <div className="mb-2 text-red-400 text-sm">{error}</div>
          )}
          {loading && (
            <div className="mb-2 text-[#B0B0B0] text-sm">Loading live NASA data…</div>
          )}
          <div className="w-full h-full">
            <NasaGibsMap
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        </div>
      </div>

      {/* Desktop Right Menu Bar */}
      <SidebarMenu>
        <LocationDetails location={selectedLocation} />
      </SidebarMenu>
    </div>
  );
}
