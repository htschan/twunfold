import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusOutboundPage } from './status-outbound.page';

const routes: Routes = [
  {
    path: '',
    component: StatusOutboundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusOutboundPageRoutingModule {}
