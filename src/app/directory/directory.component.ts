import { Component, OnDestroy, trigger, state, animate, transition, style } from '@angular/core';
import { Router } from '@angular/router';
import { DirectoryService, DirectoryI, DirectoryItemI } from '../directory.service';
import { StorageService } from '../storage.service';
import { UserService, UserI } from '../user.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  animations: [
    trigger('toggleState', [
      state('true' , style({ maxHeight: '100%' })),
      state('false', style({ maxHeight: '33px' })),
      transition('* => *', animate('400ms'))
    ]),
    trigger('arrowState', [
      state('true' , style({ transform: 'rotate(0)'})),
      state('false', style({ transform: 'rotate(-90deg)'})),
      transition('* => *', animate('150ms'))
    ])
  ],
  providers: [UserService]
})

export class DirectoryComponent implements OnDestroy {

  public directories: Observable<DirectoryI[]>;
  public contacts: Observable<DirectoryItemI[]>;
  public contactsToggle = true;
  public directoryToggle = true;
  public user: UserI;
    private ngUnsubscribe: Subject<void> = new Subject<void>(); // = new Subject(); in Typescript 2.2-2.4


  constructor(
    private _router: Router,
    public directoryService: DirectoryService,
    public storageService: StorageService,
    public userService: UserService
  ) {
    userService
      .userData()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        x => {
          this.user = x;
        }
      );
    this.directories = directoryService.get();
    this.contacts = storageService
      .table('contacts')
      .read()
      .takeUntil(this.ngUnsubscribe);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  call(item: DirectoryItemI) {
    this._router.navigate(['/call', item.number]);
  }

  add(contact: DirectoryItemI) {
    this.storageService.table('contacts').create(contact);
  }

  edit(contact: DirectoryItemI) {
    this._router.navigate(['/directory', 'edit', contact._id]);
  }

  toggleContactsList(value: boolean) {
    this.contactsToggle = !this.contactsToggle;
  }

  toggleDirectoryList(value: boolean) {
    this.directoryToggle = !this.directoryToggle;
  }
}
