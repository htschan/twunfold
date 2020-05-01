import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusOutboundPageRoutingModule } from './status-outbound-routing.module';

import { StatusOutboundPage } from './status-outbound.page';
import { TransferStatusComponent } from './components/transfer-status/transfer-status.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusOutboundPageRoutingModule
  ],
  declarations: [
    StatusOutboundPage,
    TransferStatusComponent
  ]
})
export class StatusOutboundPageModule { }
