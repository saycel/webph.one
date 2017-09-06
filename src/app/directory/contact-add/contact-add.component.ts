import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import { DirectoryItemI } from '../../directory.service';
import { StorageService } from '../../storage.service';

@Component({
  selector: 'app-contact-add',
  templateUrl: './contact-add.component.html',
  styleUrls: ['./contact-add.component.scss']
})
export class ContactAddComponent implements OnInit {
  public form = new FormGroup({
    number: new FormControl(null, Validators.required),
    title: new FormControl(null, Validators.required)
  });

  constructor(
    private _storageService: StorageService,
    private _location: Location,
    private _router: Router,
    private _activateRoute: ActivatedRoute) { }

  ngOnInit() {
     this.form.setValue(Object.assign({}, this.form.value, { number: Number(this._activateRoute.snapshot.paramMap.get('number') || '' )}));
  }

  addContact() {
    if (this.form.status === 'VALID') {
      this._storageService.table('contcats').create(this.form.value);
      this._router.navigate(['/call', this.form.value.number]);
      return;
    }
  }

  goBack() {
    this._location.back();
  }

}
