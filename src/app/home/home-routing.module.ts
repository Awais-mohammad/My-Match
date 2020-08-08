import { AuthService } from './../auth.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/menu/menu.module').then( m => m.MenuPageModule)
          }
        ]
      },
      {
        path: 'userprofile',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/userprofile/userprofile.module').then( m => m.UserprofilePageModule)
           
          }
          
        ]
      },
      {
        path: 'aboutus',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/aboutus/aboutus.module').then( m => m.AboutusPageModule)
          }
        ]
      }

    ]
      },
      {
        path: '',
        redirectTo: '/home/menu',
        pathMatch: 'full'
      },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {
  
}
