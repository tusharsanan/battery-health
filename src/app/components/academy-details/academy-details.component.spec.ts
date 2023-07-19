import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyDetailsComponent } from './academy-details.component';
import { DebugElement } from '@angular/core';
import { BatteryDataService } from '../../services/battery-data.service';
import Spy = jasmine.Spy;
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('AcademyDetailsComponent', () => {
  let component: AcademyDetailsComponent;
  let fixture: ComponentFixture<AcademyDetailsComponent>;
  let debugElement: DebugElement;
  let batteryDataService: BatteryDataService;
  let getAcademyDetailsWithFaultyBatteriesSpy: Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AcademyDetailsComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    });
    fixture = TestBed.createComponent(AcademyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;

    batteryDataService = debugElement.injector.get(BatteryDataService);

    getAcademyDetailsWithFaultyBatteriesSpy = spyOn(
      batteryDataService,
      'getAcademyDetailsWithFaultyBatteries'
    ).and.returnValue(
      of([
        {
          serialNumber: 'TT-C67ML-A-0001-02573',
          replaceBattery: true,
          academyId: 30015,
        },
        {
          serialNumber: '1805C67HD02139',
          replaceBattery: undefined,
          academyId: 30015,
        },
        {
          serialNumber: '1805C67HD02212',
          replaceBattery: false,
          academyId: 30015,
        },
      ])
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the healthy batteries column', () => {
    component.ngOnInit();
    component.academyId = 30015;

    fixture.detectChanges();

    const healthyBatteries = debugElement.queryAll(
      By.css('.academy_details--healthy_batteries_block ul li')
    );

    expect(healthyBatteries.length).toEqual(1);
  });

  it('should render the unhealthy batteries column', () => {
    component.ngOnInit();
    component.academyId = 30015;

    fixture.detectChanges();

    const unhealthyBatteries = debugElement.queryAll(
      By.css('.academy_details--unhealthy_batteries_block ul li')
    );

    expect(unhealthyBatteries.length).toEqual(1);
  });

  it('should render the unknown batteries column', () => {
    component.ngOnInit();
    component.academyId = 30015;

    fixture.detectChanges();

    const unknownBatteries = debugElement.queryAll(
      By.css('.academy_details--unknown_batteries_block ul li')
    );

    expect(unknownBatteries.length).toEqual(1);
  });
});
