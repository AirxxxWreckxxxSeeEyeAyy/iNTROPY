export type Radiation = {
  latitude: number;
  longitude: number;
  month: number;
  ghi: number;
  dhi: number;
  location: string;
  period: string;
};
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export type Config = {
  radiation?: Radiation;
  tilt: number;
  area: number;
  panels: number;
  watts: number;
  battery: number;
  direction: string;
  sun: number;
  shade: number;
  ac: number;
  hours: number;
  reserve: number;
  dayRate: number;
  nightRate: number;
  exportRate: number;
  fuel: number;
  burn: number;
  generatorKw: number;
  exportOn: boolean;
  efficiency: number;
  usable: number;
  inverter: number;
};
export const initial: Config = {
  tilt: 25,
  area: 1800,
  panels: 12,
  watts: 420,
  battery: 10.24,
  direction: "South",
  sun: 5,
  shade: 10,
  ac: 2.5,
  hours: 6,
  reserve: 20,
  dayRate: 16,
  nightRate: 24,
  exportRate: 0,
  fuel: 3.5,
  burn: 0.55,
  generatorKw: 3,
  exportOn: false,
  efficiency: 0.9,
  usable: 0.95,
  inverter: 5,
};

export type EnergyResult = ReturnType<typeof import("./model").simulate>;
export type ScenarioCalculation = {
  result: EnergyResult;
  solarOnly: EnergyResult;
};
export type CalculatedScenario = ScenarioCalculation & { config: Config };
export type SolarPreview = {
  poa: { daily: number; hourly: number[] };
  allMonths: number[];
  options: { direction: string; daily: number; hourly: number[] }[];
};
