import { PieChart, Pie, BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Download } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface InsightsPanelProps {
  selectedRiskTypes: Set<string>;
  selectedRiskLevels: Set<string>;
}

const riskTypeData = [
  { name: 'Wildfire', value: 25, color: '#FF6B35' },
  { name: 'Flood', value: 30, color: '#3B82F6' },
  { name: 'Earthquake', value: 20, color: '#8B5CF6' },
  { name: 'Hurricane', value: 15, color: '#EF4444' },
  { name: 'Landslide', value: 10, color: '#F59E0B' },
];

const riskLevelData = [
  { name: 'High', value: 45, color: '#FF3B30' },
  { name: 'Medium', value: 35, color: '#FF9500' },
  { name: 'Low', value: 20, color: '#34C759' },
];

const tableData = [
  { location: 'California', type: 'Wildfire', level: 'High', lastUpdate: '2h ago' },
  { location: 'Bangladesh', type: 'Flood', level: 'High', lastUpdate: '5h ago' },
  { location: 'Tokyo', type: 'Earthquake', level: 'High', lastUpdate: '1d ago' },
  { location: 'Florida', type: 'Hurricane', level: 'Medium', lastUpdate: '3h ago' },
  { location: 'Nepal', type: 'Landslide', level: 'High', lastUpdate: '6h ago' },
  { location: 'Australia', type: 'Wildfire', level: 'Medium', lastUpdate: '12h ago' },
  { location: 'Philippines', type: 'Hurricane', level: 'High', lastUpdate: '4h ago' },
  { location: 'Italy', type: 'Earthquake', level: 'Medium', lastUpdate: '2d ago' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2">
        <p className="text-[#E0E0E0]">{payload[0].name}</p>
        <p className="text-[#3B82F6]">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function InsightsPanel({ selectedRiskTypes, selectedRiskLevels }: InsightsPanelProps) {
  return (
    <div className="w-[300px] h-screen bg-[#111111] fixed right-0 top-0 flex flex-col border-l border-white/5 overflow-hidden z-40">
      <div className="px-6 py-6 lg:py-8 space-y-6 lg:space-y-8 flex-1 overflow-y-auto">
        {/* Risk Overview Section */}
        <div>
          <h3 className="text-[#E0E0E0] mb-4">Risk Overview</h3>
          <div className="bg-[#0A0A0A] rounded-xl p-4 border border-white/5">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={riskTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {riskTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {riskTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#B0B0B0]">{item.name}</span>
                  </div>
                  <span className="text-[#E0E0E0]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Level Section */}
        <div>
          <h3 className="text-[#E0E0E0] mb-4">By Risk Level</h3>
          <div className="bg-[#0A0A0A] rounded-xl p-4 border border-white/5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskLevelData}>
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {riskLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {riskLevelData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[#B0B0B0]">{item.name}</span>
                  </div>
                  <span className="text-[#E0E0E0]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div>
          <h3 className="text-[#E0E0E0] mb-4">Recent Alerts</h3>
          <div className="bg-[#0A0A0A] rounded-xl border border-white/5 overflow-hidden">
            <ScrollArea className="h-[300px]">
              <table className="w-full">
                <thead className="sticky top-0 bg-[#0A0A0A]">
                  <tr className="border-b border-white/5">
                    <th className="px-3 py-2 text-left text-[#B0B0B0]">Location</th>
                    <th className="px-3 py-2 text-left text-[#B0B0B0]">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        index % 2 === 0 ? 'bg-[#0A0A0A]' : 'bg-[#0F0F0F]'
                      }`}
                    >
                      <td className="px-3 py-3">
                        <div>
                          <div className="text-[#E0E0E0]">{row.location}</div>
                          <div className="text-[#B0B0B0]">{row.type}</div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor:
                              row.level === 'High'
                                ? '#FF3B3020'
                                : row.level === 'Medium'
                                ? '#FF950020'
                                : '#34C75920',
                            color:
                              row.level === 'High'
                                ? '#FF3B30'
                                : row.level === 'Medium'
                                ? '#FF9500'
                                : '#34C759',
                          }}
                        >
                          {row.level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="px-6 py-4 border-t border-white/5">
        <button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white py-3 rounded-xl flex items-center justify-center space-x-2 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          <Download className="w-5 h-5" strokeWidth={1.5} />
          <span>Download Report</span>
        </button>
      </div>
    </div>
  );
}
