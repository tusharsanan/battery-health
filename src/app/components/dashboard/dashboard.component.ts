import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { catchError, map, Observable, throwError } from 'rxjs';

import { BatteryDataService } from '../../services/battery-data.service';
import { untilDestroyed } from '../../utils/common.utils';
import {
  IBattery,
  IBatteryHealthData,
  IFormattedBatteriesData,
  IFormattedBatteryData,
} from '../../models/batteries.model';

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
        if (res[val.academyId]) {
          res[val.academyId]++;
        } else {
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

        const averageBatteryConsumption: number = this.getAverage(data);

        const { serialNumber, academyId } = data[0];

        if (isNaN(averageBatteryConsumption)) {
          this.batteriesHealthData.push({
            serialNumber,
            replaceBattery: undefined,
            academyId,
          });
          return;
        }

        this.batteriesHealthData.push({
          serialNumber,
          replaceBattery: averageBatteryConsumption > 0.3,
          academyId,
        });
      }
    );

    this._batteryDataService.academyDetailsWithFaultyBatteries$.next(
      this.batteriesHealthData
    );
  }

  private getAverage(data: IFormattedBatteryData[]) {
    const intervals: { diff: number; timeDiff: number }[] = [];

    for (let i: number = 1; i < data.length; i++) {
      const currentData: IFormattedBatteryData = data[i - 1];
      const previousData: IFormattedBatteryData = data[i];

      const diff = +(
        currentData.batteryLevel - previousData.batteryLevel
      ).toFixed(2);

      const timeDiff = this.diffMinutes(
        currentData.timestamp,
        previousData.timestamp
      );

      intervals.push({ diff, timeDiff });
    }

    let sum: number = 0;
    let totalWeight: number = 0;

    for (const interval of intervals) {
      if (interval.diff <= 0) {
        continue; // Exclude intervals where battery level increases
      }

      const weight: number = +(
        interval.timeDiff /
        (1000 * 60 * 60 * 24)
      ).toFixed(2); // Intervals weighted by duration (in days)

      sum += interval.diff * weight;
      totalWeight += weight;
    }

    return sum / totalWeight;
  }

  public diffMinutes(date1: string, date2: string): number {
    const d1: Date = new Date(date1);
    const d2: Date = new Date(date2);
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
