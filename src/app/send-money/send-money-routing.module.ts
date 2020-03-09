import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendMoneyPage } from './send-money.page';
import { SendMoney2Page } from './step2/send-money-2.page';
import { SendMoney3Page } from './step3/send-money-3.page';

const routes: Routes = [
  {
    path: '',
    component: SendMoneyPage
  },
  {
    path: 'step2/:target',
    component: SendMoney2Page
  },
  {
    path: 'step2/:target/step3/:target/:source',
    component: SendMoney3Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendMoneyPageRoutingModule { }
