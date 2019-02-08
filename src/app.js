// --------------------------------
//  Welcome to Vanilla Tunes
// --------------------------------

"use strict";

// Polyfill to make sure the environment implements Symbol globally for old browsers or < es6
require('es6-symbol/implement');
// Babel to ensure transpiling (es6 to es5) between JS versions
import "@babel/polyfill";

import Utils from 'Services/Utils.js';

import Header_Initialisation from 'Components/Layout/Header.js';
import Home_Initialisation from 'Components/Home/Home.js';

((win, doc, log, si, ci, sto, loc) => {

  // Setup the app
  Header_Initialisation();
  Home_Initialisation();

})(
  window,
  document,
  console,
  setInterval,
  clearInterval,
  setTimeout,
  window.location
);
