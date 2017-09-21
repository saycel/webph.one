import { Injectable } from '@angular/core';
import * as LocalForage from 'localforage';
import { DirectoryItemI } from './directory.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

interface ObjectWithId {
  id?: String;
}

interface AuthKeysI {
  auth: string;
  p256dh: string;
}

export interface PushDataI {
  endpoint: string;
  expirationTime?: string;
  keys: AuthKeysI;
  p256dh: string;
}

export interface UserI {
  email?: string;
  user?: string;
  password?: string;
  id?: string;
  push?: PushDataI;
}

interface DbTable {
  name: string;
  init: any[];
  subject: BehaviorSubject<any[]>;
  methods: DbTableMethods;
}

interface DbTableMethods {
  create?: Function;
  read?: Function;
  update?: Function;
  delete?: Function;
}

export const randomId = () => '_' + Math.random().toString(36).substr(2, 9) + '-' + Math.random().toString(36).substr(2, 9);

@Injectable()
export class StorageService {
  private dbTables: DbTable[] = [{
    name: 'contacts',
    init: [],
    subject: new BehaviorSubject<DirectoryItemI[]>([]),
    methods: {
      create: (item: Object) => this.create('contacts', item),
      read:   () => this.read('contacts'),
      update: (item: ObjectWithId) => this.updateById('contacts', item),
      delete: (item: ObjectWithId) => this.deleteById('contacts', item)
    }
  },
  {
    name: 'user',
    init: [{user: 'no_user'}],
    subject: new BehaviorSubject<UserI[]>([]),
    methods: {
      create: (item: UserI) => this.create('user', item),
      read:   (): BehaviorSubject<UserI[]> => this.read('user'),
      update: (item: UserI) => this.updateById('user', item),
      delete: (item: UserI) => this.deleteById('user', item)
    }
  }];

  constructor() {
    LocalForage.config({
      driver: LocalForage.INDEXEDDB,
      name: 'webphoneDB'
    });
    this.initStorages(this.dbTables);
  }

  private initStorages(list) {
    list.map(table => {
      LocalForage.getItem(table.name)
        .then((items) => {
          console.log('Init table', table, items);
          if (items === null) {
            LocalForage.setItem(table.name, table.init)
            .then(() => table.subject.next(table.init))
            .catch((err) => { throw Error(err); });
          } else {
            table.subject.next(items);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  table(tableName: string ) {
    const result = this.dbTables.filter(x => x.name === tableName);
    if (result.length > 0) {
      return result[0].methods;
    } else {
      throw Error('Db table ' + tableName + 'not found');
    }
  }

  // Create
  private create(tableName: string, item: Object) {
    item = Object.assign({}, item, {id: randomId()});
    const result = this.dbTables.filter(x => x.name === tableName);
    if (result.length > 0) {
      const table = result[0];
      LocalForage.getItem(table.name)
        .then((items: any[]) =>
          LocalForage.setItem(table.name, [].concat(items, [item]))
            .then(() => table.subject.next([].concat(items, [item])))
            .catch((err) => { throw Error('Error adding object in ' + tableName); }))
        .catch((err) => { throw Error('Error reading ' + tableName); });
    } else {
      throw Error('Db table ' + tableName + ' not found');
    }
  }

  // Update
  private updateById(tableName: string, item: ObjectWithId) {
    const result = this.dbTables.filter(x => x.name === tableName);
    if (result.length > 0) {
      const table = result[0];
      LocalForage.getItem(table.name)
        .then((items: any[]) => {
          const newItems = items.map(x => (x.id !== item.id) ? x : item );
          LocalForage.setItem(table.name, newItems)
            .then(() => table.subject.next(newItems))
            .catch((err) => { throw Error('Error updating object id ' + item.id + ' in ' + tableName); });
        })
        .catch((err) => { throw Error('Error reading ' + tableName); });
    } else {
      throw Error('Db table not found');
    }
  }

  // Read
  private read(tableName: string) {
    const result = this.dbTables
      .filter(x => x.name === tableName)
      .map(x => x.subject);
    if (result.length > 0) {
      return result[0];
    } else {
      throw Error('Db table not found');
    }
  }

  // Delete
  private deleteById(tableName: string, item: ObjectWithId) {
    const result = this.dbTables.filter(x => x.name = tableName);
    if (result.length > 0) {
      const table = result[0];
      LocalForage.getItem(tableName)
        .then((items: any[]) => {
          const newItems = items.filter(x => x.id !== item.id);
          LocalForage.setItem(tableName, newItems)
            .then(() => table.subject.next(newItems))
            .catch((err) => { throw Error('Error deleting object id ' + item.id + ' in ' + tableName); });
        })
        .catch((err) => { throw Error('Error reading ' + tableName); });
    } else {
      throw Error('Db table not found');
    }
  }

}
