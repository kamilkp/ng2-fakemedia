import { Component, NgZone } from '@angular/core';
import { Fakemedia } from '../src/fakemedia.directive';

@Component({
  selector: 'main-component',
  directives: [Fakemedia],
  template: `
    <div fakemedia #first>
      div 1 width: {{ getWidth(first) }}
    </div>
    <div #second>
      div 2 width: {{ getWidth(second) }}
    </div>
  `
})

export class MainComponent {
  constructor(private zone: NgZone) {

  }
  ngOnInit() {
    window.addEventListener('resize', () => {
      this.zone.run(() => {});
    });
  }
  getWidth(element) {
    return element.offsetWidth;
  }
}