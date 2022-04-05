// This is a standalone script that you can try out in its own project. You
// should install this fork of bitcoinjs-lib, but otherwise you can get from
// normal npm.

// TODO - maybe just put this in a README or similar file

const ecpair = require('ecpair')
const bs58check = require('bs58check');
const ecc = require('tiny-secp256k1')
const lbry = require('bitcoinjs-lib')
const ECPair = ecpair.ECPairFactory(ecc)
const network = lbry.networks.regtest

// Previous data from a regtest instance

const key = ECPair.fromPrivateKey(bs58check.decode('cRWuHDPLjySJJzen1eztGD8SYq396NjBTdEwU3WF1LRRJ8NwhYCT').slice(1, -1), network)

// A previous transaction

/*
  "amount": 0.00000000,
  "fee": -0.01400000,
  "confirmations": 7,
  "blockhash": "2006054341b56529181e194531217823454650c07997c75dd796b9a8fe8a8fec",
  "blockindex": 1,
  "blocktime": 1646858320,
  "txid": "a2f0ea39d3f54f46e30a4bfac403988779ca81b132c2869764535e836ba03a18",
  "walletconflicts": [
  ],
  "time": 1646858274,
  "timereceived": 1646858274,
  "bip125-replaceable": "no",
  "details": [
    {
      "address": "mo4PK1TNw8ssTG6gM6JdWZfoFdasnNfqaE",
      "category": "send",
      "amount": -1.00000000,
      "vout": 1,
      "fee": -0.01400000,
      "abandoned": false
    },
    {
      "address": "mo4PK1TNw8ssTG6gM6JdWZfoFdasnNfqaE",
      "category": "receive",
      "amount": 1.00000000,
      "vout": 1
    }
  ],

  {
    "n": 0,
    "name": "my_name",
    "claimId": "cc2181b64c566f29733e88cee984923f4f1b8c05",
    "value": "deadbeef",
    "depth": 6,
    "inClaimTrie": false,
    "inQueue": false
  }
*/
const nonWitnessUtxo = Buffer.from('020000000285ea15a6f1294a52b6424365d0a76e939b6ca9c8e87b25d67bebab1c1cd10a4300000000484730440220664b43577c03e6e3ced92bb699ab99c8d35c34ebca4ace408f0d4b54e807e055022050decc7da867941bac47ad097e14e0cff8e33fe199267ef8d1c64fce9f1e0faf01feffffffec34291fe8e028108f2d71e18fbd4b89a2d476d3d87f48c55e48373d122e7d7a0000000048473044022003a900648a3f5092e315234b7a17f366698957427a3ae402f825d6bc0e500257022061bef51b321ba9e64a569853c2d7fd87e025a504ea100ff028bb76c6af48ee5a01feffffff024084e005000000001976a914036c5b9a022ae12360bd539825f6f2e6fb3080d088ac00e1f5050000000029b5076d795f6e616d6504deadbeef6d7576a91452baa8720ff969c4a927757f81275d2a42291c2088ac78000000', 'hex')

// Based on p2pkh, adding claimName and claim
const payment = lbry.payments.claimName({
  pubkey: key.publicKey,
  claimName: "claim",
  claim: Buffer.from("new_claim")
})

exports.psbt = new lbry.Psbt({ network })

exports.psbt.addOutput({ script: payment.output, value: 99000000 })

// For some reason they want the entirety of the input txn (nonWitnessUtxo) as well as its hash here
exports.psbt.addInput({
  nonWitnessUtxo,
  hash: 'a2f0ea39d3f54f46e30a4bfac403988779ca81b132c2869764535e836ba03a18',
  index: 1 // matching vout in the input txn
})

exports.psbt.signInput(0, key)

exports.result = exports.psbt
  .finalizeAllInputs()
  .extractTransaction()
  .toHex()

// Putting exports.result into the regtest succeeded. The claim showed up.
