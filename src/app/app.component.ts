import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  links:any[] = [{
    label: 'Call',
    link: '/call'
  },
  {
    label: 'Directory',
    link: '/directory'
  },
  {
    label: 'Share',
    link: '/share'
  }];
}
