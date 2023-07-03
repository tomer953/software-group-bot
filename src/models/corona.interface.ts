export interface CoronaStatisticsResponse {
  get?: string;
  parameters?: any;
  errors?: any;
  response: CoronaCountryData[];
}

export interface CoronaCountryData {
  country: string;
  cases: CoronaCases;
  deaths: CoronaDeaths;
  tests: any;
  day: Date;
  time: Date;
}
export interface CoronaCases {
  new: string;
  active: number;
  critical: number;
  recovered: number;
  total: number;
}
export interface CoronaDeaths {
  new: string;
  total: number;
}
