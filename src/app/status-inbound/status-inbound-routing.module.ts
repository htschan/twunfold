import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusInboundPage } from './status-inbound.page';

const routes: Routes = [
  {
    path: '',
    component: StatusInboundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusInboundPageRoutingModule {}
