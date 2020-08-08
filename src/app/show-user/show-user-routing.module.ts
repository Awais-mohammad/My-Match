import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowUserPage } from './show-user.page';

const routes: Routes = [
  {
    path: '',
    component: ShowUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowUserPageRoutingModule {}
