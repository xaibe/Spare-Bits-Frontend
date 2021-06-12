import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePicPageRoutingModule } from './profile-pic-routing.module';

import { ProfilePicPage } from './profile-pic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePicPageRoutingModule
  ],
  declarations: [ProfilePicPage]
})
export class ProfilePicPageModule {}
