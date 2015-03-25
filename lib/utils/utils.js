#!/usr/bin/env node

'use strict';

var toStr = Object.prototype.toString;

function isArray(value) {
  return '[object Array]' === toStr.call(value);
}

function isNumber(value) {
  return typeof value === 'number';
}

function isFunction(value) {
  return typeof value === 'function';
}

module.exports = {
  isNumber: isNumber,
  isArray: isArray,
  isFunction: isFunction
};
