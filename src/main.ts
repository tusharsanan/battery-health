import { AppComponent } from './app/app.component';

import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { RouterModule } from '@angular/router';

import { routes } from './app/routes';
import { BatteryDataService } from './app/services/battery-data.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)),
    importProvidersFrom(HttpClientModule),
    BatteryDataService,
  ],
}).catch((err) => console.error(err));
