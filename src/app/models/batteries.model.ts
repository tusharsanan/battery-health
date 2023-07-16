export interface IBattery {
  academyId: number;
  batteryLevel: number;
  employeeId: string;
  serialNumber: string;
  timestamp: string;
}

export interface IFormattedBatteriesData {
  [key: string]: IFormattedBatteryData[];
}

export interface IFormattedBatteryData {
  batteryLevel: number;
  timestamp: string;
  serialNumber: string;
  academyId: number;
}

export interface IBatteryHealthData {
  serialNumber: string;
  replaceBattery: boolean | undefined;
  academyId: number;
}
