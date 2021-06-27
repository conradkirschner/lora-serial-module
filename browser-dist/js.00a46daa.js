// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../node_modules/node-libs-browser/node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../node_modules/base64-js/index.js","ieee754":"../node_modules/ieee754/index.js","isarray":"../node_modules/isarray/index.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../node_modules/buffer/index.js":[function(require,module,exports) {

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    var proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    var copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        Buffer.from(buf).copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (var i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = (function () {
  var alphabet = '0123456789abcdef'
  var table = new Array(256)
  for (var i = 0; i < 16; ++i) {
    var i16 = i * 16
    for (var j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

},{"base64-js":"../node_modules/base64-js/index.js","ieee754":"../node_modules/ieee754/index.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/packages/types.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getType = exports.SEND_TEXT_REQUEST_ACK = exports.SEND_HOP_ACK = exports.SEND_TEXT_REQUEST = exports.RREP_ACK = exports.RERR = exports.RREP = exports.RREQ = void 0;
var RREQ = 1;
exports.RREQ = RREQ;
var RREP = 2;
exports.RREP = RREP;
var RERR = 3;
exports.RERR = RERR;
var RREP_ACK = 4;
exports.RREP_ACK = RREP_ACK;
var SEND_TEXT_REQUEST = 5;
exports.SEND_TEXT_REQUEST = SEND_TEXT_REQUEST;
var SEND_HOP_ACK = 6;
exports.SEND_HOP_ACK = SEND_HOP_ACK;
var SEND_TEXT_REQUEST_ACK = 7;
/**
 *
 * @var Buffer byteArray
 * @param byteArray
 */

exports.SEND_TEXT_REQUEST_ACK = SEND_TEXT_REQUEST_ACK;

var getType = function getType(byteArray) {
  var currentBufferInt = Buffer.from(byteArray).readUInt8(0);
  /** @type Buffer**/

  if (currentBufferInt === Buffer.from([RREQ]).readUInt8(0)) {
    return 'RREQ';
  }

  if (currentBufferInt === Buffer.from([RREP]).readUInt8(0)) {
    return 'RREP';
  }

  if (currentBufferInt === Buffer.from([RERR]).readUInt8(0)) {
    return 'RERR';
  }

  if (currentBufferInt === Buffer.from([RREP_ACK]).readUInt8(0)) {
    return 'RREP_ACK';
  }

  if (currentBufferInt === Buffer.from([SEND_TEXT_REQUEST]).readUInt8(0)) {
    return 'SEND_TEXT_REQUEST';
  }

  if (currentBufferInt === Buffer.from([SEND_HOP_ACK]).readUInt8(0)) {
    return 'SEND_HOP_ACK';
  }

  if (currentBufferInt === Buffer.from([SEND_TEXT_REQUEST_ACK]).readUInt8(0)) {
    return 'SEND_TEXT_REQUEST_ACK';
  }

  return null;
};

exports.getType = getType;
},{"buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/packages/RREP.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.create = void 0;

var _types = require("./types");

var create = function create() {
  var hopCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var originAddress = arguments.length > 1 ? arguments[1] : undefined;
  var destinationAddress = arguments.length > 2 ? arguments[2] : undefined;
  var destinationSequenceNumber = arguments.length > 3 ? arguments[3] : undefined;
  var lifetime = arguments.length > 4 ? arguments[4] : undefined;
  return Buffer.from([_types.RREP, hopCount, originAddress, destinationAddress, destinationSequenceNumber, lifetime]);
};

exports.create = create;

var read = function read(byteArray) {
  return {
    hopCount: byteArray[0],
    originAddress: byteArray[1],
    destinationAddress: byteArray[2],
    destinationSequenceNumber: byteArray[3],
    lifetime: byteArray[4]
  };
};

exports.read = read;
},{"./types":"../src/client/packages/types.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/packages/RREQ.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.create = void 0;

var _types = require("./types");

var create = function create(uflag, hopCount, rreq_id, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber) {
  return Buffer.from([_types.RREQ, uflag ? uflag : 1, hopCount, rreq_id, originAddress, originSequenceNumber, destinationAddress, destinationSequenceNumber]);
};

exports.create = create;

var read = function read(byteArray) {
  return {
    uflag: byteArray[0],
    hopCount: byteArray[1],
    rreq_id: byteArray[2],
    originAddress: parseInt(byteArray[3]),
    originSequenceNumber: byteArray[4],
    destinationAddress: parseInt(byteArray[5]),
    destinationSequenceNumber: byteArray[6]
  };
};

exports.read = read;
},{"./types":"../src/client/packages/types.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/packages/RERR.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = read;
exports.create = void 0;

var _types = require("./types");

var create = function create(destinationCount, unreachableDestinationAddress, unreachableDestinationSequenceNumber, additionalAddresses, additionalSequenceNumber) {
  return Buffer.from([_types.RERR, destinationCount, unreachableDestinationAddress, unreachableDestinationSequenceNumber, additionalAddresses, additionalSequenceNumber]);
};

exports.create = create;

function read(byteArray) {
  return {
    destinationCount: byteArray[0],
    unreachableDestinationAddress: byteArray[1],
    unreachableDestinationSequenceNumber: byteArray[2],
    additionalAddresses: byteArray[3],
    additionalSequenceNumber: byteArray[4]
  };
}
},{"./types":"../src/client/packages/types.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/packages/RREP-ACK.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.create = void 0;

var _types = require("./types");

var create = function create() {
  return Buffer.from([_types.RREP_ACK]);
};

exports.create = create;

var read = function read() {
  return true;
};

exports.read = read;
},{"./types":"../src/client/packages/types.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/packages/SEND-TEXT-REQUEST.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.create = void 0;

var _types = require("./types");

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var create = function create(originAddress, destinationAddress, messageSequenceNumber, payload) {
  var bytesPayload = Buffer.from(payload);
  return Buffer.concat([Buffer.from([_types.SEND_TEXT_REQUEST, parseInt(originAddress), parseInt(destinationAddress), messageSequenceNumber]), bytesPayload]);
};

exports.create = create;

var read = function read(byteArray) {
  var _byteArray = _toArray(byteArray),
      originAddress = _byteArray[0],
      destinationAddress = _byteArray[1],
      messageSequenceNumber = _byteArray[2],
      bytesPayload = _byteArray.slice(3);

  return {
    originAddress: originAddress,
    destinationAddress: destinationAddress,
    messageSequenceNumber: messageSequenceNumber,
    message: Buffer.from(bytesPayload).toString('ascii')
  };
};

exports.read = read;

var converToAscii = function converToAscii(byteArray) {
  return String.fromCharCode(byteArray);
};
},{"./types":"../src/client/packages/types.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/packages/SEND-HOP-ACK.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.create = void 0;

var _types = require("./types");

var create = function create(messageSequenceNumber) {
  return Buffer.from([_types.SEND_HOP_ACK, messageSequenceNumber]);
};

exports.create = create;

var read = function read(bytearray) {
  return {
    messageSequenceNumber: bytearray[0]
  };
};

exports.read = read;
},{"./types":"../src/client/packages/types.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/packages/SEND-TEXT-REQUEST-ACK.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = exports.create = void 0;

var _types = require("./types");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var create = function create(originAddress, destinationAddress, messageNumber) {
  return Buffer.from([_types.SEND_TEXT_REQUEST_ACK, originAddress, destinationAddress, messageNumber]);
};

exports.create = create;

var read = function read(byteArray) {
  var _byteArray = _slicedToArray(byteArray, 3),
      originAddress = _byteArray[0],
      destinationAddress = _byteArray[1],
      messageNumber = _byteArray[2];

  return {
    originAddress: originAddress,
    destinationAddress: destinationAddress,
    messageNumber: messageNumber
  };
};

exports.read = read;
},{"./types":"../src/client/packages/types.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/packages/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.read = exports.send = void 0;

var _RREP = require("./RREP");

var _RREQ = require("./RREQ");

var _RERR = require("./RERR");

var _RREPACK = require("./RREP-ACK");

var _SENDTEXTREQUEST = require("./SEND-TEXT-REQUEST");

var _SENDHOPACK = require("./SEND-HOP-ACK");

var _SENDTEXTREQUESTACK = require("./SEND-TEXT-REQUEST-ACK");

var send = {
  rrep_ack: _RREPACK.create,
  rerr: _RERR.create,
  rreq: _RREQ.create,
  rrep: _RREP.create,
  send_hop_ack: _SENDHOPACK.create,
  send_text_request: _SENDTEXTREQUEST.create,
  send_text_request_ack: _SENDTEXTREQUESTACK.create
};
exports.send = send;
var read = {
  rrep_ack: _RREPACK.read,
  rerr: _RERR.read,
  rreq: _RREQ.read,
  rrep: _RREP.read,
  send_hop_ack: _SENDHOPACK.read,
  send_text_request: _SENDTEXTREQUEST.read,
  send_text_request_ack: _SENDTEXTREQUESTACK.read
};
exports.read = read;
var _default = {
  read: read,
  send: send
};
exports.default = _default;
},{"./RREP":"../src/client/packages/RREP.js","./RREQ":"../src/client/packages/RREQ.js","./RERR":"../src/client/packages/RERR.js","./RREP-ACK":"../src/client/packages/RREP-ACK.js","./SEND-TEXT-REQUEST":"../src/client/packages/SEND-TEXT-REQUEST.js","./SEND-HOP-ACK":"../src/client/packages/SEND-HOP-ACK.js","./SEND-TEXT-REQUEST-ACK":"../src/client/packages/SEND-TEXT-REQUEST-ACK.js"}],"js/createSerialConsole.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSerialConsole = void 0;

var _types = require("./../../src/client/packages/types");

var _packages = _interopRequireDefault(require("../../src/client/packages"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * @var renderInto HTMLElement
 * @param renderInto
 **/
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

var formattedTimestamp = function formattedTimestamp() {
  var currentdate = new Date();
  return currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
};

var formatBinaryInput = function formatBinaryInput(sended) {
  var showText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  for (var i = 0; i < sended.length; i++) {
    try {
      if (sended instanceof Uint8Array) {
        showText += parseInt(sended[i].toString(2), 2) + '-';
      } else {
        showText += parseInt(sended[i].charCodeAt(0)) + '-';
      }
    } catch (e) {
      showText += sended[i];
    }
  }

  return showText.substring(0, showText.length - 1);
};

var createSerialConsole = function createSerialConsole(renderInto, connectToDeviceId, attachEvents) {
  /**
   * first create container
   **/
  var id = makeid(5);
  var serialConsole = document.createElement('div');
  serialConsole.id = id;
  serialConsole.classList.add('serial-console-window');
  serialConsole.innerHTML = "\n            <div style=\"width:100%\"> <div data-id=\"header\" class=\"serial-console-header\">\n                <span>Serial Console -  <span data-id=\"device-id\">...</span></span>\n                 <span data-id=\"readonly-label\" class=\"readonly-label hidden\">readonly <a class=\"full-log-toggle\"  href=\"javascript:false\" data-id=\"full-log-toggle\"> (active full log)</a></span>\n                 <span data-id=\"window-close-button\" class=\"serial-console-close-button\">\u274C</span>\n            </div></div>\n            <div class=\"serial-console-wrapper\">\n            <div data-id=\"serial-console-container\" class=\"serial-console-container serial-console-container--active\">\n\n            <div data-id=\"status-bar\">\n                <div> Ist im Wlan: <span data-id=\"is-lan\">...</span></div>\n                <div> Blacklist: <span class=\"blacklist-container\" data-id=\"blacklist\">...</span></div>\n            </div>\n            <div data-id=\"log-container\" class=\"serial-console-log-container\">\n                <div class=\"log-title\">Log</div>\n                <hr>\n                <div data-id=\"log\"></div>\n            </div>\n            <div data-id=\"footer\" class=\"serial-console-footer\">\n                <div data-id=\"send-text-serial\">\n                    <div>Serial Text Input</div>\n                    <input data-id=\"send-text-serial-button-input\" type=\"text\" />\n                    <button data-id=\"send-text-serial-button\">senden</button>\n                </div>\n                 <div data-id=\"show-packages-container\">\n                    <button><label><input data-id=\"follow-log-toggle\" type=\"checkbox\"> follow log </label></button>\n                </div>\n\n            </div>\n            <div data-id=\"expanded-modal\" class=\"modal-container\">\n                <div data-id=\"expanded-modal-menu\">\n                    <button class=\"expaneded-modal-menu-item\" data-id=\"show-new-route-request\">Route Request</button>\n                    <button class=\"expaneded-modal-menu-item\" data-id=\"show-new-route-reply\">Route Reply</button>\n                    <button class=\"expaneded-modal-menu-item\" data-id=\"show-new-route-reply-ack\">Route Reply Acknowledge</button>\n                    <button class=\"expaneded-modal-menu-item\" data-id=\"show-new-route-error\">Route Error</button>\n                    <button class=\"expaneded-modal-menu-item\" data-id=\"show-new-send-hop-acknowledge\">Send Hop Acknowledge</button>\n                    <button class=\"expaneded-modal-menu-item\" data-id=\"show-new-send-text-request\">Send Text Request</button>\n                    <button class=\"expaneded-modal-menu-item\" data-id=\"show-new-send-text-request-acknowledge\">Send Text Request Acknowledge</button>\n                    <button class=\"expaneded-modal-menu-item\" data-id=\"show-manage-receiving\">Manage Receiving</button>\n                    <button class=\"expaneded-modal-menu-item\" data-id=\"show-lora-config\">Lora Config</button>\n                </div>\n                <hr>\n                <div data-id=\"expanded-modal-body\">\n                    <div class=\"expaneded-modal-new-input-container \" data-id=\"expaneded-modal-new-route-request\">\n                        <div>Route Request</div>\n                        <div><span>uflag</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><span>Hop Count</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><span>Request Id</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><span>Origin Address</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><span>Origin Sequence Number</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><span>Destination Address</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><span>Destination Sequence Number</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><button>senden</button> </div>\n                    </div>\n\n                    <div class=\"expaneded-modal-new-input-container hidden\" data-id=\"expaneded-modal-new-route-reply-ack\">\n                        <div>Route Reply Acknowledge </div>\n                        <div><button>senden</button> </div>\n                    </div>\n                     <div class=\"expaneded-modal-new-input-container hidden\" data-id=\"expaneded-modal-new-route-reply\">\n                        <div>Route Reply</div>\n                        <div><span>Hop Count</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><span>Origin Address</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><span>Origin Sequence Number</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><span>Destination Address</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><span>Lifetime</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><button>senden</button> </div>\n                    </div>\n                     <div class=\"expaneded-modal-new-input-container hidden\" data-id=\"expaneded-modal-new-route-error\">\n                        <div>Route Error</div>\n                        <div><span>Destination Count</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><span>Unreachable Destination Address</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><span>Unreachable Destination Sequence Number</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><span>additionalAddresses</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><span>additionalSequenceNumber</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><button>senden</button> </div>\n                    </div>\n                     <div class=\"expaneded-modal-new-input-container hidden\" data-id=\"expaneded-modal-new-send-hop-acknowledge\">\n                        <div>Send Hop Acknowledge</div>\n                        <div><span>messageSequenceNumber</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><button>senden</button> </div>\n                    </div>\n                     <div class=\"expaneded-modal-new-input-container hidden\" data-id=\"expaneded-modal-new-send-text-request\">\n                        <div>Send Text Request</div>\n                        <div><span>Origin Address</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><span>Destination Address</span><span><input type=\"number\" min=\"1\" max=\"20\" value=\"1\"></span> </div>\n                        <div><span>messageSequenceNumber</span><span><input type=\"text\" value=\"1\"></span> </div>\n                        <div><span>message</span><span><input type=\"text\" maxlength=\"30\" value=\"payload\"></span> </div>\n                        <div><button>senden</button> </div>\n                    </div>\n                     <div class=\"expaneded-modal-new-input-container hidden\" data-id=\"expaneded-modal-new-send-text-request-acknowledge\">\n                        <div>Send Text Request Acknowledge</div>\n                        <div><button>senden</button></div>\n                    </div>\n                     <div class=\"expaneded-modal-new-input-container hidden\" data-id=\"expaneded-modal-manage-receiving\">\n                        <div>Lora Receiving Modes</div>\n                        <div><button>ENABLE Receiving</button></div>\n                        <hr>\n                         <div><span>Destination (FFFF = Broadcast)</span><span><input type=\"text\" maxlength=\"30\" value=\"FFFF\"></span> </div>\n                        <div><button>Set Destination</button></div>\n                        <hr>\n                         <div><span>Address (1-20)</span><span><input type=\"text\" maxlength=\"30\" value=\"15\"></span> </div>\n                        <div><button>Set Addressf</button></div>\n                    </div>\n                     <div class=\"expaneded-modal-new-input-container hidden\" data-id=\"expaneded-modal-lora-config\">\n                        <div>Lora Config</div>\n                         <div>\n                             <span>\n                                 <a href=\"javascript:false\" \n                                 title=\"Die Tr\xE4gerfrequenz, wenn das Modul arbeitet, in Dezimalzahlen, ausgedr\xFCckt in 9 Zeichen (410 MHz bis 470 MHz)\">\n                                    Tr\xE4gerfrequenz\n                                </a>\n                            </span>\n                            <span>\n                                <input type=\"text\" value=\"433000000\">\n                            </span> \n                        </div>\n                         <div>\n                            <div>\n                                <a href=\"javascript:false\" title=\"Sendeleistung, dezimal, ausgedr\xFCckt in 2 Zeichen( 5dBm-20dBm)\">\n                                    Power\n                                </a>\n                            </div>\n                            <span>\n                                <input type=\"text\" value=\"20\">\n                            </span>\n                         </div>\n                         <div>\n                            <div>\n                                <a href=\"javascript:false\" title=\"Die Bandbreite des belegten Kanals wird \xFCbertragen: Je gr\xF6\xDFer die Bandbreite, desto schneller werden die Daten \xFCbertragen, desto geringer ist jedoch die Empfindlichkeit. Im Konfigurationsbefehl wird nur der Bandbreitencode verwendet, und die tats\xE4chliche Bandbreite wird nicht verwendet.\">\n                                    Modulationsbandbreite\n                                </a>\n                            </div>\n                            <span>\n                                <input type=\"text\" value=\"9\" />\n                            </span>\n                         </div>\n                         <div>\n                            <div>\n                                <a href=\"javascript:false\" title=\"Die Schl\xFCsselparameter der Spread-Spectrum-Kommunikation sind, je gr\xF6\xDFer der SpreadingFaktor ist, desto langsamer werden die Daten gesendet, desto h\xF6her ist jedoch die Empfindlichkeit. Im Konfigurationsbefehl wird nur der Code des Spreizfaktors verwendet, und der tats\xE4chliche Spreizfaktor wird nicht angezeigt\">\n                                    Spread-Faktor\n                                </a>\n                            </div>\n                            <div>\n                                <input type=\"text\" value=\"10\" />\n                            </div> \n                            </div>\n                         <div>\n                            <div>\n                                <a href=\"javascript:false\" title=\"F\xFCr die Schl\xFCsselparameter der Spread-Spectrum-Kommunikation wird im Konfigurationsbefehl nur der Code des Fehlerkorrekturcodes verwendet, und der eigentliche Fehlerkorrekturcode wird nicht angezeigt\">\n                                    Fehler beim Korrigieren des Codes\n                                </a>\n                            </div>\n                            <div>\n                                <input type=\"text\" value=\"4\" />\n                             </div>\n                          </div>\n                         <div>\n                            <span>\n                                <a href=\"javascript:false\" title=\"CRC-Pr\xFCfung der Benutzerdaten\">\n                                    CRC-Pr\xFCfung\n                                </a>\n                            </span>\n                            <span>\n                                <input type=\"text\" value=\"1\" />\n                            </span>\n                         </div>\n                         <div>\n                            <span>\n                                <a href=\"javascript:false\" title=\"0 explizit | 1 implizit\">\n                                    Implizite Kopfzeile\n                                </a>\n                            </span>\n                            <span>\n                                <input type=\"text\" value=\"0\" />\n                            </span>\n                         </div>\n                         <div>\n                            <span>\n                                <a href=\"javascript:false\" title=\"Empfangsmoduseinstellung (0 kontinuierlich | 1 einmalig)\">\n                                    Einzelempfang\n                                </a>\n                            </span>\n                            <span>\n                                <input type=\"text\" value=\"0\" />\n                             </span>\n                         </div>\n                         <div>\n                            <span>\n                                <a href=\"javascript:false\" title=\"0 Wird nicht unterst\xFCtzt | 1 Unterst\xFCtzung\">\n                                    Frequenzsprungeinstellung\n                                </a>\n                            </span>\n                            <span>\n                                <input type=\"text\" value=\"0\" />\n                            </span> \n                         </div>\n                         <div>\n                            <span>\n                                <a href=\"javascript:false\" title=\"Timeout-Zeit f\xFCr Datenempfang: Wenn im Einzelempfangsmodus die Datensoftware nicht \xFCber diese Zeit hinaus empfangen wurde, meldet das Modul einen Timeout-Fehler und wechselt automatisch in Dezimal-Schreibweise in Millisekunden in den SLEEP-Modus (1-65535)\">\n                                    Timeout f\xFCr den Empfang von Daten\n                                </a>\n                            </span>\n                            <span>\n                                <input type=\"text\" value=\"0\" />\n                            </span>\n                         </div>\n                         <div>\n                            <span>\n                                <a href=\"javascript:false\" title=\"Benutzerdatenl\xE4nge, Dezimaldarstellung: Anwendung im impliziten Header-Modus, gibt die L\xE4nge der vom Modul gesendeten und empfangenen Daten an (diese L\xE4nge = tats\xE4chliche Benutzerdatenl\xE4nge + 4). Der Anzeigekopf ist ung\xFCltig.(5-255)\">\n                                    Benutzerdatenl\xE4nge\n                                </a>\n                            </span>\n                            <span>\n                                <input type=\"text\" value=\"3000\" />\n                            </span>\n                         </div>\n                         <div>\n                            <span>\n                                <a href=\"javascript:false\" title=\"Pr\xE4ambell\xE4nge, Dezimaldarstellung(4-65535)\">\n                                    Benutzerdatenl\xE4nge\n                                </a>\n                            </span>\n                            <span>\n                                <input type=\"text\" value=\"8\" />\n                            </span> \n                         </div>\n                         <div>\n                            <span>\n                                <a href=\"javascript:false\" title=\"\">\n                                    L\xE4nge der Pr\xE4ambel\n                                </a>\n                            </span>\n                            <span>\n                                <input type=\"text\" value=\"10\">\n                            </span>\n                         </div>\n                        <div><button>senden</button></div>\n                    </div>\n                </div>\n            </div>\n            </div>\n            <div class=\"sorted-logs-wrapper\">\n                <div data-id=\"expaneded-modal-new-input-container\">\n                <div>\n                    <div class=\"table-title\">Route Requests</div>\n                    <div class=\"table8\" data-id=\"log-route-request\">\n                        <div>\n                            <span>Time</span>\n                            <span>Sender</span>\n                            <span>U-Flag</span>\n                            <span>Request Id</span>\n                            <span>Origin Address</span>\n                            <span>Origin SequenceNumber</span>\n                            <span>Destination Address</span>\n                            <span>Destination Sequence Number</span>\n                        </div>\n                    </div>\n                </div>\n                <div>\n                    <div class=\"table-title\">Route Reply</div>\n                    <div class=\"table7\" data-id=\"log-route-reply\">\n                        <div>\n                            <span>Time</span>\n                            <span>Sender</span>\n                            <span>Hop Count</span>\n                            <span>Origin Address</span>\n                            <span>Destination Address</span>\n                            <span>Destination Sequence Number</span>\n                            <span>Lifetime</span>\n                        </div>\n                    </div>\n                </div>\n                <div>\n                    <div class=\"table-title\">Route Errors</div>\n                    <div class=\"table7\" data-id=\"log-route-error\">\n                        <div>\n                            <span>Time</span>\n                            <span>Sender</span>\n                            <span>Destination Count</span>\n                            <span>Unreachable Destination Address</span>\n                            <span>Unreachable Destination Sequence Number</span>\n                            <span>Additional Addresses</span>\n                            <span>Additional Sequence Number</span>\n                        </div>\n                    </div>\n                </div>\n                <div>\n                    <div class=\"table-title\">Send Text Request</div>\n                    <div class=\"table6\" data-id=\"log-send-text-request\">\n                        <div>\n                            <span>Time</span>\n                            <span>Sender</span>\n                            <span>Origin Address</span>\n                            <span>Destination Address</span>\n                            <span>Message Number</span>\n                            <span>Message</span>\n                        </div>\n                    </div>\n                </div>\n                <div>\n                    <div class=\"table-title\">Route Reply Acknowledge</div>\n                    <div class=\"table2\" data-id=\"log-route-reply-ack\">\n                        <div>\n                            <span>Time</span>\n                            <span>Sender</span>\n                        </div>\n                    </div>\n                </div>\n                <div>\n                    <div class=\"table-title\">Send Text Request Acknowledge</div>\n                    <div class=\"table3\" data-id=\"log-send-text-ack\">\n                        <div>\n                            <span>Time</span>\n                            <span>Sender</span>\n                            <span>Origin Address</span>\n                        </div>\n                    </div>\n                </div>\n                  <div>\n                    <div class=\"table-title\">Send Hop Acknowledge</div>\n                    <div class=\"table3\" data-id=\"log-send-hop-ack\">\n                        <div>\n                            <span>Time</span>\n                            <span>Sender</span>\n                            <span>Message Sequence Number</span>\n                        </div>\n                    </div>\n                </div>\n                </div>\n            </div>\n</div>\n    ";
  renderInto.appendChild(serialConsole);
  setTimeout(function () {
    var connection = new WebSocket('ws://localhost:8001/' + connectToDeviceId, ['soap', 'xmpp']);
    var log = [];
    var deviceId = undefined;
    var isReadOnly = undefined;
    var blacklist = undefined;
    var lan = undefined;
    var zIndex = 0;
    var shouldFollow = false;
    var isFullLog = false;
    var $windowCloseButton = document.querySelector(getQuerySelector(id, 'window-close-button'));
    var $header = document.querySelector(getQuerySelector(id, 'header'));
    var $log = document.querySelector(getQuerySelector(id, 'log'));
    var $logContainer = document.querySelector(getQuerySelector(id, 'log-container'));
    var $deviceId = document.querySelector(getQuerySelector(id, 'device-id'));
    var $readonlyLabel = document.querySelector(getQuerySelector(id, 'readonly-label'));
    var $blacklist = document.querySelector(getQuerySelector(id, 'blacklist'));
    var $lanContainer = document.querySelector(getQuerySelector(id, 'is-lan'));
    var $fullLogToggleButton = document.querySelector(getQuerySelector(id, 'full-log-toggle'));
    var $sendCommandButton = document.querySelector(getQuerySelector(id, 'send-text-serial-button'));
    var $sendCommandButtonInput = document.querySelector(getQuerySelector(id, 'send-text-serial-button-input'));
    var $followLogToggle = document.querySelector(getQuerySelector(id, 'follow-log-toggle'));
    var $serialConsoleContainer = document.querySelector(getQuerySelector(id, 'serial-console-container'));
    /**
     * Table Log
     */

    var $logRouteRequest = document.querySelector(getQuerySelector(id, 'log-route-request'));
    var $logRouteReply = document.querySelector(getQuerySelector(id, 'log-route-reply'));
    var $logRouteReplyAck = document.querySelector(getQuerySelector(id, 'log-route-reply-ack'));
    var $logRouteError = document.querySelector(getQuerySelector(id, 'log-route-error'));
    var $logSendText = document.querySelector(getQuerySelector(id, 'log-send-text-request'));
    var $logSendTextAck = document.querySelector(getQuerySelector(id, 'log-send-text-ack'));
    var $logSendHopAck = document.querySelector(getQuerySelector(id, 'log-send-hop-ack'));
    /**
     * Add table entries
     *
     * ALWAYS REMOVE TYPE FROM PAYLOAD
     */

    var addTableEntry = function addTableEntry(sender, type, payload, isOwn) {
      payload = Buffer.from(payload);
      var payloadObject;
      var row;
      row = document.createElement('div');
      row.classList.add('blink-on-create');

      if (isOwn) {
        row.classList.add('own-log-entry');
      } else {
        row.classList.add('other-log-entry');
      }

      switch (type) {
        case 'RREQ':
          payloadObject = _packages.default.read.rreq(payload);
          row.innerHTML = "\n<span>".concat(formattedTimestamp(), "</span>\n<span>").concat(sender, "</span>\n<span>").concat(payloadObject.uflag, "</span>\n<span>").concat(payloadObject.rreq_id, "</span>\n<span>").concat(payloadObject.originAddress, "</span>\n<span>").concat(payloadObject.originSequenceNumber, "</span>\n<span>").concat(payloadObject.destinationAddress, "</span>\n<span>").concat(payloadObject.destinationSequenceNumber, "</span>");
          $logRouteRequest.appendChild(row);
          break;

        case 'RREP':
          payloadObject = _packages.default.read.rrep(payload);
          row.innerHTML = "\n<span>".concat(formattedTimestamp(), "</span>\n<span>").concat(sender, "</span>\n<span>").concat(payloadObject.hopCount, "</span>\n<span>").concat(payloadObject.originAddress, "</span>\n<span>").concat(payloadObject.destinationAddress, "</span>\n<span>").concat(payloadObject.destinationSequenceNumber, "</span>\n<span>").concat(payloadObject.lifetime, "</span>");
          $logRouteReply.appendChild(row);
          break;

        case 'RERR':
          payloadObject = _packages.default.read.rerr(payload);
          row.innerHTML = "\n<span>".concat(formattedTimestamp(), "</span>\n<span>").concat(sender, "</span>\n<span>").concat(payloadObject.destinationCount, "</span>\n<span>").concat(payloadObject.unreachableDestinationAddress, "</span>\n<span>").concat(payloadObject.unreachableDestinationSequenceNumber, "</span>\n<span>").concat(payloadObject.additionalAddresses, "</span>\n<span>").concat(payloadObject.additionalSequenceNumber, "</span>");
          $logRouteError.appendChild(row);
          break;

        case 'RREP_ACK':
          payloadObject = _packages.default.read.rrep_ack(payload);
          row.innerHTML = "\n<span>".concat(formattedTimestamp(), "</span>\n<span>").concat(sender, "</span>");
          $logRouteReplyAck.appendChild(row);
          break;

        case 'SEND_TEXT_REQUEST':
          payloadObject = _packages.default.read.send_text_request(payload);
          row.innerHTML = "\n<span>".concat(formattedTimestamp(), "</span>\n<span>").concat(sender, "</span>\n<span>").concat(payloadObject.originAddress, "</span>\n<span>").concat(payloadObject.destinationAddress, "</span>\n<span>").concat(payloadObject.messageSequenceNumber, "</span>\n<span>").concat(payloadObject.message, "</span>");
          $logSendText.appendChild(row);
          break;

        case 'SEND_HOP_ACK':
          payloadObject = _packages.default.read.send_hop_ack(payload);
          row.innerHTML = "\n<span>".concat(formattedTimestamp(), "</span>\n<span>").concat(sender, "</span>\n<span>").concat(payloadObject.messageSequenceNumber, "</span>");
          $logSendHopAck.appendChild(row);
          break;

        case 'SEND_TEXT_REQUEST_ACK':
          payloadObject = _packages.default.read.send_text_request_ack(payload);
          row.innerHTML = "\n<span>".concat(formattedTimestamp(), "</span>\n<span>").concat(sender, "</span>\n<span>").concat(payloadObject.originAddress, "</span>");
          $logSendTextAck.appendChild(row);
          break;
      }
    };
    /**
     * Predefined Packages Show Button
     **/


    var $showNewRouteRequest = document.querySelector(getQuerySelector(id, 'show-new-route-request'));
    var $showNewRouteReplyAck = document.querySelector(getQuerySelector(id, 'show-new-route-reply-ack'));
    var $showNewRouteReply = document.querySelector(getQuerySelector(id, 'show-new-route-reply'));
    var $showNewRouteError = document.querySelector(getQuerySelector(id, 'show-new-route-error'));
    var $showNewHopAcknowledge = document.querySelector(getQuerySelector(id, 'show-new-send-hop-acknowledge'));
    var $showNewTextRequest = document.querySelector(getQuerySelector(id, 'show-new-send-text-request'));
    var $showNewTextRequestAck = document.querySelector(getQuerySelector(id, 'show-new-send-text-request-acknowledge'));
    var $showManageReceiving = document.querySelector(getQuerySelector(id, 'show-manage-receiving'));
    var $showLoraConfig = document.querySelector(getQuerySelector(id, 'show-lora-config'));
    /**
     * Predefined Packages
     **/

    var $newRouteRequest = document.querySelector(getQuerySelector(id, 'expaneded-modal-new-route-request'));
    var $newRouteReplyAck = document.querySelector(getQuerySelector(id, 'expaneded-modal-new-route-reply-ack'));
    var $newRouteReply = document.querySelector(getQuerySelector(id, 'expaneded-modal-new-route-reply'));
    var $newRouteError = document.querySelector(getQuerySelector(id, 'expaneded-modal-new-route-error'));
    var $newHopAcknowledge = document.querySelector(getQuerySelector(id, 'expaneded-modal-new-send-hop-acknowledge'));
    var $newTextRequest = document.querySelector(getQuerySelector(id, 'expaneded-modal-new-send-text-request'));
    var $newTextRequestAck = document.querySelector(getQuerySelector(id, 'expaneded-modal-new-send-text-request-acknowledge'));
    var $manageReceiving = document.querySelector(getQuerySelector(id, 'expaneded-modal-manage-receiving'));
    var $loraConfig = document.querySelector(getQuerySelector(id, 'expaneded-modal-lora-config'));
    /**
     * Root Container
     **/

    var $container = document.querySelector('#' + id);
    var $menu = [$newRouteRequest, $newRouteReply, $newRouteReplyAck, $newRouteError, $newHopAcknowledge, $newTextRequest, $newTextRequestAck, $manageReceiving, $loraConfig];
    var $menuButtons = [$showNewRouteRequest, $showNewRouteReply, $showNewRouteReplyAck, $showNewRouteError, $showNewHopAcknowledge, $showNewTextRequest, $showNewTextRequestAck, $showManageReceiving, $showLoraConfig];
    var elements = {
      $windowCloseButton: $windowCloseButton,
      $header: $header,
      $log: $log,
      $logContainer: $logContainer,
      $deviceId: $deviceId,
      $readonlyLabel: $readonlyLabel,
      $serialConsoleContainer: $serialConsoleContainer,
      $blacklist: $blacklist,
      $lanContainer: $lanContainer,
      $fullLogToggleButton: $fullLogToggleButton,
      $sendCommandButton: $sendCommandButton,
      $sendCommandButtonInput: $sendCommandButtonInput,
      $followLogToggle: $followLogToggle,
      $menu: $menu,
      $menuButtons: $menuButtons,
      $newRouteRequest: $newRouteRequest,
      $newRouteReply: $newRouteReply,
      $newRouteError: $newRouteError,
      $newHopAcknowledge: $newHopAcknowledge,
      $newTextRequest: $newTextRequest,
      $newTextRequestAck: $newTextRequestAck,
      $container: $container
      /**
       * close window
       */

    };

    var closeWindow = function closeWindow() {
      $container.remove();
      connection.close();
    };
    /**
     * create draggable window
     */
    // move to top on move


    var moveToTop = function moveToTop() {
      zIndex = window.zIndexHandler + 1;
      window.zIndexHandler = zIndex;
      $container.style.zIndex = zIndex;
    };

    var windowFollowMouse = false;
    $container.addEventListener('mousedown', function () {
      windowFollowMouse = true;
      moveToTop();
    }, false);
    document.addEventListener('mouseup', function () {
      windowFollowMouse = false;
    }, false);
    window.addEventListener('mousemove', function (event) {
      if (windowFollowMouse) {
        var deltaX = event.movementX;
        var deltaY = event.movementY;
        var rect = $container.getBoundingClientRect();
        $container.style.left = rect.x + deltaX * 1.6 + 'px';
        $container.style.top = rect.y + deltaY * 1.6 + 'px';
      }
    }, false);

    var showNewRouteRequest = function showNewRouteRequest() {
      for (var i = 0; i < $menu.length; i++) {
        if (!$menu[i].classList.contains('hidden')) {
          $menu[i].classList.add('hidden');
        }
      }

      $newRouteRequest.classList.remove('hidden');
    };

    var showNewRouteReplyAck = function showNewRouteReplyAck() {
      for (var i = 0; i < $menu.length; i++) {
        if (!$menu[i].classList.contains('hidden')) {
          $menu[i].classList.add('hidden');
        }
      }

      $newRouteReplyAck.classList.remove('hidden');
    };

    var showNewRouteReply = function showNewRouteReply() {
      for (var i = 0; i < $menu.length; i++) {
        if (!$menu[i].classList.contains('hidden')) {
          $menu[i].classList.add('hidden');
        }
      }

      $newRouteReply.classList.remove('hidden');
    };

    var showNewRouteError = function showNewRouteError() {
      for (var i = 0; i < $menu.length; i++) {
        if (!$menu[i].classList.contains('hidden')) {
          $menu[i].classList.add('hidden');
        }
      }

      $newRouteError.classList.remove('hidden');
    };

    var showNewHopAcknowledge = function showNewHopAcknowledge() {
      for (var i = 0; i < $menu.length; i++) {
        if (!$menu[i].classList.contains('hidden')) {
          $menu[i].classList.add('hidden');
        }
      }

      $newHopAcknowledge.classList.remove('hidden');
    };

    var showNewTextRequest = function showNewTextRequest() {
      for (var i = 0; i < $menu.length; i++) {
        if (!$menu[i].classList.contains('hidden')) {
          $menu[i].classList.add('hidden');
        }
      }

      $newTextRequest.classList.remove('hidden');
    };

    var showNewTextRequestAck = function showNewTextRequestAck() {
      for (var i = 0; i < $menu.length; i++) {
        if (!$menu[i].classList.contains('hidden')) {
          $menu[i].classList.add('hidden');
        }
      }

      $newTextRequestAck.classList.remove('hidden');
    };

    var showManageReciving = function showManageReciving() {
      for (var i = 0; i < $menu.length; i++) {
        if (!$menu[i].classList.contains('hidden')) {
          $menu[i].classList.add('hidden');
        }
      }

      $manageReceiving.classList.remove('hidden');
    };

    var showLoraConfig = function showLoraConfig() {
      for (var i = 0; i < $menu.length; i++) {
        if (!$menu[i].classList.contains('hidden')) {
          $menu[i].classList.add('hidden');
        }
      }

      $loraConfig.classList.remove('hidden');
    };

    var once = false;

    var toggleFullLog = function toggleFullLog(oneTimeFlag) {
      if (once && oneTimeFlag === true) {
        return;
      }

      if (!isFullLog) {
        connection.send('@@@UPGRADE@@@');
        $fullLogToggleButton.innerText = '(deactive full log)';
        isFullLog = true;
      } else {
        connection.send('@@@DOWNGRADE@@@');
        $fullLogToggleButton.innerText = '(active full log)';
        isFullLog = false;
      }

      once = true;
    };

    var toggleFollowLog = function toggleFollowLog() {
      var toggled = $followLogToggle.checked;
      shouldFollow = toggled;
    };

    var setReadOnly = function setReadOnly() {
      /**
       * Upgrade Protocol
       * @type {boolean}
       */
      toggleFullLog(true);
      isReadOnly = true;
      $serialConsoleContainer.classList.add('disabled');
      $header.classList.add('application-menu--disabled');
      $sendCommandButtonInput.classList.add('disabled');
      $sendCommandButtonInput.setAttribute('disabled', 'true');
      $sendCommandButton.classList.add('disabled');
      $sendCommandButton.setAttribute('disabled', 'true');
      $serialConsoleContainer.classList.remove('serial-console-container--active');
      $serialConsoleContainer.classList.add('serial-console-container--disabled');
      $container.classList.remove('enabled');
      $readonlyLabel.classList.remove('hidden');
      /**
       * disable predefined events
       */

      elements.$menuButtons.forEach(function (element) {
        element.setAttribute('disabled', "true");
      });

      for (var i = 0; i < elements.$menu.length; i++) {
        debugger;
        elements.$menu[i].querySelectorAll('input').forEach(function (element) {
          element.setAttribute('disabled', true);
        });
        elements.$menu[i].querySelectorAll('* button').forEach(function (element) {
          element.setAttribute('disabled', true);
        });
      }
    };

    var getReadOnlyStatus = function getReadOnlyStatus() {
      return isReadOnly;
    };

    var setReadOnlySendedRequest = function setReadOnlySendedRequest(sended) {
      var newLogEntry = document.createElement('div');
      var showText = 'BINARY PACKAGE:  [';

      if (sended[0] === 'A' && sended[1] === 'T') {
        showText = sended;
      } else if (sended[0] === 'L' && sended[1] === 'R') {} else {
        var type = (0, _types.getType)(sended);

        _appendLogFormatted(deviceId, type, sended.slice(1, sended.length), true);

        return;
      }

      newLogEntry.innerText = showText;
      $log.appendChild(newLogEntry);
      return;
    };

    var setBlacklist = function setBlacklist(newBlacklist) {
      $blacklist.innerHTML = '';

      for (var i = 1; i <= 20; i++) {
        var blackListBoxes = document.createElement('div');
        blackListBoxes.classList.add('blacklist-item');
        blackListBoxes.innerText = i.toString();

        if (newBlacklist.indexOf(i.toString()) === -1) {
          blackListBoxes.classList.add('green-blacklist-status');
        } else {
          blackListBoxes.classList.add('red-blacklist-status');
        }

        blackListBoxes.addEventListener('click', function (event) {
          var blackListId = event.target.innerText;
          var index = newBlacklist.indexOf(blackListId);

          if (index === -1) {
            newBlacklist.push(blackListId);
          } else {
            var removedItem = newBlacklist.splice(index, 1);
          }

          connection.send('@@@BLACKLIST@@@' + newBlacklist.join(','));
          setBlacklist(newBlacklist);
        });
        $blacklist.appendChild(blackListBoxes);
      }
    };

    var getBlacklist = function getBlacklist() {
      return blacklist;
    };

    var setLan = function setLan(value) {
      lan = value;

      if (value === 'true') {
        $lanContainer.innerText = '✓';
        return;
      }

      $lanContainer.innerText = '❌';
    };

    var getLan = function getLan() {
      return lan;
    };

    var setDeviceId = function setDeviceId(newDeviceId) {
      deviceId = newDeviceId;
      $deviceId.innerText = deviceId;
    };

    var getDeviceId = function getDeviceId() {
      return deviceId;
    };

    var createLogEntryTemplate = function createLogEntryTemplate(log, type) {
      var newLogEntry = document.createElement('div');
      newLogEntry.innerText = log;
      newLogEntry.classList.add(type);
      return newLogEntry;
    };

    var followLogAction = function followLogAction() {
      if (shouldFollow) {
        $logContainer.scrollTo($logContainer.scrollWidth, $logContainer.scrollHeight);
      }
    };

    var appendLog = function appendLog(data, type) {
      var isOwn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var logentry = createLogEntryTemplate(data, type);

      if (data[0] === 'L' && data[1] === 'R') {
        /* try to parse binary packages*/
        var _data$split = data.split(','),
            _data$split2 = _slicedToArray(_data$split, 4),
            LRorAT = _data$split2[0],
            sender = _data$split2[1],
            size = _data$split2[2],
            payloadData = _data$split2[3];

        var _type = (0, _types.getType)(payloadData);

        var payloadDataWithoutType = payloadData.slice(1, payloadData.length);

        if (_type == null) {
          $log.appendChild(logentry);
          followLogAction();
          return;
        }

        _appendLogFormatted(sender, _type, payloadDataWithoutType, isOwn);
      } else {
        $log.appendChild(logentry);
      }

      followLogAction();
    };

    var _appendLogFormatted = function _appendLogFormatted(sender, type, payloadDataWithoutType) {
      var isOwn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var binaryAsJson = null;

      switch (type) {
        case 'RREQ':
          binaryAsJson = _packages.default.read.rreq(payloadDataWithoutType);
          break;

        case 'RREP':
          binaryAsJson = _packages.default.read.rrep(payloadDataWithoutType);
          break;

        case 'RERR':
          binaryAsJson = _packages.default.read.rerr(payloadDataWithoutType);
          break;

        case 'RREP_ACK':
          binaryAsJson = _packages.default.read.rrep_ack(payloadDataWithoutType);
          break;

        case 'SEND_TEXT_REQUEST':
          binaryAsJson = _packages.default.read.send_text_request(payloadDataWithoutType);
          break;

        case 'SEND_HOP_ACK':
          binaryAsJson = _packages.default.read.send_hop_ack(payloadDataWithoutType);
          break;

        case 'SEND_TEXT_REQUEST_ACK':
          binaryAsJson = _packages.default.read.send_text_request_ack(payloadDataWithoutType);
          break;
      }

      var logentry = createLogEntryTemplate("[".concat(formattedTimestamp(), "][").concat(parseInt(sender).toString().padStart(2, '0'), "] (").concat(type, ")") + JSON.stringify(binaryAsJson), type);

      if (isOwn) {
        logentry.classList.add('own-log-entry');
      } else {
        logentry.classList.add('other-log-entry');
      }

      $log.appendChild(logentry);
      followLogAction();
      /**
       * add to sorted log
       */

      addTableEntry(sender, type, payloadDataWithoutType, isOwn);
      return logentry;
    };

    var pushToLog = function pushToLog(data) {
      log.push(data);
      appendLog(data, 'input');
    }; // When the connection is open, send some data to the server


    connection.onopen = function () {
      connection.send('AT+RST\r\n');
    }; // Log errors


    connection.onerror = function (error) {
      console.log('WebSocket Error ' + error);
    }; // Log messages from the server


    connection.onmessage = function (e) {
      if (e.data.startsWith('[used][readonly][rejected]')) {
        setReadOnly();
        return;
      }

      if (e.data.startsWith('[used][readonly][input]')) {
        setReadOnlySendedRequest(e.data.split('[used][readonly][input]')[1]);
        return;
      }

      if (e.data.startsWith('#start#')) {
        setBlacklist(JSON.parse(e.data.split('#start#')[1].split('#')[0].split(',')));
        setDeviceId(e.data.split('#start#')[1].split('#')[1]);
        setLan(e.data.split('#start#')[1].split('#')[2]);
        return;
      }

      pushToLog(e.data);
    };

    var sendCommand = function sendCommand(command) {
      appendLog(command, 'output', true); // optimistic update

      connection.send(command + '\r\n');
    };

    var sendMessage = function sendMessage(message) {
      appendLog("AT+SEND=".concat(message.length), 'output', true); // optimistic update

      var type = (0, _types.getType)(message);
      var messageWithoutType = message.slice(1, message.length);
      var binaryAsJson = null;

      switch (type) {
        case 'RREQ':
          binaryAsJson = _packages.default.read.rreq(messageWithoutType);
          break;

        case 'RREP':
          binaryAsJson = _packages.default.read.rrep(messageWithoutType);
          break;

        case 'RERR':
          binaryAsJson = _packages.default.read.rerr(messageWithoutType);
          break;

        case 'RREP_ACK':
          binaryAsJson = _packages.default.read.rrep_ack();
          break;

        case 'SEND_TEXT_REQUEST':
          binaryAsJson = _packages.default.read.send_text_request(messageWithoutType);
          break;

        case 'SEND_HOP_ACK':
          binaryAsJson = _packages.default.read.send_hop_ack(messageWithoutType);
          break;

        case 'SEND_TEXT_REQUEST_ACK':
          binaryAsJson = _packages.default.read.send_text_request_ack(messageWithoutType);
          break;
      }

      var formattedLogEntry = createLogEntryTemplate("[".concat(formattedTimestamp(), "][").concat(parseInt(deviceId).toString().padStart(2, '0'), "] (").concat(type, ")") + JSON.stringify(binaryAsJson), type);
      $log.classList.add('own-log-entry');
      $log.appendChild(formattedLogEntry);
      followLogAction();
      /**
       * Add to sorted log
       */

      addTableEntry(deviceId, type, messageWithoutType, true);
      connection.send("AT+SEND=".concat(message.length, "\r\n"));
      setTimeout(function () {
        connection.send(message + '\r\n');
      }, 350);
    };

    for (var i in window.serialConsoleIds) {
      var currentConsole = window.serialConsoleIds[i];

      if (currentConsole.id === id) {
        currentConsole.elements = elements;
        currentConsole.actions = {};
        currentConsole.actions.closeWindow = closeWindow;
        currentConsole.actions.showNewRouteRequest = showNewRouteRequest;
        currentConsole.actions.showNewRouteReply = showNewRouteReply;
        currentConsole.actions.showNewRouteReplyAck = showNewRouteReplyAck;
        currentConsole.actions.showNewRouteError = showNewRouteError;
        currentConsole.actions.showNewHopAcknowledge = showNewHopAcknowledge;
        currentConsole.actions.showNewTextRequest = showNewTextRequest;
        currentConsole.actions.showNewTextRequestAck = showNewTextRequestAck;
        currentConsole.actions.showManageReciving = showManageReciving;
        currentConsole.actions.showLoraConfig = showLoraConfig;
        currentConsole.actions.getReadOnlyStatus = getReadOnlyStatus;
        currentConsole.actions.getDeviceId = getDeviceId;
        currentConsole.actions.getBlacklist = getBlacklist;
        currentConsole.actions.getLan = getLan;
        currentConsole.actions.sendCommand = sendCommand;
        currentConsole.actions.sendMessage = sendMessage;
        currentConsole.actions.toggleFullLog = toggleFullLog;
        currentConsole.actions.toggleFollowLog = toggleFollowLog;
      }
    }

    moveToTop();
  }, 250);
  setTimeout(function () {
    attachEvents(id);
  }, 500);
  return {
    id: id,
    connectToDeviceId: connectToDeviceId
  };
};

exports.createSerialConsole = createSerialConsole;
},{"./../../src/client/packages/types":"../src/client/packages/types.js","../../src/client/packages":"../src/client/packages/index.js","buffer":"../node_modules/node-libs-browser/node_modules/buffer/index.js"}],"../src/client/commands/lora.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendText = exports.getMessages = exports.setConfig = exports.getStatsFromLastMessage = exports.setBroadcast = exports.setDestination = exports.setAddress = exports.resetModule = void 0;

/**
 * Lora specific commands
 */
var resetModule = function resetModule() {
  return "AT+RST";
};

exports.resetModule = resetModule;

var setAddress = function setAddress(address) {
  return "AT+ADDR=".concat(address);
};

exports.setAddress = setAddress;

var setDestination = function setDestination(address) {
  return "AT+DEST=".concat(address);
};

exports.setDestination = setDestination;

var setBroadcast = function setBroadcast() {
  return "AT+DEST=FFFF";
};

exports.setBroadcast = setBroadcast;

var getStatsFromLastMessage = function getStatsFromLastMessage() {
  return "AT+RSSI?";
}; // current: AT+CFG=433000000,20,9,10,4,1,0,0,0,0,3000,8,10


exports.getStatsFromLastMessage = getStatsFromLastMessage;

var setConfig = function setConfig() {
  var rfFrequency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 433000000;
  var power = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
  var bandwidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 9;
  var spreadingFactor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
  var errorCoding = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 4;
  var crc = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
  var implicitHeader = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var rxSingleOn = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
  var frequencyHopOn = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
  var hopPeriod = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
  var rxPacketTimeout = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 3000;
  var payloadLength = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : 8;
  var preambleLength = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 10;
  return "AT+CFG=".concat(rfFrequency, ",").concat(power, ",").concat(bandwidth, ",").concat(spreadingFactor, ",").concat(errorCoding, ",").concat(crc, ",").concat(implicitHeader, ",").concat(rxSingleOn, ",").concat(frequencyHopOn, ",").concat(hopPeriod, ",").concat(rxPacketTimeout, ",").concat(payloadLength, ",").concat(preambleLength);
};

exports.setConfig = setConfig;

var getMessages = function getMessages() {
  return 'AT+RX';
};

exports.getMessages = getMessages;

var sendText = function sendText(text) {
  return "AT+SEND=".concat(text.length);
};

exports.sendText = sendText;
},{}],"js/addEvents.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachEvents = void 0;

var _index = _interopRequireDefault(require("../../src/client/packages/index"));

var commands = _interopRequireWildcard(require("../../src/client/commands/lora"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var attachEvents = function attachEvents(id) {
  var $log = document.querySelector(getQuerySelector(id, 'log'));
  var $logContainer = document.querySelector(getQuerySelector(id, 'log-container'));
  var $deviceId = document.querySelector(getQuerySelector(id, 'device-id'));
  var $readonlyLabel = document.querySelector(getQuerySelector(id, 'readonly-label'));
  var $blacklist = document.querySelector(getQuerySelector(id, 'blacklist'));
  var $lanContainer = document.querySelector(getQuerySelector(id, 'is-lan'));
  var $fullLogToggleButton = document.querySelector(getQuerySelector(id, 'full-log-toggle'));
  var $sendCommandButton = document.querySelector(getQuerySelector(id, 'send-text-serial-button'));
  var $sendCommandButtonInput = document.querySelector(getQuerySelector(id, 'send-text-serial-button-input'));
  var $followLogToggle = document.querySelector(getQuerySelector(id, 'follow-log-toggle'));
  var $container = document.querySelector('#' + id);

  if (window.serialConsoleIds[id].actions === undefined) {
    setTimeout(function () {
      attachEvents(id);
    }, 300);
    return;
  }

  var currentSerialConsole = window.serialConsoleIds[id];
  currentSerialConsole.elements.$fullLogToggleButton.addEventListener('click', function () {
    currentSerialConsole.actions.toggleFullLog();
  });
  currentSerialConsole.elements.$windowCloseButton.addEventListener('click', function () {
    currentSerialConsole.actions.closeWindow();
  });
  currentSerialConsole.elements.$sendCommandButton.addEventListener('click', function () {
    currentSerialConsole.actions.sendCommand(currentSerialConsole.elements.$sendCommandButtonInput.value);
    currentSerialConsole.elements.$sendCommandButtonInput.value = '';
  });
  currentSerialConsole.elements.$followLogToggle.addEventListener('click', function () {
    currentSerialConsole.actions.toggleFollowLog();
  });
  currentSerialConsole.elements.$followLogToggle.addEventListener('click', function () {
    currentSerialConsole.actions.toggleFollowLog();
  });
  currentSerialConsole.elements.$menuButtons[0].addEventListener('click', function () {
    currentSerialConsole.actions.showNewRouteRequest();
  });
  currentSerialConsole.elements.$menuButtons[1].addEventListener('click', function () {
    currentSerialConsole.actions.showNewRouteReply();
  });
  currentSerialConsole.elements.$menuButtons[2].addEventListener('click', function () {
    currentSerialConsole.actions.showNewRouteReplyAck();
  });
  currentSerialConsole.elements.$menuButtons[3].addEventListener('click', function () {
    currentSerialConsole.actions.showNewRouteError();
  });
  currentSerialConsole.elements.$menuButtons[4].addEventListener('click', function () {
    currentSerialConsole.actions.showNewHopAcknowledge();
  });
  currentSerialConsole.elements.$menuButtons[5].addEventListener('click', function () {
    currentSerialConsole.actions.showNewTextRequest();
  });
  currentSerialConsole.elements.$menuButtons[6].addEventListener('click', function () {
    currentSerialConsole.actions.showNewTextRequestAck();
  });
  currentSerialConsole.elements.$menuButtons[7].addEventListener('click', function () {
    currentSerialConsole.actions.showManageReciving();
  });
  currentSerialConsole.elements.$menuButtons[8].addEventListener('click', function () {
    currentSerialConsole.actions.showLoraConfig();
  });
  /**
   * Send Packages
   */

  currentSerialConsole.elements.$menu[0].querySelector('button').addEventListener('click', function () {
    var inputs = currentSerialConsole.elements.$menu[0].querySelectorAll('input');

    var messagePackage = _index.default.send.rreq(parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value), parseInt(inputs[5].value), parseInt(inputs[6].value));

    currentSerialConsole.actions.sendMessage(messagePackage);
  });
  currentSerialConsole.elements.$menu[1].querySelector('button').addEventListener('click', function () {
    var inputs = currentSerialConsole.elements.$menu[1].querySelectorAll('input');

    var messagePackage = _index.default.send.rrep(parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value));

    currentSerialConsole.actions.sendMessage(messagePackage);
  });
  currentSerialConsole.elements.$menu[2].querySelector('button').addEventListener('click', function () {
    var messagePackage = _index.default.send.rrep_ack();

    currentSerialConsole.actions.sendMessage(messagePackage);
  });
  currentSerialConsole.elements.$menu[3].querySelector('button').addEventListener('click', function () {
    var inputs = currentSerialConsole.elements.$menu[3].querySelectorAll('input');

    var messagePackage = _index.default.send.rerr(parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value));

    currentSerialConsole.actions.sendMessage(messagePackage);
  });
  currentSerialConsole.elements.$menu[4].querySelector('button').addEventListener('click', function () {
    var inputs = currentSerialConsole.elements.$menu[4].querySelectorAll('input');

    var messagePackage = _index.default.send.send_hop_ack(parseInt(inputs[0].value));

    currentSerialConsole.actions.sendMessage(messagePackage);
  });
  currentSerialConsole.elements.$menu[5].querySelector('button').addEventListener('click', function () {
    var inputs = currentSerialConsole.elements.$menu[5].querySelectorAll('input');

    var messagePackage = _index.default.send.send_text_request(parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), inputs[3].value);

    currentSerialConsole.actions.sendMessage(messagePackage);
  });
  currentSerialConsole.elements.$menu[7].querySelectorAll('button')[0].addEventListener('click', function () {
    var messagePackage = commands.getMessages();
    currentSerialConsole.actions.sendCommand(messagePackage);
  });
  currentSerialConsole.elements.$menu[7].querySelectorAll('button')[1].addEventListener('click', function () {
    var inputs = currentSerialConsole.elements.$menu[7].querySelectorAll('input');
    currentSerialConsole.actions.sendCommand(commands.setDestination(inputs[0].value));
  });
  currentSerialConsole.elements.$menu[7].querySelectorAll('button')[2].addEventListener('click', function () {
    var inputs = currentSerialConsole.elements.$menu[7].querySelectorAll('input');
    currentSerialConsole.actions.sendCommand(commands.setAddress(inputs[1].value));
  });
  currentSerialConsole.elements.$menu[8].querySelector('button').addEventListener('click', function () {
    var inputs = currentSerialConsole.elements.$menu[8].querySelectorAll('input');
    var messagePackage = commands.setConfig(parseInt(inputs[0].value), parseInt(inputs[1].value), parseInt(inputs[2].value), parseInt(inputs[3].value), parseInt(inputs[4].value), parseInt(inputs[5].value), parseInt(inputs[6].value), parseInt(inputs[7].value), parseInt(inputs[8].value), parseInt(inputs[9].value), parseInt(inputs[10].value), parseInt(inputs[11].value), parseInt(inputs[12].value));
    currentSerialConsole.actions.sendCommand(messagePackage);
  });
  console.log(window.serialConsoleIds[id].actions.getDeviceId());
};

exports.attachEvents = attachEvents;

var sendBinaryPackage = function sendBinaryPackage() {};
},{"../../src/client/packages/index":"../src/client/packages/index.js","../../src/client/commands/lora":"../src/client/commands/lora.js"}],"js/index.js":[function(require,module,exports) {

"use strict";

var _createSerialConsole = require("./createSerialConsole");

var _addEvents = require("./addEvents");

/**
 * Buffer polyfill
 */
var Buffer = require('buffer/').Buffer;

/**
 * Query Selector for unique windows
 * @param id
 * @param name
 * @returns {string}
 */
window.getQuerySelector = function (id, name) {
  return "#".concat(id, " [data-id=\"").concat(name, "\"]");
};
/**
 * Header Handler
 **/


var $spawnButton = document.getElementById('spawnConsoleButton');
var $spawnButtonInput = document.getElementById('spawnConsoleButton-input');
$spawnButton.addEventListener('click', function () {
  var main = document.getElementsByTagName('main')[0];
  var serialConsoleId = (0, _createSerialConsole.createSerialConsole)(main, $spawnButtonInput.value, _addEvents.attachEvents);
  serialConsoleIds[serialConsoleId.id] = serialConsoleId;
});
/**
 * Serial Console Handler
 */

window.serialConsoleIds = {};
document.addEventListener("DOMContentLoaded", function (event) {
  var main = document.getElementsByTagName('main')[0];
  var serialConsoleId = (0, _createSerialConsole.createSerialConsole)(main, 11, _addEvents.attachEvents);
  serialConsoleIds[serialConsoleId.id] = serialConsoleId;
});
},{"buffer/":"../node_modules/buffer/index.js","./createSerialConsole":"js/createSerialConsole.js","./addEvents":"js/addEvents.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62848" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map