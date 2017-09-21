import { Component, trigger, state, animate, transition, style } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { DirectoryService, DirectoryI, DirectoryItemI } from '../directory.service';
import { StorageService, UserI } from '../storage.service';
import { UserService } from '../user.service';

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

export class DirectoryComponent {

  public directories: Observable<DirectoryI[]>;
  public contacts: Observable<DirectoryItemI[]>;
  public contactsToggle = true;
  public directoryToggle = true;
  public user: UserI;

  constructor(
    private _router: Router,
    public directoryService: DirectoryService,
    public storageService: StorageService,
    public userService: UserService
  ) {
    userService.userData().subscribe(
      x => {
        console.log(x);
        this.user = x;
      }
    );
    this.directories = directoryService.get();
    this.contacts = storageService.table('contacts').read().asObservable();
  }

  call(item: DirectoryItemI) {
    this._router.navigate(['/call', item.number]);
  }

  add(contact: DirectoryItemI) {
    this.storageService.table('contacts').create(contact);
  }

  edit(contact: DirectoryItemI) {
    this._router.navigate(['/directory', 'edit', contact.id]);
  }

  toggleContactsList(value: boolean) {
    this.contactsToggle = !this.contactsToggle;
  }

  toggleDirectoryList(value: boolean) {
    this.directoryToggle = !this.directoryToggle;
  }
}
