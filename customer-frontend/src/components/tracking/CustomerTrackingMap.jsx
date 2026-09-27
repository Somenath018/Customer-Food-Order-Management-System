import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Bike, Store, MapPin } from 'lucide-react';

const createIcon = (svgString, className = '') => {
  return L.divIcon({
    html: `<div class="${className}">${svgString}</div>`,
    className: 'custom-customer-map-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

const driverSvg = `
  <div style="background:#10b981; border:3px solid #ffffff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(16,185,129,0.5); transform:rotate(-5deg);">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
    </svg>
  </div>
`;

const restaurantSvg = `
  <div style="background:#f97316; border:3px solid #ffffff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(249,115,22,0.5);">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
    </svg>
  </div>
`;

const customerSvg = `
  <div style="background:#ef4444; border:3px solid #ffffff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(239,68,68,0.5);">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  </div>
`;

export const CustomerTrackingMap = ({
  restaurantCoords = { lat: 40.7192, lng: -73.9972 },
  customerCoords = { lat: 40.7280, lng: -73.9850 },
  driverCoords,
  height = '320px'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const center = [restaurantCoords.lat, restaurantCoords.lng];
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Reset markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add Restaurant Marker
    const restMarker = L.marker([restaurantCoords.lat, restaurantCoords.lng], {
      icon: createIcon(restaurantSvg)
    }).addTo(map);
    restMarker.bindPopup('<strong style="color:#000">Restaurant Kitchen</strong>');

    // Add Customer Marker
    const custMarker = L.marker([customerCoords.lat, customerCoords.lng], {
      icon: createIcon(customerSvg)
    }).addTo(map);
    custMarker.bindPopup('<strong style="color:#000">Delivery Address</strong>');

    // Add Driver Marker if assigned
    if (driverCoords?.lat && driverCoords?.lng) {
      const drvMarker = L.marker([driverCoords.lat, driverCoords.lng], {
        icon: createIcon(driverSvg)
      }).addTo(map);
      drvMarker.bindPopup('<strong style="color:#000">Rider On The Way 🛵</strong>');
      driverMarkerRef.current = drvMarker;

      // Draw route connecting Driver -> Customer
      const routeLine = L.polyline(
        [
          [driverCoords.lat, driverCoords.lng],
          [customerCoords.lat, customerCoords.lng]
        ],
        { color: '#10b981', weight: 4, dashArray: '6, 8', opacity: 0.8 }
      ).addTo(map);
      routeLineRef.current = routeLine;

      const group = L.featureGroup([restMarker, custMarker, drvMarker]);
      map.fitBounds(group.getBounds(), { padding: [40, 40] });
    } else {
      // Draw route connecting Restaurant -> Customer
      const routeLine = L.polyline(
        [
          [restaurantCoords.lat, restaurantCoords.lng],
          [customerCoords.lat, customerCoords.lng]
        ],
        { color: '#f97316', weight: 3, dashArray: '6, 8', opacity: 0.7 }
      ).addTo(map);
      routeLineRef.current = routeLine;

      const group = L.featureGroup([restMarker, custMarker]);
      map.fitBounds(group.getBounds(), { padding: [40, 40] });
    }
  }, [restaurantCoords.lat, restaurantCoords.lng, customerCoords.lat, customerCoords.lng]);

  // Live driver movement update
  useEffect(() => {
    if (driverMarkerRef.current && driverCoords?.lat && driverCoords?.lng) {
      driverMarkerRef.current.setLatLng([driverCoords.lat, driverCoords.lng]);
    }
  }, [driverCoords]);

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: '100%' }}
      className="rounded-2xl overflow-hidden shadow-inner border border-dark-700"
    />
  );
};
