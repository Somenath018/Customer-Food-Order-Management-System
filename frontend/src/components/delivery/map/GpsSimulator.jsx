import React, { useState, useEffect, useRef } from 'react';
import { generateWaypoints } from '../../../utils/locationSimulator';
import { deliveryApi } from '../../../api/deliveryApi';
import { useSocket } from '../../../context/SocketContext';
import { Play, Pause, FastForward, RotateCcw, Activity } from 'lucide-react';

export const GpsSimulator = ({
  orderId,
  currentCoords,
  targetCoords,
  onLocationUpdate,
  activeStage
}) => {
  const { socket } = useSocket();
  const [isSimulating, setIsSimulating] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [stepIndex, setStepIndex] = useState(0);

  const waypointsRef = useRef([]);
  const timerRef = useRef(null);

  // Generate waypoints when target or start changes
  useEffect(() => {
    if (currentCoords?.lat && targetCoords?.lat) {
      waypointsRef.current = generateWaypoints(currentCoords, targetCoords, 30);
      setStepIndex(0);
    }
  }, [targetCoords?.lat, targetCoords?.lng, activeStage]);

  // Handle Simulation Loop
  useEffect(() => {
    if (!isSimulating) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.max(250, Math.floor(1200 / speedMultiplier));

    timerRef.current = setInterval(async () => {
      setStepIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= waypointsRef.current.length) {
          setIsSimulating(false);
          clearInterval(timerRef.current);
          return prevIndex;
        }

        const point = waypointsRef.current[nextIndex];
        if (point) {
          // Update parent state
          onLocationUpdate(point);

          // Call API to sync location with Central Backend
          if (orderId) {
            deliveryApi.updateLocation(orderId, point.lat, point.lng).catch(() => {});

            // Socket real-time ping to customer
            if (socket) {
              socket.emit('driver:location_ping', {
                orderId,
                lat: point.lat,
                lng: point.lng
              });
            }
          }
        }
        return nextIndex;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSimulating, speedMultiplier, orderId, onLocationUpdate, socket]);

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setStepIndex(0);
    if (waypointsRef.current.length > 0) {
      onLocationUpdate(waypointsRef.current[0]);
    }
  };

  return (
    <div className="bg-dark-900/90 border border-dark-700 rounded-2xl p-3 sm:p-4 shadow-lg flex items-center justify-between gap-3 text-xs">
      <div className="flex items-center space-x-2.5">
        <div
          className={`p-2 rounded-xl border ${
            isSimulating
              ? 'bg-rider-500/20 text-rider-400 border-rider-500/40 animate-pulse'
              : 'bg-dark-800 text-gray-400 border-dark-700'
          }`}
        >
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h5 className="font-bold text-white flex items-center space-x-1.5">
            <span>GPS Auto-Navigation</span>
            {isSimulating && (
              <span className="w-1.5 h-1.5 rounded-full bg-rider-400 beacon-pulse inline-block"></span>
            )}
          </h5>
          <p className="text-[11px] text-gray-400">
            {isSimulating
              ? `Streaming live coords step ${stepIndex}/${waypointsRef.current.length || 30}`
              : 'Simulate rider motion to destination'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5">
        {/* Speed multiplier toggle */}
        <button
          onClick={() => setSpeedMultiplier((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
          className="px-2 py-1 rounded-lg bg-dark-800 text-gray-300 hover:text-white border border-dark-700 font-mono text-[11px]"
        >
          {speedMultiplier}x
        </button>

        {/* Reset button */}
        <button
          onClick={resetSimulation}
          title="Reset route"
          className="p-1.5 rounded-lg bg-dark-800 text-gray-400 hover:text-white border border-dark-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Start / Pause button */}
        <button
          onClick={toggleSimulation}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl font-bold transition shadow ${
            isSimulating
              ? 'bg-amber-500 hover:bg-amber-600 text-black'
              : 'bg-rider-500 hover:bg-rider-600 text-white'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Simulate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

