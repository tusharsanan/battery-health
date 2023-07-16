import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBatteryHealthData, IBattery } from '../models/batteries.model';

@Injectable({
  providedIn: 'root',
})
export class BatteryDataService {
  constructor(private _http: HttpClient) {}

  public academyDetailsWithFaultyBatteries$ = new BehaviorSubject<any>({
    serialNumber: undefined,
    replaceBattery: false,
    academyId: undefined,
  });

  getAcademyDetailsWithFaultyBatteries(): Observable<IBatteryHealthData[]> {
    return this.academyDetailsWithFaultyBatteries$.asObservable();
  }

  public getBatteriesData(): Observable<IBattery[]> {
    return this._http.get<IBattery[]>('/assets/mock/battery-data.json');
  }
}
