require('es6-promise');
require('whatwg-fetch');
require('reflect-metadata');
require('zone.js/dist/zone.min.js');
require('core-js/client/core');

import { bootstrap } from '@angular/platform-browser-dynamic';
import { MainComponent } from './main.component';

require('./style.scss');

bootstrap(MainComponent);