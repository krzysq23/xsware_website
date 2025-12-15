import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@app/config/app.config';
import { AppComponent } from '@app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
