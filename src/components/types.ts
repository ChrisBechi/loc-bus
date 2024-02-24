export interface IStopBus {
  stop_id: number;
  stop_name: string;
  stop_desc: string;
  stop_lat: string;
  stop_lon: string;
}

export interface ILinesInCurrentBuStop {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: number;
  stop_sequence: number;
}

export interface ICoords {
  latitude: number;
  longitude: number;
}
