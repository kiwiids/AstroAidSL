import { User, Menu, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onInsightsClick: () => void;
}

export function Header({ onMenuClick, onInsightsClick }: HeaderProps) {
  return (
    <div className="h-14 md:h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 lg:px-8 bg-[#0A0A0A]">
      {/* Left side - Menu button (mobile) + Title */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:border-[#3B82F6] transition-colors"
        >
          <Menu className="w-5 h-5 text-[#B0B0B0]" strokeWidth={1.5} />
        </button>
        <h2 className="text-[#E0E0E0] truncate">
          <span className="hidden md:inline">Sri Lanka Disaster Prediction</span>
          <span className="md:hidden">AstroAid LK</span>
        </h2>
      </div>

      {/* Right side - Insights button (mobile/tablet) + Profile */}
      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={onInsightsClick}
          className="xl:hidden w-9 h-9 rounded-lg bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:border-[#3B82F6] transition-colors"
        >
          <BarChart3 className="w-5 h-5 text-[#B0B0B0]" strokeWidth={1.5} />
        </button>
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center hover:border-[#3B82F6] transition-colors cursor-pointer">
          <User className="w-4 h-4 md:w-5 md:h-5 text-[#B0B0B0]" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
