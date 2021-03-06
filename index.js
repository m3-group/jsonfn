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

