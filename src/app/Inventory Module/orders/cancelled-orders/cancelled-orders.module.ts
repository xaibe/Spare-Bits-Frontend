import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelledOrdersPageRoutingModule } from './cancelled-orders-routing.module';

import { CancelledOrdersPage } from './cancelled-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CancelledOrdersPageRoutingModule
  ],
  declarations: [CancelledOrdersPage]
})
export class CancelledOrdersPageModule {}
