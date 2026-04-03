import React, { useEffect, useState } from 'react';
import { StatCard } from './components/StatCard';
import { SystemStats, ConnectionStatus } from './types';
import {
  Wifi,
  Activity,
  Car,
  Ruler,
  Zap,
  Video,
  AlertTriangle
} from 'lucide-react';

const API_URL = "http://localhost:8000";

const App: React.FC = () => {
  const [stats, setStats] = useState<SystemStats>({
    car_count: 0,
    distance_cm: 0,
    proximity_mode: 'FAR',
    led_status: 'Static (LED 1)',
    is_recording: true,
    fps: 0
  });

  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.CONNECTING);
  const [beaconConnected, setBeaconConnected] = useState<boolean>(false);
  const [cameraConnected, setCameraConnected] = useState<boolean>(false);
  const [lastHeartbeat, setLastHeartbeat] = useState<number>(Date.now());

  // Fetch Stats Loop
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats({
            car_count: data.car_count,
            distance_cm: data.distance,
            proximity_mode: data.mode,
            led_status: data.mode === 'FAR' ? 'Static (LED 1)' : 'Looping (1-4)',
            is_recording: true,
            fps: data.fps
          });
          setStatus(ConnectionStatus.CONNECTED);
          setLastHeartbeat(Date.now());

          // Use the beacon_active flag from backend
          setBeaconConnected(data.beacon_active || false);

          // Camera is connected if we're getting data
          setCameraConnected(true);
        }
      } catch (error) {
        setStatus(ConnectionStatus.DISCONNECTED);
        setCameraConnected(false);
        setBeaconConnected(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-blue-500" />
            Smart Traffic System
          </h1>
          <p className="text-slate-400 mt-2">ESP32 Beacon Tracking & YOLO Car Detection</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Beacon Connection Status */}
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold ${beaconConnected
            ? 'bg-green-900/30 text-green-400 border border-green-800'
            : 'bg-red-900/30 text-red-400 border border-red-800'
            }`}>
            <Activity size={16} />
            <span>Beacon: {beaconConnected ? 'Active' : 'Searching...'}</span>
          </div>

          {/* Camera Connection Status */}
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold ${cameraConnected
            ? 'bg-blue-900/30 text-blue-400 border border-blue-800'
            : 'bg-red-900/30 text-red-400 border border-red-800'
            }`}>
            <Video size={16} />
            <span>Camera: {cameraConnected ? 'Connected' : 'Offline'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Video Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative aspect-video">
            {status === ConnectionStatus.CONNECTED ? (
              <>
                <img
                  src={`${API_URL}/video_feed`}
                  alt="Live Analysis Feed"
                  className="w-full h-full object-contain bg-black"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-mono text-green-400 border border-green-500/30 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  REC
                  <span className="border-l border-white/20 pl-2 ml-2">{stats.fps} FPS</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                <Video size={64} className="mb-4 opacity-50" />
                <p>Waiting for Python Server...</p>
                <p className="text-sm mt-2 font-mono bg-slate-900 p-2 rounded">Run: python server/main.py</p>
              </div>
            )}
          </div>

          {/* Logic Explanation Card */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" />
              Logic Flow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div className={`p-4 rounded-lg border transition-all ${stats.proximity_mode === 'FAR' ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-900 border-slate-700 opacity-50'}`}>
                <strong className="block text-blue-400 mb-1">Mode: FAR (&gt; 30cm)</strong>
                <p>Beacon is distant. ESP-CAM sets <strong>LED 1 Static ON</strong>.</p>
              </div>
              <div className={`p-4 rounded-lg border transition-all ${stats.proximity_mode === 'NEAR' ? 'bg-purple-900/20 border-purple-500' : 'bg-slate-900 border-slate-700 opacity-50'}`}>
                <strong className="block text-purple-400 mb-1">Mode: NEAR (&lt; 30cm)</strong>
                <p>Beacon is close. ESP-CAM <strong>loops LEDs 1-4</strong> (5s interval).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statistics */}
        <div className="space-y-4">
          <StatCard
            title="Total Cars Detected"
            value={stats.car_count}
            icon={<Car className="text-blue-500" />}
          />

          <StatCard
            title="Beacon Distance"
            value={`${stats.distance_cm} cm`}
            subValue={stats.distance_cm > 900 ? "(Out of range)" : ""}
            icon={<Ruler className="text-orange-500" />}
            alert={stats.distance_cm < 30}
          />

          <div className="p-6 rounded-xl border bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">LED Status</h3>
              <Zap className={`text-yellow-400 ${stats.proximity_mode === 'NEAR' ? 'animate-pulse' : ''}`} />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold text-xl">{stats.led_status}</span>
              </div>

              {/* LED Visualizer */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${stats.proximity_mode === 'FAR'
                    ? (i === 1 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-700')
                    : 'bg-green-500/50 animate-pulse' // Simplified visualizer for loop mode
                    }`}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs mt-8">
            <h4 className="text-slate-300 font-bold mb-2 flex items-center gap-2">
              <AlertTriangle size={14} className="text-yellow-500" />
              Deployment Notes
            </h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Upload <code>firmware/esp32_beacon.ino</code> to ESP32.</li>
              <li>Upload <code>firmware/esp32_cam.ino</code> to ESP32-CAM.</li>
              <li>Install Python deps: <code>pip install fastapi uvicorn ultralytics opencv-python bleak requests</code>.</li>
              <li>Update IP in <code>server/main.py</code>.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;