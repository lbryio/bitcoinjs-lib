// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731
export interface Network {
  messagePrefix: string;
  bech32: string;
  bip32: Bip32;
  pubKeyHash: number;
  scriptHash: number;
  wif: number;
}

interface Bip32 {
  public: number;
  private: number;
}

export const mainnet: Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n', // ?
  bech32: 'bech32', // TODO is this right?! BECH32_ADDRESS lbry/wallet/orchstr8/node.py?
  bip32: {
    public: 0x0488b21e, // lbry/wallet/server/coin.py XPUB_VERBYTES (unchanged)
    private: 0x0488ade4, // lbry/wallet/server/coin.py XPRV_VERBYTES (unchanged)
  },
  pubKeyHash: 0x55, // lbry/wallet/server/coin.py P2PKH_VERBYTE
  scriptHash: 0x7a, // lbry/wallet/server/coin.py P2SH_VERBYTES
  wif: 0x1c, // lbry/wallet/server/coin.py WIF_BYTE
};
export const regtest: Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bech32', // TODO is this right?! BECH32_ADDRESS lbry/wallet/orchstr8/node.py?
  bip32: {
    public: 0x043587cf, // lbry/wallet/server/coin.py XPUB_VERBYTES (unchanged)
    private: 0x04358394, // lbry/wallet/server/coin.py XPRV_VERBYTES (unchanged)
  },
  pubKeyHash: 0x6f, // lbry/wallet/server/coin.py P2PKH_VERBYTE (unchanged)
  scriptHash: 0xc4, // lbry/wallet/server/coin.py P2SH_VERBYTES (unchanged)
  wif: 0x1c, // lbry/wallet/server/coin.py WIF_BYTE
};
export const testnet: Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bech32', // TODO is this right?! BECH32_ADDRESS lbry/wallet/orchstr8/node.py?
  bip32: {
    public: 0x043587cf, // lbry/wallet/server/coin.py XPUB_VERBYTES (unchanged)
    private: 0x04358394, // lbry/wallet/server/coin.py XPRV_VERBYTES (unchanged)
  },
  pubKeyHash: 0x6f, // lbry/wallet/server/coin.py P2PKH_VERBYTE (unchanged)
  scriptHash: 0xc4, // lbry/wallet/server/coin.py P2SH_VERBYTES (unchanged)
  wif: 0x1c, // lbry/wallet/server/coin.py WIF_BYTE
};
