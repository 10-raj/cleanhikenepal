import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Mountain } from 'lucide-react';

interface HikeMarker {
  name: string;
  location: string;
  description: string;
  lat: number;
  lng: number;
}

const hikeMarkers: HikeMarker[] = [
  {
    name: 'Champadevi Region',
    location: 'Dakshinkali, Kathmandu',
    description: 'A peaceful ridge hike through pine forests to a sacred summit overlooking the Kathmandu Valley.',
    lat: 27.5728,
    lng: 85.2467,
  },
  {
    name: 'Chapakharka Trail',
    location: 'Godawari, Lalitpur',
    description: 'A gentle mountain escape leading to rolling grassy clearings and paragliding viewpoints above Godawari.',
    lat: 27.5933,
    lng: 85.3700,
  },
  {
    name: 'Tarebhir Region',
    location: 'Gokarneshwor, Kathmandu',
    description: 'A scenic cliffside trek to a traditional Tamang village overlooking the city.',
    lat: 27.7250,
    lng: 85.3650,
  },
  {
    name: 'Bhundole Chaur Trail',
    location: 'Pharping, Kathmandu',
    description: 'A refreshing walk through pine-scented hills to an expansive hidden meadow for camping and picnics.',
    lat: 27.6500,
    lng: 85.2167,
  },
];

const orgLocation = { lat: 27.6800, lng: 85.3000 };

const orgIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 18px; height: 18px; border-radius: 50%;
    background: #0ea5e9; border: 3px solid #ffffff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const hikeIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 0; height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 16px solid #10b981;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
    position: relative;
  ">
    <div style="
      position: absolute; top: 4px; left: -3px;
      width: 6px; height: 6px; border-radius: 50%;
      background: #ffffff;
    "></div>
  </div>`,
  iconSize: [18, 16],
  iconAnchor: [9, 16],
});

export function InteractiveMap() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg h-72 md:h-80">
      <MapContainer
        center={[orgLocation.lat, orgLocation.lng]}
        zoom={11}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Org HQ marker */}
        <Marker position={[orgLocation.lat, orgLocation.lng]} icon={orgIcon}>
          <Popup>
            <div style={{ minWidth: 180 }}>
              <strong style={{ color: '#0ea5e9', fontSize: 14 }}>CleanHike Nepal HQ</strong>
              <br />
              <span style={{ color: '#6b7280', fontSize: 12 }}>Dakshinkali, Kathmandu, Nepal</span>
            </div>
          </Popup>
        </Marker>

        {/* Hike markers */}
        {hikeMarkers.map((hike, index) => (
          <Marker
            key={index}
            position={[hike.lat, hike.lng]}
            icon={hikeIcon}
          >
            <Popup>
              <div style={{ minWidth: 220, maxWidth: 260 }}>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: 14 }}>
                    {hike.name}
                  </span>
                </div>
                <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 6 }}>
                  {hike.location}
                </div>
                <div style={{ color: '#374151', fontSize: 12, lineHeight: 1.4 }}>
                  {hike.description}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">CleanHike HQ — Kathmandu</span>
        </div>
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">4 Completed Hike Locations</span>
        </div>
      </div>
    </div>
  );
}
