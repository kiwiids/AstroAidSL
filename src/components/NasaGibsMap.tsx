import { useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import { SriLankaLocation } from '../types/location';

// Default Leaflet marker icon fix for bundlers
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon as any;

interface NasaGibsMapProps {
  locations: SriLankaLocation[];
  selectedLocation: SriLankaLocation | null;
  onLocationSelect: (location: SriLankaLocation | null) => void;
}

function ClickOutsidePopup({ onClose }: { onClose: () => void }) {
  useMapEvent('click', () => onClose());
  return null;
}

export function NasaGibsMap({ locations, selectedLocation, onLocationSelect }: NasaGibsMapProps) {
  const center = useMemo(() => ({ lat: 7.8731, lng: 80.7718 }), []);
  const mapRef = useRef(null);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={7}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        ref={mapRef}
      >
        {/* NASA GIBS Blue Marble base layer via tiles.arcgis */}
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Imagery © Esri"
        />

        <ClickOutsidePopup onClose={() => onLocationSelect(null)} />

        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            eventHandlers={{ click: () => onLocationSelect(loc) }}
          >
            {selectedLocation?.id === loc.id && (
              <Popup autoClose={false} closeOnEscapeKey={true} closeButton={false}>
                <div className="text-[#E0E0E0]">
                  <div className="font-medium">{loc.name}</div>
                  <div className="text-[#B0B0B0] mb-2">{loc.district}</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-[#B0B0B0] text-sm">Temp</div>
                      <div>{loc.currentWeather.temperature}°C</div>
                    </div>
                    <div>
                      <div className="text-[#B0B0B0] text-sm">Humidity</div>
                      <div>{loc.currentWeather.humidity}%</div>
                    </div>
                    <div>
                      <div className="text-[#B0B0B0] text-sm">Wind</div>
                      <div>{loc.currentWeather.windSpeed} km/h</div>
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default NasaGibsMap;



