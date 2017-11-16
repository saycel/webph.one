import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatConversationComponent } from './chat-conversation/chat-conversation.component';

import { CustomMaterialModule } from '../material.module';
import { CustomsPipesModule } from '../customs-pipes/customs-pipes.module';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatListComponent } from './chat-list/chat-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChatRoutingModule,
    CustomMaterialModule,
    CustomsPipesModule
  ],
  declarations: [ChatConversationComponent, ChatListComponent]
})
export class ChatModule { }
