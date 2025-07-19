import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState, useRef } from 'react';
import { FaPlay, FaPause, FaMapMarkerAlt } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

const vehicleIcon = new L.Icon({
  iconUrl: '/image.png', 
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  className: 'vehicle-icon'
});

function MapView() {
  const [route, setRoute] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch('/dummy-route.json')
      .then(res => res.json())
      .then(data => setRoute(data));
  }, []);

  useEffect(() => {
    if (playing && route.length > 0) {
      intervalRef.current = setInterval(() => {
        setIndex(prev => (prev < route.length - 1 ? prev + 1 : prev));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, route]);

  if (route.length === 0) return <p>Loading route...</p>;

  const currentPosition = [route[index].latitude, route[index].longitude];
  const pathSoFar = route.slice(0, index + 1).map(p => [p.latitude, p.longitude]);

  return (
    <div className="map-wrapper">
      <MapContainer
        center={currentPosition}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={currentPosition} icon={vehicleIcon} />
        <Polyline positions={pathSoFar} color="dodgerblue" weight={5} opacity={0.8} />
      </MapContainer>

      <div className="control-panel">
        <button onClick={() => setPlaying(!playing)}>
          {playing ? <><FaPause /> Pause</> : <><FaPlay /> Play</>}
        </button>
        <div className="info">
          <FaMapMarkerAlt />
          <span>{currentPosition[0].toFixed(5)}, {currentPosition[1].toFixed(5)}</span>
        </div>
      </div>
    </div>
  );
}

export default MapView;
