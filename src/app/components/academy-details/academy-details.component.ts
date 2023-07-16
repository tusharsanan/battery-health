import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatteryDataService } from '../../services/battery-data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { IBatteryHealthData } from '../../models/batteries.model';

@Component({
  selector: 'app-academy-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './academy-details.component.html',
  styleUrls: ['./academy-details.component.scss'],
})
export class AcademyDetailsComponent implements OnInit {
  constructor(
    private _batteryDataService: BatteryDataService,
    private activatedRoute: ActivatedRoute
  ) {}

  academyBatteryDetails$!: Observable<IBatteryHealthData[]>;

  academyId!: number;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      (params: Params) => (this.academyId = +params['academyId'])
    );

    this.academyBatteryDetails$ = this._batteryDataService
      .getAcademyDetailsWithFaultyBatteries()
      .pipe(
        map((data: IBatteryHealthData[]) =>
          data?.filter(
            (item: IBatteryHealthData): boolean =>
              item.academyId === this.academyId
          )
        )
      );
  }
}
