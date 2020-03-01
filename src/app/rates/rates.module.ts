import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { RatesPageRoutingModule } from './rates-routing.module';

import { RatesPage } from './rates.page';

@NgModule({
  imports: [
    SharedModule,
    RatesPageRoutingModule
  ],
  declarations: [RatesPage]
})
export class RatesPageModule {}
