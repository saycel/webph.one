import { Component } from '@angular/core';

import { JsSipService } from './jssip.service';
import { DirectoryService, DirectoryItemI } from './directory.service';
import { UserService, UserI } from './user.service';

import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';

// Until it is decided to remove the support
// to the versions prior to the release.
import * as LocalForage from 'localforage';
import { StorageService } from './storage.service';

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
    public jsSip: JsSipService,
    public storageService: StorageService
   ) {

    // Apply migration from the old database.
    this.checkDB().then( () => {
      this.loadUser();
      this.loadDirectory();
    });
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
    let connected = false;
    /** subscribe to de user data service */
    this.userService.userData().subscribe(
      () => {
        /** If the database is fully loaded and there is no user data */
        this.userService.isUser().then( status => {
          if (status === false) {
            /** Register user and whait for new user data*/
            this.userService.createUser().catch(console.log);
          /** If the database is fully loaded and there is user data */
          } else if (status === true) {
            /** Start the jsSip connection */
            if (connected === false) {
              this.jsSip.connect(this.userService.userData().getValue());
            }
            connected = true;
          }
        });
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

  /**
   * This checks if a LocalForage db exists and
   * migrates all the contents to PouchDB, this
   * function will be removed in the future.
   */
  checkDB () {
    return new Promise ((res, rej ) => {
      // Get user and contacts data
      LocalForage.config({
        driver: LocalForage.INDEXEDDB,
        name: 'webphoneDB'
      });
      const user: Promise<UserI[]> = LocalForage.getItem('user');
      const contacts: Promise<DirectoryItemI[]> = LocalForage.getItem('contacts');

      // Check save and delete
      Promise.all([user, contacts])
        .then((data) => {
          // User
          const userMigration = new Promise((resUser, rejUser) => {
            if ( data[0] !== null ) {
              this.storageService.table('user')
                .read()
                .take(1)
                .subscribe(newUserArray => {
                  if ( newUserArray.length ===  0 && typeof data[0][1] !== 'undefined') {
                    console.log('DB MIGRATION - User migrated to new db');
                    delete data[0][1].id;
                    this.storageService.table('user').create(data[0][1]).then(resUser);
                    LocalForage.removeItem('user');
                  }
                });
            } else {
              console.log('DB MIGRATION - Old user not found');
              resUser();
            }
          });

          // Contacts
          const contactsMigrations = new Promise((resContacts, rejContacts) => {
            if ( data[1] !== null ) {
              data[1].map(contact => this.storageService.table('contacts').create(contact));
              console.log('DB MIGRATION - Contacts migrated to new db');
              LocalForage.removeItem('contacts');
              Promise.all(data[1]).then(resContacts).catch(rejContacts);
            } else {
              console.log('DB MIGRATION - Old Contacts not found');
              resContacts();
            }
          });

          Promise.all([userMigration, contactsMigrations]).then(res).catch(rej);
        })
        .catch(rej);
    });
  }
}
