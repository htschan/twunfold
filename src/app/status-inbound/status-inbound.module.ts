import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatusInboundPageRoutingModule } from './status-inbound-routing.module';

import { StatusInboundPage } from './status-inbound.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatusInboundPageRoutingModule
  ],
  declarations: [StatusInboundPage]
})
export class StatusInboundPageModule {}
