import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useSelector } from 'react-redux';
import type { StoreState } from '../../../store';
import { useEffect } from 'react';

export const RoutingControl = () => {
  const map = useMap();

  const trip = useSelector((state: StoreState) => state.trip.calculatedTrip);

  const routeLineStyles = [{ color: '#2563eb', weight: 4, opacity: 0.8 }];

  useEffect(() => {
    if (!trip || trip.path.length < 2) return;

    // 1. Формуємо масив точок для плагіна
    const waypoints = trip.path.map(
      (place) => L.latLng(place.coordY, place.coordX), // [lat, lng]
    );

    // 2. Створюємо контроль маршруту
    const routingControl = L.Routing.control({
      waypoints,
      lineOptions: {
        styles: routeLineStyles,
        extendToWaypoints: true,
        missingRouteTolerance: 0,
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      createMarker: () => null,
    } as L.Routing.RoutingControlOptions & { createMarker: () => null }).addTo(
      map,
    ); // createMarker in type L.Routing.control() is not specified

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, trip]);

  return null;
};
