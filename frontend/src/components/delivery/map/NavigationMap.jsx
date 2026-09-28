import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, ExternalLink, Compass } from 'lucide-react';

// Custom SVG Icons for Leaflet
const createIcon = (svgString, className = '') => {
  return L.divIcon({
    html: `<div class="${className}">${svgString}</div>`,
    className: 'custom-map-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

const driverSvg = `
  <div style="background:linear-gradient(135deg, #FF5200, #E23744); border:3px solid #ffffff; border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(255,82,0,0.6); transform:rotate(-8deg);">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
    </svg>
  </div>
`;

const restaurantSvg = `
  <div style="background:#f59e0b; border:3px solid #ffffff; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(245,158,11,0.5);">
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

export const NavigationMap = ({
  driverCoords,
  restaurantCoords,
  customerCoords,
  activeStage = 'heading_to_restaurant',
  height = '350px'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const center = [driverCoords.lat || 12.9345, driverCoords.lng || 77.6205];
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      // Dark style OpenStreetMap / CartoDB Dark Matter tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers & polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add Restaurant Marker
    if (restaurantCoords?.lat && restaurantCoords?.lng) {
      const restMarker = L.marker([restaurantCoords.lat, restaurantCoords.lng], {
        icon: createIcon(restaurantSvg)
      }).addTo(map);
      restMarker.bindPopup('<strong style="color:#000">Pickup: Restaurant Kitchen</strong>');
    }

    // Add Customer Marker
    if (customerCoords?.lat && customerCoords?.lng) {
      const custMarker = L.marker([customerCoords.lat, customerCoords.lng], {
        icon: createIcon(customerSvg)
      }).addTo(map);
      custMarker.bindPopup('<strong style="color:#000">Dropoff: Customer Doorstep</strong>');
    }

    // Add Driver Marker
    if (driverCoords?.lat && driverCoords?.lng) {
      const drvMarker = L.marker([driverCoords.lat, driverCoords.lng], {
        icon: createIcon(driverSvg)
      }).addTo(map);
      drvMarker.bindPopup('<strong style="color:#000">Your Location (Arjun • Foodie Partner)</strong>');
      driverMarkerRef.current = drvMarker;
    }

    // Draw Route Polyline
    const points = [];
    if (driverCoords?.lat) points.push([driverCoords.lat, driverCoords.lng]);

    // If heading to restaurant, draw to restaurant first
    if (activeStage === 'heading_to_restaurant' || activeStage === 'at_restaurant') {
      if (restaurantCoords?.lat) points.push([restaurantCoords.lat, restaurantCoords.lng]);
    } else {
      // Picked up / on the way -> route to customer
      if (customerCoords?.lat) points.push([customerCoords.lat, customerCoords.lng]);
    }

    if (points.length >= 2) {
      routeLineRef.current = L.polyline(points, {
        color: '#FF5200',
        weight: 5,
        opacity: 0.9,
        dashArray: '2, 6'
      }).addTo(map);

      // Fit bounds nicely
      map.fitBounds(L.latLngBounds(points), { padding: [40, 40] });
    }

    return () => {};
  }, [restaurantCoords, customerCoords, activeStage]);

  // Update driver marker position smoothly when driverCoords changes
  useEffect(() => {
    if (driverMarkerRef.current && driverCoords?.lat && driverCoords?.lng) {
      driverMarkerRef.current.setLatLng([driverCoords.lat, driverCoords.lng]);
    }
  }, [driverCoords]);

  const recenter = () => {
    if (mapInstanceRef.current && driverCoords?.lat) {
      mapInstanceRef.current.setView([driverCoords.lat, driverCoords.lng], 16, { animate: true });
    }
  };

  const openGoogleMaps = () => {
    const dest =
      activeStage === 'heading_to_restaurant' || activeStage === 'at_restaurant'
        ? restaurantCoords
        : customerCoords;
    if (dest?.lat) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`,
        '_blank'
      );
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-dark-700 shadow-xl" style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Control Overlay */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col space-y-2">
        <button
          onClick={recenter}
          title="Recenter on My Location"
          className="p-2.5 rounded-xl bg-dark-900/90 hover:bg-dark-800 text-[#ff7332] border border-dark-700 shadow-lg backdrop-blur-md transition cursor-pointer"
        >
          <Compass className="w-5 h-5" />
        </button>
        <button
          onClick={openGoogleMaps}
          title="Open in Google Maps"
          className="p-2.5 rounded-xl bg-dark-900/90 hover:bg-dark-800 text-blue-400 border border-dark-700 shadow-lg backdrop-blur-md transition cursor-pointer"
        >
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>

      {/* Current Destination indicator */}
      <div className="absolute bottom-3 left-3 z-[400] bg-dark-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-dark-700 text-xs flex items-center space-x-2 shadow-lg">
        <Navigation className="w-3.5 h-3.5 text-[#FF5200] animate-spin" />
        <span className="font-semibold text-white">
          Navigating to:{' '}
          <span className="text-[#ff7332] font-bold">
            {activeStage === 'heading_to_restaurant' || activeStage === 'at_restaurant'
              ? 'Restaurant (Pickup)'
              : 'Customer (Dropoff Doorstep)'}
          </span>
        </span>
      </div>
    </div>
  );
};
