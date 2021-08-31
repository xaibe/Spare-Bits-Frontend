import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersPage } from './orders.page';

const routes: Routes = [
  {
    path: '',
    component: OrdersPage
  },
  {
    path: 'new-orders',
    loadChildren: () => import('./new-orders/new-orders.module').then( m => m.NewOrdersPageModule)
  },
  {
    path: 'confirmed-orders',
    loadChildren: () => import('./confirmed-orders/confirmed-orders.module').then( m => m.ConfirmedOrdersPageModule)
  },
  {
    path: 'cancelled-orders',
    loadChildren: () => import('./cancelled-orders/cancelled-orders.module').then( m => m.CancelledOrdersPageModule)
  },
  {
    path: 'delivered-orders',
    loadChildren: () => import('./delivered-orders/delivered-orders.module').then( m => m.DeliveredOrdersPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersPageRoutingModule {}
