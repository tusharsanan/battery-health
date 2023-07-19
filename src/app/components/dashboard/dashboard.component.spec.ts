import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { BatteryDataService } from '../../services/battery-data.service';
import Spy = jasmine.Spy;
import { of } from 'rxjs';
import { IFormattedBatteriesData } from '../../models/batteries.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let debugElement: DebugElement;
  let batteryDataService: BatteryDataService;
  let getBatteriesSpy: Spy;

  const formattedBatteryDataMock: IFormattedBatteriesData = {
    '1805C67HD02332': [
      {
        batteryLevel: 0.5,
        timestamp: '2019-05-17T07:57:08.29+01:00',
        serialNumber: '1805C67HD02332',
        academyId: 30006,
      },
    ],
    'TT-C67ML-A-0001-01429': [
      {
        batteryLevel: 0.68,
        timestamp: '2019-05-17T07:57:58.979+01:00',
        serialNumber: 'TT-C67ML-A-0001-01429',
        academyId: 30006,
      },
      {
        academyId: 30006,
        batteryLevel: 0.3,
        serialNumber: 'TT-C67ML-A-0001-01429',
        timestamp: '2019-05-17T10:57:58.979+01:00',
      },
    ],
    '1805C67HD02333': [
      Object({
        batteryLevel: 0.5,
        timestamp: '2019-05-17T07:57:08.29+01:00',
        serialNumber: '1805C67HD02333',
        academyId: 30007,
      }),
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;

    batteryDataService = debugElement.injector.get(BatteryDataService);

    getBatteriesSpy = spyOn(
      batteryDataService,
      'getBatteriesData'
    ).and.returnValue(
      of([
        {
          academyId: 30006,
          batteryLevel: 0.5,
          employeeId: 'T1001417',
          serialNumber: '1805C67HD02332',
          timestamp: '2019-05-17T07:57:08.29+01:00',
        },
        {
          academyId: 30006,
          batteryLevel: 0.68,
          employeeId: 'T1001820',
          serialNumber: 'TT-C67ML-A-0001-01429',
          timestamp: '2019-05-17T07:57:58.979+01:00',
        },
        {
          academyId: 30006,
          batteryLevel: 0.3,
          employeeId: 'T1001820',
          serialNumber: 'TT-C67ML-A-0001-01429',
          timestamp: '2019-05-17T10:57:58.979+01:00',
        },
        {
          academyId: 30007,
          batteryLevel: 0.5,
          employeeId: 'T1001417',
          serialNumber: '1805C67HD02333',
          timestamp: '2019-05-17T07:57:08.29+01:00',
        },
      ])
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get and format the batteries data when the page loads', () => {
    component.ngOnInit();
    expect(getBatteriesSpy).toHaveBeenCalled();
  });

  it('should format the batteries data on page load', () => {
    component.ngOnInit();

    component.formatBatteriesData().subscribe((data) => {
      expect(data).toEqual(formattedBatteryDataMock);
    });
  });

  it('should call checkBatteriesHealthStatus on page load with the formatted data', () => {
    const checkBatteriesHealthStatusSpy = spyOn(
      component,
      'checkBatteriesHealthStatus'
    );

    component.ngOnInit();

    expect(checkBatteriesHealthStatusSpy).toHaveBeenCalledWith(
      formattedBatteryDataMock
    );
  });

  it('should mark the replaceBattery status as undefined if there is only one data set available', () => {
    component.ngOnInit();

    expect(component.batteriesHealthData).toContain({
      academyId: 30007,
      replaceBattery: undefined,
      serialNumber: '1805C67HD02333',
    });
  });

  it('should mark the battery status as replace: true if the battery is consumed more than 30% in 24 hours as average', () => {
    component.ngOnInit();

    expect(component.batteriesHealthData).toEqual([
      {
        academyId: 30006,
        replaceBattery: undefined,
        serialNumber: '1805C67HD02332',
      },
      {
        academyId: 30006,
        replaceBattery: true,
        serialNumber: 'TT-C67ML-A-0001-01429',
      },
      {
        academyId: 30007,
        replaceBattery: undefined,
        serialNumber: '1805C67HD02333',
      },
    ]);
  });
});
