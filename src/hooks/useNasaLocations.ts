import { useEffect, useMemo, useState } from 'react';
import { sriLankaLocations } from '../data/sriLankaLocations';
import { SriLankaLocation } from '../types/location';
import { fetchPowerWeather, fetchEonetEvents, fetchPowerSeries } from '../lib/nasa';

type State = {
  data: SriLankaLocation[];
  loading: boolean;
  error: string | null;
};

export function useNasaLocations(): State {
  const [state, setState] = useState<State>({ data: [], loading: true, error: null });

  const base = useMemo(() => sriLankaLocations.map((l) => ({ ...l })), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const enriched = await Promise.all(
          base.map(async (loc) => {
            const [weather, events, series] = await Promise.all([
              fetchPowerWeather(loc.lat, loc.lng),
              fetchEonetEvents(loc.lat, loc.lng, 300),
              fetchPowerSeries(loc.lat, loc.lng),
            ]);

            const updated: SriLankaLocation = {
              ...loc,
              currentWeather: {
                temperature: Math.round(weather.temperature),
                humidity: Math.round(weather.humidity),
                rainfall: Math.round(weather.rainfall),
                windSpeed: Math.round(weather.windSpeed),
                pressure: Math.round(weather.pressure),
              },
              predictions: [],
              historicalData: [],
              eonetEvents: events.map((e) => ({ id: e.id, title: e.title, categories: e.categories })),
              powerSeries: series,
            };
            return updated;
          })
        );
        if (!cancelled) setState({ data: enriched, loading: false, error: null });
      } catch (e: any) {
        if (!cancelled) setState({ data: [], loading: false, error: e?.message ?? 'Failed to fetch NASA data' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [base]);

  return state;
}



