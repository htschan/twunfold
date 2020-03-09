import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendMoneyPageRoutingModule } from './send-money-routing.module';

import { SendMoneyPage } from './send-money.page';
import { SendMoney2Page } from './step2/send-money-2.page';
import { SendMoney3Page } from './step3/send-money-3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendMoneyPageRoutingModule
  ],
  declarations: [SendMoneyPage, SendMoney2Page, SendMoney3Page]
})
export class SendMoneyPageModule {}
