export interface SystemStats {
  car_count: number;
  distance_cm: number;
  proximity_mode: 'NEAR' | 'FAR';
  led_status: string;
  is_recording: boolean;
  fps: number;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
}