import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { BatteryDataService } from './battery-data.service';

import { IBattery } from '../models/batteries.model';

describe('BatteryDataService', () => {
  let service: BatteryDataService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpTestingController = TestBed.get(HttpTestingController);

    service = TestBed.inject(BatteryDataService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the batteries data', (done) => {
    const expectedData: IBattery[] = [
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
    ];

    service.getBatteriesData().subscribe((data: IBattery[]) => {
      expect(data).toEqual(expectedData);
      done();
    });

    const testRequest = httpTestingController.expectOne(
      '/assets/mock/battery-data.json'
    );

    testRequest.flush(expectedData);
  });

  it('getBatteriesData should use GET to retrieve data', (done) => {
    service.getBatteriesData().subscribe();

    const testRequest = httpTestingController.expectOne(
      '/assets/mock/battery-data.json'
    );

    expect(testRequest.request.method).toEqual('GET');
    done();
  });
});
