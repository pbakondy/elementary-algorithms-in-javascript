#!/usr/bin/env node

'use strict';

var libDir = '../lib/';

var sfid = require(libDir + 'preface/smallest_free_id.js');
var np = require(libDir + 'preface/number_puzzle.js');

// Testing: Find the smallest free ID

var list = [18, 4, 8, 9, 16, 1, 14, 7, 19, 3, 0, 5, 2, 11, 6];

console.log('Testing: Find the smallest free ID');
console.log('');
console.log('list =', list);


console.log('minFree1(list) ->', sfid.minFree1(list));
console.log('minFree2(list) ->', sfid.minFree2(list));
console.log('minFree3(list) ->', sfid.minFree3(list));
console.log('minFree4(list) ->', sfid.minFree4(list));
console.log('');
console.log('');


// Testing: Find the minimum free number

console.log('Testing: Find the minimum free number');
console.log('');
console.log('getNumber1(n)');

console.log('1 -> ' + np.getNumber1(1));
console.log('2 -> ' + np.getNumber1(2));
console.log('5 -> ' + np.getNumber1(5));
console.log('10 -> ' + np.getNumber1(10));
console.log('20 -> ' + np.getNumber1(20));
console.log('100 -> ' + np.getNumber1(100));
console.log('1000 -> ' + np.getNumber1(1000));
console.log('');

console.log('getNumber2(n)');
console.log('1 -> ' + np.getNumber2(1));
console.log('2 -> ' + np.getNumber2(2));
console.log('5 -> ' + np.getNumber2(5));
console.log('10 -> ' + np.getNumber2(10));
console.log('20 -> ' + np.getNumber2(20));
console.log('100 -> ' + np.getNumber2(100));
console.log('1000 -> ' + np.getNumber2(1000));
console.log('10000 -> ' + np.getNumber2(10000));

console.log('');

console.log('getNumber3(n)');
console.log('1 -> ' + np.getNumber3(1));
console.log('2 -> ' + np.getNumber3(2));
console.log('5 -> ' + np.getNumber3(5));
console.log('10 -> ' + np.getNumber3(10));
console.log('20 -> ' + np.getNumber3(20));
console.log('100 -> ' + np.getNumber3(100));
console.log('1000 -> ' + np.getNumber3(1000));
console.log('10000 -> ' + np.getNumber3(10000));

console.log('');

