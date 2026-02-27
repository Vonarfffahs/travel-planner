import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useMap } from 'react-leaflet';

interface RoutingControlProps {
  points: { lat: number; lng: number }[];
}

export const RoutingControl = ({ points }: RoutingControlProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || points.length < 2) return;

    // Перетворюємо наші координати у формат Leaflet
    const waypoints = points.map((p) => L.latLng(p.lat, p.lng));

    // Створюємо контроллер маршруту
    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: false, // Вимикаємо перетягування маршруту для диплома
      showAlternatives: false,
      fitSelectedRoutes: true, // Карта сама відцентрується по маршруту
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 5 }],
        extendToWaypoints: true, // Вирішує помилку TS: гарантує, що лінія дотягнеться до маркера
        missingRouteTolerance: 0, // Вирішує помилку TS: допуск на відсутність фрагментів дороги // Гарний синій колір
      },
      // Вимикаємо додавання нових точок кліком по карті
      addWaypoints: false,
    }).addTo(map);

    // Очищення при розмонтуванні компонента
    return () => {
      if (map) {
        map.removeControl(routingControl);
      }
    };
  }, [map, points]);

  return null;
};
