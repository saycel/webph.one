import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DirectoryService, DirectoryI, DirectoryItemI } from '../directory.service';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})

export class DirectoryComponent {

  public directories: Observable<DirectoryI[]>;

  constructor(private _router: Router, directoryService: DirectoryService ) {
    this.directories = directoryService.get();
  }

  call(item: DirectoryItemI) {
    this._router.navigate(['/call', item.number]);
  }
}
