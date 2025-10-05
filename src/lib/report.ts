import { SriLankaLocation } from '../types/location';

export function downloadLocationReport(location: SriLankaLocation) {
  const report = {
    generatedAt: new Date().toISOString(),
    location: {
      id: location.id,
      name: location.name,
      district: location.district,
      coordinates: { lat: location.lat, lng: location.lng },
    },
    currentWeather: location.currentWeather,
    predictions: location.predictions,
    historicalData: location.historicalData,
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeName = `${location.name.replace(/[^a-z0-9\-]+/gi, '_')}_report.json`;
  link.download = safeName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}


