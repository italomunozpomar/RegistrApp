import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { APIPageRoutingModule } from './api-routing.module';

import { APIPage } from './api.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    APIPageRoutingModule
  ],
  declarations: [APIPage]
})
export class APIPageModule {}
