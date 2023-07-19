# BatteryHealth

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.2. This Application is using the standalone angular components. Styling is done using scss.

The application includes 2 main pages:

1) Dashboard page -> Here, all the academies are listed and sorted based on the number of batteries issues they have. If the battery issues are high, then the academy will be at the first and would be red in colour. If the academy has medium number of issues, it will be displayed in orange and if an academy has less issues, it will be at last and will display in yellow. If the academy has no battery issues, it will be green in colour.
2) Academy details page -> Here, all the batteries in the particular academy will be listed and divided into 3 categories namely healthy, unhealthy or unknown batteries. The battery will be in healthy category if it uses < 30% of charge on an average in a day. If the battery uses > 30% of charge on an average daily, it is considered unhealthy. If there is only one data point available for the calculation for a particular battery, then it is declared in Unknown category.

This app uses the weighted average formula to calculate the average daily battery consumption for a particular battery. The weighted mechanism used is interval weighted by duration (in days).

Steps used to calculate average:
1) All data points for the week are considered.
2) If the battery level increases during the interval, that interval is ignored.
3) The data points are divided into intervals. So, if there are 10 data points for a battery and if there is no increase of battery level in those 10 data points, the number of intervals will be 9.
4) For each interval (n and n+1), the battery level difference and the time difference is calculated.
5) Once all the battery level difference and the time difference are known for each interval, next step is to calculate the average.
6) For each interval, a weight is assigned. The weight is calculated based on duration in days. The weight is calculated by dividing the time difference of that interval with the number of milliseconds in a day.
7) Once the weight is known, the weight of the particular interval is multiplied with the battery level difference of that interval. This is accumulated for all the intervals.
8) The weight of each interval is also accumulated.
9) Then at the end, to calculate the daily average, we divide the sum of all the battery levels (step #7) with sum of all weights (step #8).

This app is fully responsive, and basic keyboard A11y is also kept in mind.

There are unit tests written for all the components and services. Also, a happy case scenario for the complete end to end test is covered by the use of Cypress :)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run cypress:open` to run the E2E tests using Cypress.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
