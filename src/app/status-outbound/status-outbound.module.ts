import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusOutboundPageRoutingModule } from './status-outbound-routing.module';

import { StatusOutboundPage } from './status-outbound.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusOutboundPageRoutingModule
  ],
  declarations: [StatusOutboundPage]
})
export class StatusOutboundPageModule {}
