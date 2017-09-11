import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(tel: any, args?: any): any {
    const value = tel.toString().trim().replace(/^\+/, '');

    if (value.match(/[^0-9]/)) {
      return tel;
    }

    let prefix, number;

    switch (value.length) {
      case 11: // +CCCPP####### -> CCC (PP) ###-####
        prefix = value.slice(0, 6);
        number = value.slice(5);
        break;

      default:
        return tel;
    }

    return '(' + prefix + ') ' + number;
  }

}
