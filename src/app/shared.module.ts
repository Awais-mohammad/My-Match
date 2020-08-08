import { CommentsPage } from './comments/comments.page';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShowUserPage } from './show-user/show-user.page';
import { ChatPage } from './chat/chat.page';

@NgModule({
  declarations: [ShowUserPage,ChatPage,CommentsPage],
  imports: [IonicModule,
    FormsModule,
    CommonModule,

  ],
  exports: [ShowUserPage,ChatPage,CommentsPage],
})
export class SharedModule { }
