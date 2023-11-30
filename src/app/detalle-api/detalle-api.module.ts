import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleApiPageRoutingModule } from './detalle-api-routing.module';

import { DetalleApiPage } from './detalle-api.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleApiPageRoutingModule
  ],
  declarations: [DetalleApiPage]
})
export class DetalleApiPageModule {}
