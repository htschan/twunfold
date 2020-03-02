import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG_DI } from 'src/twappconfig';
import { IAppConfig } from '../shared/IAppConfig';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor(
    @Inject(APP_CONFIG_DI) private appConfig: IAppConfig
  ) { }

  getRateUrl(sourceCurrency, targetCurrency): [string, string] {
    let url = this.appConfig.TwUrl;
    let token = this.appConfig.Tk1;
    if (this.appConfig.Sandbox) {
      url = this.appConfig.TwSandboxUrl;
      token = this.appConfig.SandboxTk1;
    }
    const urlRate = this.appConfig.UrlRate
      .replace('<sourceCurrency>', sourceCurrency)
      .replace('<targetCurrency>', targetCurrency);
    return [url + urlRate, token];
  }
}
