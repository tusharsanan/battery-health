import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { untilDestroyed } from '../../utils/common.utils';
import { BatteryDataService } from '../../services/battery-data.service';
import {
  IBatteryHealthData,
  IBattery,
  IFormattedBatteriesData,
  IFormattedBatteryData,
} from '../../models/batteries.model';
import { catchError, map, Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
})
export class DashboardComponent implements OnInit {
  constructor(private _batteryDataService: BatteryDataService) {}

  private untilDestroyed = untilDestroyed();

  public batteriesData$!: Observable<IBattery[]>;
  public batteriesHealthData: IBatteryHealthData[] = [];
  public sortedAcademiesByBatteryFaults: [string, number][] = [];

  public isError: boolean = false;

  public ngOnInit(): void {
    this.batteriesData$ = this._batteryDataService.getBatteriesData();

    this.formatBatteriesData();

    this.formatBatteriesData()
      .pipe(
        this.untilDestroyed(),
        catchError((err) => {
          this.isError = true;
          return throwError(err);
        })
      )
      .subscribe(
        (data: IFormattedBatteriesData): void => {
          this.checkBatteriesHealthStatus(data);
          this.sortAcademiesByBatteryFaults();
        },
        (error) => console.log('Error occurred while fetching data', error)
      );
  }

  public sortAcademiesByBatteryFaults(): void {
    const count: { [key: number]: number } = this.batteriesHealthData.reduce(
      (res: { [key: number]: number }, val: IBatteryHealthData) => {
        if (res[val.academyId] && val.replaceBattery) {
          res[val.academyId]++;
        } else if (val.replaceBattery) {
          res[val.academyId] = 1;
        } else if (!res[val.academyId] && !val.replaceBattery) {
          res[val.academyId] = 0;
        }
        return res;
      },
      {}
    );

    this.sortedAcademiesByBatteryFaults = Object.entries(count).sort(
      (a: [string, number], b: [string, number]) => b[1] - a[1]
    );
  }

  public formatBatteriesData(): Observable<IFormattedBatteriesData> {
    return this.batteriesData$.pipe(
      map((data: IBattery[]) =>
        data.reduce((acc: IFormattedBatteriesData, battery: IBattery) => {
          if (!acc[battery.serialNumber]) {
            acc[battery.serialNumber] = [];
          }

          acc[battery.serialNumber].push({
            batteryLevel: battery.batteryLevel,
            timestamp: battery.timestamp,
            serialNumber: battery.serialNumber,
            academyId: battery.academyId,
          });
          return acc;
        }, {})
      )
    );
  }
  //
  // private getDataPointsForCalculation(data: IFormattedBatteryData[]): {
  //   initialDataPoint: IFormattedBatteryData;
  //   finalDataPoint: IFormattedBatteryData;
  // } {
  //   let initialDataPoint: IFormattedBatteryData = data[0];
  //   let finalDataPoint!: IFormattedBatteryData;
  //
  //   for (let i: number = 1; i < data.length; i++) {
  //     if (data[i].batteryLevel > data[i - 1].batteryLevel) {
  //       finalDataPoint = data[i - 1];
  //
  //       if (initialDataPoint.batteryLevel === finalDataPoint.batteryLevel) {
  //         continue;
  //       }
  //
  //       const result: boolean = this.shouldReplaceBattery(
  //         initialDataPoint,
  //         finalDataPoint
  //       );
  //
  //       if (!result && data[i + 1]) {
  //         initialDataPoint = data[i];
  //         continue;
  //       }
  //       break;
  //     } else {
  //       finalDataPoint = data[i];
  //     }
  //   }
  //
  //   return {
  //     initialDataPoint,
  //     finalDataPoint,
  //   };
  // }

  public checkBatteriesHealthStatus(
    formattedBatteryData: IFormattedBatteriesData
  ): void {
    Object.values(formattedBatteryData).forEach(
      (data: IFormattedBatteryData[]): void => {
        // If only one record for a particular battery
        if (data.length <= 1) {
          const { serialNumber, academyId } = data[0];

          this.batteriesHealthData.push({
            serialNumber,
            replaceBattery: undefined,
            academyId,
          });

          return;
        }

        const avg = this.getAverage(data);

        console.log(avg);
        console.log(avg);

        const { serialNumber, academyId } = data[0];

        if (isNaN(avg)) {
          this.batteriesHealthData.push({
            serialNumber,
            replaceBattery: undefined,
            academyId,
          });
          return;
        }

        if (avg > 0.3) {
          this.batteriesHealthData.push({
            serialNumber,
            replaceBattery: true,
            academyId,
          });
        } else {
          this.batteriesHealthData.push({
            serialNumber,
            replaceBattery: false,
            academyId,
          });
        }

        // const { initialDataPoint, finalDataPoint } =
        //   this.getDataPointsForCalculation(data);
        //
        // const result: boolean = this.shouldReplaceBattery(
        //   initialDataPoint,
        //   finalDataPoint
        // );
        //
        // this.batteriesHealthData.push({
        //   serialNumber: initialDataPoint.serialNumber,
        //   replaceBattery: result,
        //   academyId: initialDataPoint.academyId,
        // });

        console.log(this.batteriesHealthData);
      }
    );

    this._batteryDataService.academyDetailsWithFaultyBatteries$.next(
      this.batteriesHealthData
    );
  }

  public getAverage(data: IFormattedBatteryData[]) {
    const intervals = [];

    for (let i = 1; i < data.length; i++) {
      const currentDevice = data[i - 1];
      const previousDevice = data[i];

      const diff = +(
        currentDevice.batteryLevel - previousDevice.batteryLevel
      ).toFixed(2);
      const timeDiff = this.diffMinutes(
        currentDevice.timestamp,
        previousDevice.timestamp
      );
      const interval = { diff, timeDiff };

      intervals.push(interval);
    }

    let sum = 0;
    let totalWeight = 0;
    let timeDiff = 0;

    for (const interval of intervals) {
      if (interval.diff <= 0) {
        continue; // Exclude intervals where battery level increases
      }

      const weight = +(interval.timeDiff / (1000 * 60 * 60 * 24)).toFixed(2); // Intervals weighted by duration (in days)
      sum += +(interval.diff * weight).toFixed(2);
      totalWeight += weight;

      // timeDiff += interval.timeDiff;
    }

    // const test = 24 / (timeDiff / 3600000);
    // return (sum / totalWeight) * test;
    return sum / totalWeight;
  }

  public diffMinutes(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.round(d2.valueOf() - d1.valueOf());
  }

  public getColourClass(numberOfFaultyBatteries: number): string {
    if (numberOfFaultyBatteries === 0) {
      return 'none';
    } else if (numberOfFaultyBatteries > 0 && numberOfFaultyBatteries <= 2) {
      return 'low';
    } else if (numberOfFaultyBatteries >= 3 && numberOfFaultyBatteries <= 4) {
      return 'medium';
    } else {
      return 'high';
    }
  }
}
