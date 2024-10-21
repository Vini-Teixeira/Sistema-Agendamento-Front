import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { appConfig } from './app/app.config';
import { IConfig } from 'ngx-mask';

const maskConfigFunction: () => Partial<IConfig> = () => {
  return {
    validation: false
  }
}

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideEnvironmentNgxMask(maskConfigFunction),
  ],
}).catch((err) => console.error(err));