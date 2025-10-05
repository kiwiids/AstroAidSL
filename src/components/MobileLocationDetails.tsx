import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Download, Cloud, Droplets, Wind, Gauge } from 'lucide-react';
import { SriLankaLocation } from '../types/location';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { downloadLocationReport } from '../lib/report';

interface MobileLocationDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  location: SriLankaLocation | null;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2">
        <p className="text-[#E0E0E0]">{payload[0].payload.year || payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const getProbabilityColor = (probability: number) => {
  if (probability >= 70) return '#FF3B30';
  if (probability >= 50) return '#FF9500';
  return '#34C759';
};

export function MobileLocationDetails({ isOpen, onClose, location }: MobileLocationDetailsProps) {
  if (!location) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[400px] bg-[#111111] border-white/5 p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="px-6 py-6 border-b border-white/5">
            <SheetTitle className="text-[#E0E0E0] text-left">
              {location.name}, {location.district}
            </SheetTitle>
          </SheetHeader>

          <Tabs defaultValue="current" className="flex-1 flex flex-col">
            <TabsList className="mx-6 mt-4 bg-[#0A0A0A] border border-white/5">
              <TabsTrigger
                value="current"
                className="text-[#B0B0B0] data-[state=active]:text-white data-[state=active]:bg-transparent"
              >
                Current
              </TabsTrigger>
              <TabsTrigger
                value="predictions"
                className="text-[#B0B0B0] data-[state=active]:text-white data-[state=active]:bg-transparent"
              >
                Predictions
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="text-[#B0B0B0] data-[state=active]:text-white data-[state=active]:bg-transparent"
              >
                History
              </TabsTrigger>
            </TabsList>

            {/* Current Weather Tab */}
            <TabsContent value="current" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-6 py-4">
                <div className="space-y-4">
                  <h3 className="text-[#E0E0E0]">Current Conditions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
                      <div className="flex items-center space-x-2 mb-2">
                        <Cloud className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-[#B0B0B0]">Temperature</span>
                      </div>
                      <div className="text-[#E0E0E0]">{location.currentWeather.temperature}°C</div>
                    </div>
                    <div className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
                      <div className="flex items-center space-x-2 mb-2">
                        <Droplets className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-[#B0B0B0]">Humidity</span>
                      </div>
                      <div className="text-[#E0E0E0]">{location.currentWeather.humidity}%</div>
                    </div>
                    <div className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wind className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-[#B0B0B0]">Wind Speed</span>
                      </div>
                      <div className="text-[#E0E0E0]">{location.currentWeather.windSpeed} km/h</div>
                    </div>
                    <div className="bg-[#0A0A0A] rounded-xl p-3 border border-white/5">
                      <div className="flex items-center space-x-2 mb-2">
                        <Gauge className="w-4 h-4 text-[#3B82F6]" />
                        <span className="text-[#B0B0B0]">Pressure</span>
                      </div>
                      <div className="text-[#E0E0E0]">{location.currentWeather.pressure} hPa</div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* EONET Events Tab */}
            <TabsContent value="predictions" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-[#3B82F6]" />
                    <h3 className="text-[#E0E0E0]">Nearby NASA EONET Events</h3>
                  </div>
                  <div className="space-y-3">
                    {(location.eonetEvents ?? []).map((e) => (
                      <div key={e.id} className="bg-[#0A0A0A] rounded-xl p-4 border border-white/5">
                        <div className="text-[#E0E0E0] mb-1">{e.title}</div>
                        <div className="text-[#B0B0B0] text-sm">{e.categories.map((c) => c.title).join(', ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* POWER Series Tab */}
            <TabsContent value="history" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-6 py-4">
                <div className="space-y-6">
                  {/* POWER Series */}
                  {location.powerSeries && (
                    <div className="bg-[#0A0A0A] rounded-xl p-4 border border-white/5">
                      <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={location.powerSeries.dates.map((d, i) => ({
                          date: d,
                          T2M: location.powerSeries!.temperature[i],
                          PRECTOT: location.powerSeries!.rainfall[i],
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                          <XAxis dataKey="date" stroke="#B0B0B0" hide={true} />
                          <YAxis stroke="#B0B0B0" />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="T2M" stroke="#3B82F6" strokeWidth={2} />
                          <Line type="monotone" dataKey="PRECTOT" stroke="#8B5CF6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Download Button */}
          <div className="px-6 py-3 border-t border-white/5">
            <button
              onClick={() => location && downloadLocationReport(location)}
              className="w-full bg-[#1A1A1A] hover:bg-[#232323] text-[#E0E0E0] py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors border border-white/10"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm">Download Report</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
