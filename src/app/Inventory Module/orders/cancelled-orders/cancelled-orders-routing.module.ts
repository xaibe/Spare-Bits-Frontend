import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CancelledOrdersPage } from './cancelled-orders.page';

const routes: Routes = [
  {
    path: '',
    component: CancelledOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelledOrdersPageRoutingModule {}
