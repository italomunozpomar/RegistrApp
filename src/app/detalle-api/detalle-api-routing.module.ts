import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleApiPage } from './detalle-api.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleApiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleApiPageRoutingModule {}
