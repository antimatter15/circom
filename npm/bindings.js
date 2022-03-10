const path = require('path-browserify');
const { Volume, createFsFromVolume } = require('memfs');
const { ufs } = require('unionfs');

const vol = Volume.fromJSON({
  "/dev/stdin": "",
  "/dev/stdout": "",
  "/dev/stderr": ""
});
const memfs = createFsFromVolume(vol);
const fs = ufs.use(memfs);

const needs = ['F_OK', 'R_OK', 'W_OK', 'X_OK', 'constants', 'Stats', 'Dirent'];
for (const key of needs) {
  fs[key] = memfs[key];
}

const baseNow = Math.floor((Date.now() - performance.now()) * 1e-3)

function hrtime() {
  let clocktime = performance.now() * 1e-3
  let seconds = Math.floor(clocktime) + baseNow
  let nanoseconds = Math.floor((clocktime % 1) * 1e9)
  // return BigInt(seconds) * BigInt(1e9) + BigInt(nanoseconds)
  return (seconds * 1e9 + nanoseconds)
}

function randomFillSync(buf, offset, size) {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    // Similar to the implementation of `randomfill` on npm
    let uint = new Uint8Array(buf.buffer, offset, size);
    crypto.getRandomValues(uint);
    return buf;
  } else {
    try {
      // Try to load webcrypto in node
      let crypto = require('crypto');
      // TODO: Update to webcrypto in nodejs
      return crypto.randomFillSync(buf, offset, size);
    } catch {
      // If an error occurs, fall back to the least secure version
      // TODO: Should we throw instead since this would be a crazy old browser
      //       or nodejs built without crypto APIs
      if (buf instanceof Uint8Array) {
        for (let i = offset; i < offset + size; i++) {
          buf[i] = Math.floor(Math.random() * 256)
        }
      }
      return buf
    }
  }
}

module.exports = {
  hrtime: hrtime,
  exit: (code) => {
    if (typeof process !== 'undefined') {
      process.exit(code);
    } else {
      throw new WASIExitError(code);
    }
  },
  kill: (signal) => {
    if (typeof process !== 'undefined') {
      process.kill(process.pid, signal);
    } else {
      throw new WASIKillError(signal)
    }
  },
  randomFillSync: randomFillSync,
  isTTY: () => true,
  path: path,
  fs: fs,
}
