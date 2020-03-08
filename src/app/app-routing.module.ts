import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'rates',
    loadChildren: () => import('./rates/rates.module').then( m => m.RatesPageModule)
  },
  {
    path: 'overview',
    loadChildren: () => import('./overview/overview.module').then( m => m.OverviewPageModule)
  },
  {
    path: 'status-inbound',
    loadChildren: () => import('./status-inbound/status-inbound.module').then( m => m.StatusInboundPageModule)
  },
  {
    path: 'status-outbound',
    loadChildren: () => import('./status-outbound/status-outbound.module').then( m => m.StatusOutboundPageModule)
  },
  {
    path: 'send-money',
    loadChildren: () => import('./send-money/send-money.module').then( m => m.SendMoneyPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
