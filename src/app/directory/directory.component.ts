import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DirectoryService, DirectoryI, DirectoryItemI } from '../directory.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})

export class DirectoryComponent {

  public directories: Observable<DirectoryI[]>;
  public contacts: Observable<DirectoryItemI[]>;

  constructor(private _router: Router, directoryService: DirectoryService, public storageService: StorageService ) {
    this.directories = directoryService.get();
    this.contacts = storageService.table('contacts').read().asObservable();
  }

  call(item: DirectoryItemI) {
    this._router.navigate(['/call', item.number]);
  }

  add(contact: DirectoryItemI) {
    this.storageService.table('contacts').create(contact);
  }

  update(contact: DirectoryItemI) {
    this.storageService.table('contacts').update(contact);
  }

  delete(contact: DirectoryItemI) {
    this.storageService.table('contacts').delete(contact);
  }
}
