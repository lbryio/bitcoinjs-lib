'use strict';
// bip32 stuff specific to LBRY. This file didn't exist in bitcoinjs-lib at the
// time of forking. This file may or may not have a better home in a different
// library.
Object.defineProperty(exports, '__esModule', { value: true });
exports.KeyPath = void 0;
var KeyPath;
(function(KeyPath) {
  KeyPath[(KeyPath['RECEIVE'] = 0)] = 'RECEIVE';
  KeyPath[(KeyPath['CHANGE'] = 1)] = 'CHANGE';
  KeyPath[(KeyPath['CHANNEL'] = 2)] = 'CHANNEL';
})((KeyPath = exports.KeyPath || (exports.KeyPath = {})));
