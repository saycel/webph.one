import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { JsSipService } from './jssip.service';
import { UserService} from './user.service';

export enum MessageType {
  TEXT = <any>'text'
}

export interface ChatMessageI {
  _id?: string;
  chatId?: string;
  from?: string;
  content?: string;
  createdAt?: number;
  type?: MessageType;
}

export interface ChatListItemI {
  _id?: string;
  from?: string;
  lastMessage?: ChatMessageI;
  unread?: boolean;
}

interface ConversationI {
  messages?: ChatMessageI[];
  to?: string;
  chatId?: string;
  myNumber?: string;
}

@Injectable()
export class SmsService {
  private _chatsList = new BehaviorSubject<ChatListItemI[]>([]);
  private _chatConversations = new BehaviorSubject<ConversationI[]>([]);
  constructor(
    private _jsSipServie: JsSipService,
    private _user: UserService
  ) {
    this._chatConversations.next([]);
    this._chatsList.next([]);

    // Link with jsSip service
    this._jsSipServie.incomingSms.subscribe( (data: any) => {

      const checkOfflineInContent = (rowSms) => {
        console.log('[SMS] - Row message', rowSms.message.content, rowSms);
        if (rowSms.message.content.split('[Offline message').length === 1) {
          return rowSms;
        }
        // Remove "[Offline message - " form message contnet
        let content = rowSms.message.content.replace('[Offline message - ', '');
        const smsDate = new Date(content.split(']')[0]);
        smsDate.setTime(smsDate.getTime() - smsDate.getTimezoneOffset() * 60000);
        content = content.split(']')[1];
        rowSms.message.content = content;
        rowSms.message.createdAt = smsDate;
        return rowSms;
      };

      if ( data && data.originator !== 'local') {
        data = checkOfflineInContent(data);
        const message = {
          _id: '' + Date.now(),
          chatId: data.message.remote_identity.uri.user,
          from: data.message.remote_identity.uri.user,
          content: data.message.content,
          createdAt: data.message.createdAt || Date.now()
        };
        this.addSms(message, message.chatId);
      }
    });
  }

  sendSms(message: string, to: string) {
    const from = this._user.userData().getValue().user;
    const newMessage: ChatMessageI = {
      _id: '' + Date.now(),
      chatId: to,
      from: from,
      content: message,
      createdAt: Date.now()
    };
    this._jsSipServie.sendMessage(message, to)
      .then(data => this.addSms(newMessage, to))
      .catch(error => console.log('[SMS] - Error sending message', error));
  }

  addSms(message: ChatMessageI, chatId: string) {

    // Check if chat exist, if not create one
    const chats = this._chatsList.getValue();
    if (chats.filter(chat => chat._id === chatId).length === 0) {
      this.initChat(chatId);
    }

    // Change last message on chat list
    this._chatsList.next(this._chatsList.getValue().map(chat => {
      if (chat._id !== chatId)  { return chat; }
      chat.lastMessage = message;
      chat.unread = true;
      return chat;
    }));

    // Check if conversation exist, if not create one
    const conversations = this._chatConversations.getValue();
    if (conversations.filter(conversation => conversation.chatId === chatId).length === 0) {
      const myNumber = this._user.userData().getValue().user;
      this.initConverastion(chatId, myNumber);
    }

    // Add to converstions list
    this._chatConversations.next(this._chatConversations.getValue().map(conversation => {
      if (conversation.chatId !== chatId)  { return conversation; }
      conversation.messages = conversation.messages.concat([message]);
      return conversation;
    }));

  }

  initChat(chatId: string) {
    const newChatItem: ChatListItemI = {
      _id: chatId,
      from: chatId,
      lastMessage: {
        content: ''
      },
      unread: false
    };
    this._chatsList.next(this._chatsList.getValue().concat([newChatItem]));
  }

  initConverastion(chatId: string, myNumber: string, to: string = null) {
    const newConversationItem: ConversationI = {
      chatId: chatId,
      myNumber: myNumber,
      to: to || chatId,
      messages: [],
    };
    this._chatConversations.next(this._chatConversations.getValue().concat([newConversationItem]));
  }

  getAllChats() {
    return this._chatsList.asObservable();
  }

  getChat(chatId: string) {
    const filtredChat = new BehaviorSubject<ConversationI>({});

    this._chatConversations.subscribe( conversations => {
      const conversation = conversations
        .filter(x => x.chatId === chatId)
        .reduce((p, a) => a, {});
      filtredChat.next(conversation);
    });

    this.markAsRead(chatId);
    return filtredChat;
  }

  markAsRead(chatId) {
    const newChatList = this._chatsList.getValue().map(chat => {
      if (chat._id !== chatId) {
        return chat;
      }
      chat.unread = false;
      return chat;
    });
    this._chatsList.next(newChatList);
  }
}
