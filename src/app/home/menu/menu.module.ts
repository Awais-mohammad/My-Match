

import { ShowUserPage } from './../../show-user/show-user.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuPageRoutingModule } from './menu-routing.module';
import { MenuPage } from './menu.page';
import { SharedModule } from 'src/app/shared.module';
import { ChatPage } from 'src/app/chat/chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    MenuPageRoutingModule,
   
  ],
  declarations: [MenuPage],
  entryComponents: [ShowUserPage,ChatPage],
})
export class MenuPageModule {}
