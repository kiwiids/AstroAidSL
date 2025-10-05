import { Search, Map, LayoutDashboard, Download, X } from 'lucide-react';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRiskTypes: Set<string>;
  toggleRiskType: (type: string) => void;
  selectedRiskLevels: Set<string>;
  toggleRiskLevel: (level: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const riskTypes = ['Wildfire', 'Flood', 'Earthquake', 'Hurricane', 'Landslide'];
const riskLevels = ['High', 'Medium', 'Low'];

export function MobileSidebar({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  selectedRiskTypes,
  toggleRiskType,
  selectedRiskLevels,
  toggleRiskLevel,
  activeView,
  setActiveView,
}: MobileSidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[280px] bg-[#111111] border-white/5 p-0">
        <div className="h-full flex flex-col px-6 py-6">
          {/* Logo */}
          <SheetHeader className="mb-6">
            <SheetTitle className="tracking-[0.2em] text-[#E0E0E0] font-mono text-left">
              ASTROAID
            </SheetTitle>
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

          {/* Filters */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Risk Type Filter */}
            <div>
              <h3 className="text-[#E0E0E0] mb-4">Risk Type</h3>
              <div className="space-y-3">
                {riskTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-3">
                    <Checkbox
                      id={`mobile-risk-${type}`}
                      checked={selectedRiskTypes.has(type)}
                      onCheckedChange={() => toggleRiskType(type)}
                      className="border-white/20 data-[state=checked]:bg-[#3B82F6] data-[state=checked]:border-[#3B82F6]"
                    />
                    <Label
                      htmlFor={`mobile-risk-${type}`}
                      className="text-[#B0B0B0] cursor-pointer hover:text-[#E0E0E0] transition-colors"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Level Filter */}
            <div>
              <h3 className="text-[#E0E0E0] mb-4">Risk Level</h3>
              <div className="space-y-3">
                {riskLevels.map((level) => (
                  <div key={level} className="flex items-center justify-between">
                    <Label
                      htmlFor={`mobile-level-${level}`}
                      className="text-[#B0B0B0] cursor-pointer hover:text-[#E0E0E0] transition-colors"
                    >
                      {level}
                    </Label>
                    <Switch
                      id={`mobile-level-${level}`}
                      checked={selectedRiskLevels.has(level)}
                      onCheckedChange={() => toggleRiskLevel(level)}
                      className="data-[state=checked]:bg-[#3B82F6]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 space-y-2">
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
              <span>Export</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
