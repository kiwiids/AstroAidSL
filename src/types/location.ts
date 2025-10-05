export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  pressure: number;
}

export interface HistoricalData {
  year: number;
  floods: number;
  storms: number;
  droughts: number;
  landslides: number;
}

export interface DisasterProbability {
  type: 'Flood' | 'Storm' | 'Landslide' | 'Drought' | 'Heat Wave';
  probability: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface SriLankaLocation {
  id: number;
  name: string;
  district: string;
  lat: number;
  lng: number;
  currentWeather: WeatherData;
  historicalData: HistoricalData[]; // kept for legacy, will be unused
  predictions: DisasterProbability[]; // kept for legacy, will be unused
  eonetEvents?: Array<{
    id: string;
    title: string;
    categories: { id: number; title: string }[];
  }>;
  powerSeries?: {
    dates: string[];
    temperature: number[]; // T2M
    rainfall: number[]; // PRECTOTCORR
  };
}
