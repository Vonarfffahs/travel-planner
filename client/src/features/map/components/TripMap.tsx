import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { RoutingControl } from './RoutingControl';

// Обов'язково треба задати висоту контейнера карти
const mapStyles = { height: '100vh', width: '100%' };

// Мок-дані для тематичної подорожі історичними містами України
// Зіставлення з БД: lat = coordY (широта), lng = coordX (довгота)
const optimizedRoute = [
  { lat: 50.4501, lng: 30.5234, name: 'Київ' },
  { lat: 51.4982, lng: 31.2893, name: 'Чернігів' },
  { lat: 50.7412, lng: 25.3254, name: 'Луцьк' },
  { lat: 49.8397, lng: 24.0297, name: 'Львів' },
  { lat: 48.6208, lng: 22.2879, name: 'Ужгород' },
  { lat: 48.2915, lng: 25.9348, name: 'Чернівці' },
  { lat: 48.6708, lng: 26.5806, name: "Кам'янець-Подільський" },
  { lat: 46.4825, lng: 30.7233, name: 'Одеса' },
];

export const TripMap = () => {
  return (
    // Центруємо карту приблизно посередині України з меншим зумом (zoom={6})
    <MapContainer center={[49.0, 31.0]} zoom={6} style={mapStyles}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Передаємо точки маршруту в наш кастомний компонент */}
      <RoutingControl points={optimizedRoute} />
    </MapContainer>
  );
};
