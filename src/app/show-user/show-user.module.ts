import { ShowUserPage } from './../show-user/show-user.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { ChatPage } from '../chat/chat.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ShowUserPage,
  ],
  declarations: [],
  entryComponents: [ChatPage]
})
export class HomePageModule {}
