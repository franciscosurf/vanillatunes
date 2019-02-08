/**
 * Utils object with some functions
 * @returns {{resource: null, id: null, verb: null}}
 * @constructor
 */
const Utils = {

  // --------------------------------
  //  Simple sleep implementation
  // --------------------------------
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

};

export default Utils;