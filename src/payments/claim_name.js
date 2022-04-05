'use strict';
// This is mostly a copy of p2pkh, as the usual claim name script is based on that
Object.defineProperty(exports, '__esModule', { value: true });
exports.claimName = void 0;
const bcrypto = require('../crypto');
const networks_1 = require('../networks');
const bscript = require('../script');
const types_1 = require('../types');
const lazy = require('./lazy');
const bs58check = require('bs58check');
const OPS = bscript.OPS;
// input: {signature} {pubkey}
// output: OP_CLAIM_NAME {claim_name} {claim} OP_2DROP OP_DROP OP_DUP OP_HASH160 {hash160(pubkey)} OP_EQUALVERIFY OP_CHECKSIG
function claimName(a, opts) {
  if (
    !a.address &&
    !a.hash &&
    !a.output &&
    !a.pubkey &&
    !a.input &&
    !a.claim &&
    !a.claimName
  )
    throw new TypeError('Not enough data');
  opts = Object.assign({ validate: true }, opts || {});
  (0, types_1.typeforce)(
    {
      network: types_1.typeforce.maybe(types_1.typeforce.Object),
      address: types_1.typeforce.maybe(types_1.typeforce.String),
      hash: types_1.typeforce.maybe(types_1.typeforce.BufferN(20)),
      output: types_1.typeforce.maybe(types_1.typeforce.Buffer),
      pubkey: types_1.typeforce.maybe(types_1.isPoint),
      signature: types_1.typeforce.maybe(bscript.isCanonicalScriptSignature),
      input: types_1.typeforce.maybe(types_1.typeforce.Buffer),
      claimName: types_1.typeforce.maybe(types_1.typeforce.String),
      claim: types_1.typeforce.maybe(types_1.typeforce.Buffer),
    },
    a,
  );
  const _address = lazy.value(() => {
    const payload = bs58check.decode(a.address);
    const version = payload.readUInt8(0);
    const hash = payload.slice(1);
    return { version, hash };
  });
  const _chunks = lazy.value(() => {
    return bscript.decompile(a.input);
  });
  // We need output chunks as well, we can't just go by byte location within
  // the output, because claim and claimName are of variable length.
  const _outputChunks = lazy.value(() => {
    return bscript.decompile(a.output);
  });
  const network = a.network || networks_1.mainnet;
  const o = { name: 'claim_name', network };
  lazy.prop(o, 'address', () => {
    if (!o.hash) return;
    const payload = Buffer.allocUnsafe(21);
    payload.writeUInt8(network.pubKeyHash, 0);
    o.hash.copy(payload, 1);
    return bs58check.encode(payload);
  });
  lazy.prop(o, 'hash', () => {
    if (a.output) return _outputChunks()[7];
    if (a.address) return _address().hash;
    if (a.pubkey || o.pubkey) return bcrypto.hash160(a.pubkey || o.pubkey);
  });
  lazy.prop(o, 'claim', () => {
    if (a.output) return _outputChunks()[2];
    if (a.claim) return a.claim;
  });
  lazy.prop(o, 'claimName', () => {
    if (a.output) return _outputChunks()[1].toString();
    if (a.claimName) return a.claimName;
  });
  lazy.prop(o, 'output', () => {
    if (!o.hash) return;
    if (!o.claimName) return;
    if (!o.claim) return;
    return bscript.compile([
      OPS.OP_CLAIM_NAME,
      Buffer.from(o.claimName),
      o.claim,
      OPS.OP_2DROP,
      OPS.OP_DROP,
      OPS.OP_DUP,
      OPS.OP_HASH160,
      o.hash,
      OPS.OP_EQUALVERIFY,
      OPS.OP_CHECKSIG,
    ]);
  });
  lazy.prop(o, 'pubkey', () => {
    if (!a.input) return;
    return _chunks()[1];
  });
  lazy.prop(o, 'signature', () => {
    if (!a.input) return;
    return _chunks()[0];
  });
  lazy.prop(o, 'input', () => {
    if (!a.pubkey) return;
    if (!a.signature) return;
    return bscript.compile([a.signature, a.pubkey]);
  });
  lazy.prop(o, 'witness', () => {
    if (!o.input) return;
    return [];
  });
  // extended validation
  if (opts.validate) {
    let hash = Buffer.from([]);
    if (a.address) {
      if (_address().version !== network.pubKeyHash)
        throw new TypeError('Invalid version or Network mismatch');
      if (_address().hash.length !== 20) throw new TypeError('Invalid address');
      hash = _address().hash;
    }
    if (a.hash) {
      if (hash.length > 0 && !hash.equals(a.hash))
        throw new TypeError('Hash mismatch');
      else hash = a.hash;
    }
    if (a.output) {
      if (
        _outputChunks().length !== 10 ||
        _outputChunks()[0] !== OPS.OP_CLAIM_NAME ||
        !Buffer.isBuffer(_outputChunks()[1]) ||
        !Buffer.isBuffer(_outputChunks()[2]) ||
        _outputChunks()[3] !== OPS.OP_2DROP ||
        _outputChunks()[4] !== OPS.OP_DROP ||
        _outputChunks()[5] !== OPS.OP_DUP ||
        _outputChunks()[6] !== OPS.OP_HASH160 ||
        !Buffer.isBuffer(_outputChunks()[7]) ||
        _outputChunks()[7].length !== 0x14 ||
        _outputChunks()[8] !== OPS.OP_EQUALVERIFY ||
        _outputChunks()[9] !== OPS.OP_CHECKSIG
      )
        throw new TypeError('Output is invalid');
      const hash2 = _outputChunks()[7];
      if (hash.length > 0 && !hash.equals(hash2))
        throw new TypeError('Hash mismatch');
      else hash = hash2;
      const claimName2 = _outputChunks()[1].toString();
      if (a.claimName && a.claimName !== claimName2)
        throw new TypeError('claimName mismatch');
      const claim2 = _outputChunks()[2];
      if (
        Buffer.isBuffer(a.claim) &&
        a.claim.length > 0 &&
        !a.claim.equals(claim2)
      )
        throw new TypeError('claim mismatch');
    }
    if (a.pubkey) {
      const pkh = bcrypto.hash160(a.pubkey);
      if (hash.length > 0 && !hash.equals(pkh))
        throw new TypeError('Hash mismatch');
      else hash = pkh;
    }
    if (a.input) {
      const chunks = _chunks();
      if (chunks.length !== 2) throw new TypeError('Input is invalid');
      if (!bscript.isCanonicalScriptSignature(chunks[0]))
        throw new TypeError('Input has invalid signature');
      if (!(0, types_1.isPoint)(chunks[1]))
        throw new TypeError('Input has invalid pubkey');
      if (a.signature && !a.signature.equals(chunks[0]))
        throw new TypeError('Signature mismatch');
      if (a.pubkey && !a.pubkey.equals(chunks[1]))
        throw new TypeError('Pubkey mismatch');
      const pkh = bcrypto.hash160(chunks[1]);
      if (hash.length > 0 && !hash.equals(pkh))
        throw new TypeError('Hash mismatch');
    }
  }
  return Object.assign(o, a);
}
exports.claimName = claimName;
