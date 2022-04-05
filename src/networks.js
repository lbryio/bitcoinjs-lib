'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.testnet = exports.regtest = exports.mainnet = void 0;
exports.mainnet = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bech32',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4, // lbry/wallet/server/coin.py XPRV_VERBYTES (unchanged)
  },
  pubKeyHash: 0x55,
  scriptHash: 0x7a,
  wif: 0x1c, // lbry/wallet/server/coin.py WIF_BYTE
};
exports.regtest = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bech32',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394, // lbry/wallet/server/coin.py XPRV_VERBYTES (unchanged)
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0x1c, // lbry/wallet/server/coin.py WIF_BYTE
};
exports.testnet = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bech32',
  bip32: {
    public: 0x043587cf,
    private: 0x04358394, // lbry/wallet/server/coin.py XPRV_VERBYTES (unchanged)
  },
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0x1c, // lbry/wallet/server/coin.py WIF_BYTE
};
