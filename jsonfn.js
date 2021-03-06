
;(function(){

/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (module.definition) {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};

require.register("jsonfn", function (exports, module) {
/**
* JSONfn - javascript (both node.js and browser) plugin to stringify, 
*          parse and clone objects with Functions, Regexp and Date.
*  
* Version - 0.60.00
* Copyright (c) 2012 - 2014 Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/jsonfn/
* 
* Licensed under the MIT license ( http://www.opensource.org/licenses/mit-license.php )
*
*   USAGE:
*     browser:
*         JSONfn.stringify(obj);
*         JSONfn.parse(str[, date2obj]);
*         JSONfn.clone(obj[, date2obj]);
*
*     nodejs:
*       var JSONfn = require("path/to/json-fn");
*       JSONfn.stringify(obj);
*       JSONfn.parse(str[, date2obj]);
*       JSONfn.clone(obj[, date2obj]);
*
*
*     @obj      -  Object;
*     @str      -  String, which is returned by JSONfn.stringify() function; 
*     @date2obj - Boolean (optional); if true, date string in ISO8061 format
*                 is converted into a Date object; otherwise, it is left as a String.
*/

"use strict";

exports.stringify = function (obj) {

  return JSON.stringify(obj, function (key, value) {
    if (value instanceof Function || typeof value == 'function') {
      return value.toString();
    }
    if (value instanceof RegExp) {
      return '_PxEgEr_' + value;
    }
    return value;
  });
};

exports.parse = function (str, date2obj) {

  var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;

  return JSON.parse(str, function (key, value) {
    var prefix;

    if (typeof value != 'string') {
      return value;
    }
    if (value.length < 8) {
      return value;
    }

    prefix = value.substring(0, 8);

    if (iso8061 && value.match(iso8061)) {
      return new Date(value);
    }
    if (prefix === 'function') {
      return eval('(' + value + ')');
    }
    if (prefix === '_PxEgEr_') {
      return eval(value.slice(8));
    }

    return value;
  });
};

exports.clone = function (obj, date2obj) {
  return exports.parse(exports.stringify(obj), date2obj);
};


});

if (typeof exports == "object") {
  module.exports = require("jsonfn");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("jsonfn"); });
} else {
  this["JSONfn"] = require("jsonfn");
}
})()
