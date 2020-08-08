import { CommentsPage } from './../comments/comments.page';
import { ShowUserPage } from './../show-user/show-user.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared.module';
import { ChatPage } from '../chat/chat.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    HomePageRoutingModule,
   
  ],
  declarations: [HomePage],
  entryComponents: [ShowUserPage,ChatPage,CommentsPage]
})
export class HomePageModule {}
