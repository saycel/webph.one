import { Component } from '@angular/core';

import { JsSipService } from './jssip.service';
import { DirectoryService } from './directory.service';
import { UserService } from './user.service';

import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /** This object manages the top navigation bar. */
  public links: any[] = [
    { label: 'Call', link: '/call' },
    { label: 'Directory', link: '/directory' },
    { label: 'Share', link: '/share' }
  ];

  constructor(
    public iconRegistry: MdIconRegistry,
    public sanitizer: DomSanitizer,
    public directoryService: DirectoryService,
    private userService: UserService,
    public jsSip: JsSipService
   ) {

    this.loadUser();
    this.loadDirectory();
    this.loadIcons([
      'call-end',
      'call',
      'contact-add',
      'arrow-down',
      'person'
    ]);
  }

  /**
   * Load svg files into material-icons
   * @param icons  Array of svg file names to load, without the extension
   */
  loadIcons (icons: string[]) {
    icons.forEach( icon =>
      this.iconRegistry
        .addSvgIcon(
          icon,
          this.sanitizer.bypassSecurityTrustResourceUrl('assets/' + icon + '.svg')
        )
    );
  }

  /**
   * Initialize the user system.
   * Load the local database and try to recover the user's data.
   * If they do not exist try to create one automatically.
   */
  loadUser () {
    /** subscribe to de user data service */
    this.userService.userData().subscribe(
      () => {
        /** If the database is fully loaded and there is no user data */
        if (this.userService.isUser() === false) {
          /** Register user and whait for new user data*/
          this.userService.createUser();
        /** If the database is fully loaded and there is user data */
        } else if (this.userService.isUser() === true) {
          /** Start the jsSip connection */
          this.jsSip.connect(this.userService.userData().getValue());
        }
      }
    );
  }

  /**
   * Initialize the directory system.
   * Load directory and contacts from localstorage
   */
  loadDirectory () {
    this.directoryService.get().subscribe();
  }
}
