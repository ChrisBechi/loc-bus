interface IRoute {
  agency_id: number;
  created_at: string;
  route_color: string;
  route_id: string;
  route_long_name: string;
  route_short_name: string;
  route_text_color: string;
  route_type: number;
}

export interface IVehicleFound {
  p: string; // Prefixo do veículo
  t: string; // Horário previsto para chegada do veículo no ponto de parada relacionado
  a: boolean; // Indica se o veículo é (true) ou não (false) acessível para pessoas com deficiência
  ta: string; //  Indica o horário universal (UTC) em que a localização foi capturada. Essa informação está no padrão ISO 8601
  py: number; // Informação de latitude da localização do veículo
  px: number; // Informação de longitude da localização do veículo
}

interface ILineFound {
  c: string; // Letreiro completo
  cl: number; // Código identificador da linha
  sl: number; // Sentido de operação onde 1 significa de Terminal Principal para Terminal Secundário e 2 de Terminal Secundário para Terminal Principal
  lt0: string; //  Letreiro de destino da linha
  lt1: string; //  Letreiro de origem da linha
  qv: number; // Quantidade de veículos localizados
  vs: IVehicleFound[];
}

interface IBusStopForecastNextBus {
  cp: number; // codigo do ponto
  np: string; // nome da parada
  py: number; // Informação de latitude da localização do veículo
  px: number; // Informação de longitude da localização do veículo
  l: ILineFound[]; // Relação de linhas localizadas
}

export interface ITimeNextBus {
  hr: string;
  p: IBusStopForecastNextBus | undefined;
}

export interface IRouteBus {
  route: IRoute;
  nextBusTime: ITimeNextBus;
  lineBus: string;
  direction: string;
  stopBusId: number;
}

export interface IDetailBus {
  cl: number;
  lc: boolean;
  lt: string;
  sl: number;
  tl: number;
  tp: string;
  ts: string;
}
