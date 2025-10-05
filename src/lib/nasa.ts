// Lightweight NASA API client utilities for POWER (weather) and EONET (events)

export type PowerDailyResponse = {
  properties?: {
    parameter?: Record<string, Record<string, number>>;
  };
};

type EonetEvent = {
  id: string;
  title: string;
  categories: { id: number; title: string }[];
  geometry: { coordinates: [number, number] }[]; // [lon, lat]
};

type EonetResponse = {
  events: EonetEvent[];
};

const POWER_BASE = 'https://power.larc.nasa.gov/api/temporal/daily/point';
const EONET_BASE = 'https://eonet.gsfc.nasa.gov/api/v3/events';

function formatDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export async function fetchPowerWeather(lat: number, lon: number) {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - 7);
  const params = new URLSearchParams({
    parameters: 'T2M,RH2M,WS10M,PRECTOTCORR,PS',
    community: 'AG',
    longitude: String(lon),
    latitude: String(lat),
    start: formatDate(start),
    end: formatDate(end),
    format: 'JSON',
  });

  const url = `${POWER_BASE}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`POWER request failed: ${res.status}`);
  const json: PowerDailyResponse = await res.json();

  const param = json.properties?.parameter ?? {};
  // Use the most recent day available from one of the series
  const pickLatest = (series?: Record<string, number>) => {
    if (!series) return undefined;
    const dates = Object.keys(series).sort();
    const last = dates[dates.length - 1];
    return last ? series[last] : undefined;
  };

  const temperature = pickLatest(param.T2M) ?? 0;
  const humidity = pickLatest(param.RH2M) ?? 0;
  const windSpeed = pickLatest(param.WS10M) ?? 0;
  const rainfall = pickLatest(param.PRECTOTCORR) ?? 0;
  const pressure = pickLatest(param.PS) ?? 0;

  return { temperature, humidity, windSpeed, rainfall, pressure };
}

export async function fetchPowerSeries(lat: number, lon: number) {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - 30);
  const params = new URLSearchParams({
    parameters: 'T2M,PRECTOTCORR',
    community: 'AG',
    longitude: String(lon),
    latitude: String(lat),
    start: formatDate(start),
    end: formatDate(end),
    format: 'JSON',
  });

  const url = `${POWER_BASE}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`POWER series failed: ${res.status}`);
  const json: PowerDailyResponse = await res.json();
  const param = json.properties?.parameter ?? {};
  const dates = Object.keys(param.T2M ?? {}).sort();
  return {
    dates,
    temperature: dates.map((d) => (param.T2M?.[d] ?? 0)),
    rainfall: dates.map((d) => (param.PRECTOTCORR?.[d] ?? 0)),
  };
}

export async function fetchEonetEvents(lat: number, lon: number, radiusKm = 300) {
  const url = `${EONET_BASE}?status=open`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`EONET request failed: ${res.status}`);
  const json: EonetResponse = await res.json();

  // Filter events within radius km of given point
  const within = (ev: EonetEvent) => {
    const g = ev.geometry[ev.geometry.length - 1];
    if (!g) return false;
    const [evLon, evLat] = g.coordinates;
    return haversine(lat, lon, evLat, evLon) <= radiusKm;
  };

  return json.events.filter(within);
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function deriveDisasterProbabilities(
  events: EonetEvent[],
  weather: { temperature: number; humidity: number; windSpeed: number; rainfall: number }
) {
  // Heuristic: base probabilities from local weather, boost by nearby EONET categories
  let flood = clamp(weather.rainfall * 5, 0, 90); // rainfall mm/day → %
  let storm = clamp(weather.windSpeed * 4, 0, 80);
  let drought = clamp(100 - weather.humidity, 0, 70);
  let landslide = clamp((weather.rainfall - 5) * 6, 0, 85);
  let heat = clamp(weather.temperature - 28, 0, 60) * 2;

  for (const ev of events) {
    const titles = ev.categories.map((c) => c.title.toLowerCase());
    if (titles.some((t) => t.includes('flood'))) flood = clamp(flood + 15, 0, 100);
    if (titles.some((t) => t.includes('severe storm') || t.includes('storm'))) storm = clamp(storm + 20, 0, 100);
    if (titles.some((t) => t.includes('drought'))) drought = clamp(drought + 15, 0, 100);
    if (titles.some((t) => t.includes('landslide'))) landslide = clamp(landslide + 15, 0, 100);
    if (titles.some((t) => t.includes('wildfire') || t.includes('heat'))) heat = clamp(heat + 10, 0, 100);
  }

  const probs = [
    { type: 'Flood' as const, probability: Math.round(flood) },
    { type: 'Storm' as const, probability: Math.round(storm) },
    { type: 'Landslide' as const, probability: Math.round(landslide) },
    { type: 'Drought' as const, probability: Math.round(drought) },
    { type: 'Heat Wave' as const, probability: Math.round(heat) },
  ].map((p) => ({
    ...p,
    severity: p.probability >= 70 ? 'High' : p.probability >= 50 ? 'Medium' : 'Low',
    description: descriptionFor(p.type),
  }));

  // sort by probability desc
  probs.sort((a, b) => b.probability - a.probability);
  return probs;
}

function descriptionFor(type: 'Flood' | 'Storm' | 'Landslide' | 'Drought' | 'Heat Wave') {
  switch (type) {
    case 'Flood':
      return 'Derived from recent precipitation and nearby flood events';
    case 'Storm':
      return 'Wind speed and regional storm activity suggest storm risk';
    case 'Landslide':
      return 'High rainfall and terrain factors indicate slide potential';
    case 'Drought':
      return 'Low humidity and rainfall indicate drought risk';
    case 'Heat Wave':
      return 'Elevated temperatures suggest potential heat stress';
  }
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}



