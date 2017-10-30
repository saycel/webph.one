import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { Subject } from 'rxjs/Subject';

import { DirectoryItemI } from '../../directory.service';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.scss']
})
export class ContactAddComponent implements OnInit, OnDestroy {
  public action: string;
  public form = new FormGroup({
    number: new FormControl(null, Validators.required),
    title: new FormControl(null, Validators.required)
  });
  private ngUnsubscribe: Subject<void> = new Subject<void>(); // = new Subject(); in Typescript 2.2-2.4

  constructor(
    private _storageService: StorageService,
    private _location: Location,
    private _router: Router,
    private _activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.action = this._activateRoute.snapshot.paramMap.get('action');
    switch (this.action) {
      case 'add':
        this.initAdd();
        break;
      case 'edit':
        this.initEdit();
        break;
      default:
        this._router.navigate(['/directory']);
     }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initAdd() {
    this.form.setValue(Object.assign({}, this.form.value, { number: Number(this._activateRoute.snapshot.paramMap.get('number') || '' )}));
  }

  initEdit() {
    this.form.addControl('_id', new FormControl(this._activateRoute.snapshot.paramMap.get('number')));
    this._storageService.table('contacts')
      .read()
      .takeUntil(this.ngUnsubscribe)
      .map(contacts => contacts
        .filter(contact => contact._id === this.form.value._id)
        .reduce((a, b) => a = b, {}))
      .subscribe(contact => {
        console.log(contact);
        this.form.setValue({
          title: contact.title,
          number: contact.number,
          _id: contact._id,
        });
      });
  }

  submit() {
    switch (this.action) {
      case 'add': this.addContact(); break;
      case 'edit': this.updateContact(); break;
      default:  return false;
    }
  }

  addContact() {
    if (this.form.status === 'VALID') {
      this._storageService.table('contacts').create(this.form.value);
      this._router.navigate(['/call', this.form.value.number]);
      return;
    }
  }

  updateContact() {
    if (this.form.status === 'VALID') {
      this._storageService.table('contacts').update(this.form.value);
      this._router.navigate(['/directory']);
      return;
    }
  }

  deleteContact(event) {
    event.preventDefault();
    this._storageService.table('contacts').delete(this.form.value);
    this._router.navigate(['/directory']);
  }

  goBack() {
    this._location.back();
  }

}
