// bip32 stuff specific to LBRY. This file didn't exist in bitcoinjs-lib at the
// time of forking. This file may or may not have a better home in a different
// library.

export enum KeyPath {
  RECEIVE = 0,
  CHANGE = 1,
  CHANNEL = 2,
}
