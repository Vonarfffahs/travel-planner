import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { StoreState } from '../../../store';
import { RoutingControl } from './RoutingControl';
import { historicPlacesAPI } from '../../../api';
import { setHistoricPlaces } from '../../../store/tripSlice';

import 'leaflet/dist/leaflet.css';

export const TripMap = () => {
  const ukrainesPositionOnPage: [number, number] = [49.0, 27.0];
  const mapStyles = { height: '100vh', width: '100%', zIndex: 0 };
  const zoomLevel: number = 6;
  const trip = useSelector((state: StoreState) => state.trip.calculatedTrip);

  const dispatch = useDispatch();
  const historicPlacesData = useSelector(
    (state: StoreState) => state.trip.historicPlaces,
  );

  useEffect(() => {
    const fetchHistoricPlaces = async () => {
      if (historicPlacesData.length > 0) return;

      try {
        const response = await historicPlacesAPI.getHistoricPlaces();
        dispatch(setHistoricPlaces(response.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistoricPlaces();
  }, [historicPlacesData.length, dispatch]);

  useEffect(() => {
    console.log(historicPlacesData);
  }, [historicPlacesData]);

  return (
    <MapContainer
      center={ukrainesPositionOnPage}
      zoom={zoomLevel}
      style={mapStyles}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {trip
        ? trip.path.map((place) => {
            return (
              <Marker key={place.id} position={[place.coordY, place.coordX]}>
                <Popup>
                  {place.name} <br />
                  VisitOrder: {place.visitOrder}
                </Popup>
              </Marker>
            );
          })
        : historicPlacesData.map((place) => {
            return (
              <Marker key={place.id} position={[place.coordY, place.coordX]}>
                <Popup>{place.name}</Popup>
              </Marker>
            );
          })}

      <RoutingControl />
    </MapContainer>
  );
};
