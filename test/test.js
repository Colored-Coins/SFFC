var balz = require(__dirname + '/../sffcEncoder')
var assert = require('assert')
var fullRunLength = 1000000
var maxNumber = 9007199254740992
var samples = [
  928867423145164,
  132300400000,
  1323004030000,
  32300400400,
  2300400002,
  1768474864449384,
  7684748644493848,
  11111111111111111,
  12222222222222222,
  13333333333333333,
  3333333333232323,
  2343241324231432,
  9007199254740991,
  9007199254740992,
  4823750656226800
]

var consumer = function (buff) {
  var curr = 0
  return function consume (len) {
    return buff.slice(curr, curr += len)
  }
}

// console.log(balz.decode(consumer(new Buffer('e0ffffffffffff', 'hex'))))

describe('BALZ Encoding', function () {
  it('should return the right encoding for numbers 1-31', function (done) {
    this.timeout(0)
    var labz_code

    for (var i = 1; i < 32; i++) {
      labz_code = balz.encode(i)
      var buf = new Buffer(1)
      buf.writeUInt8(i)
      assert(labz_code.length === 1, 'Wrong encoding length')
      assert(labz_code.toString('hex') === buf.toString('hex'), 'Wrong encoding')
    }

    done()
  })

  it('should return errors', function (done) {
    assert.throws(function () {
      balz.encode(0) === null
    }, 'Can\'t Encode Zero',
    'Should have returned null')
    done()
  })

})

describe('Encode/Decode', function (done) {
  it('should return the right decoding for a range run', function (done) {
    this.timeout(0)
    for (var i = 1; i < fullRunLength; i++) {
      var labz_code = balz.encode(i)
      assert.equal(balz.decode(consumer(labz_code)), i, 'Wrong encode/decode fullRunLength')
    }
    done()
  })
  it('should return the right decoding for sample run', function (done) {
    this.timeout(0)
    for (var i = 0; i < samples.length; i++) {
      var labz_code = balz.encode(samples[i])
      assert.equal(balz.decode(consumer(labz_code)), samples[i], 'Wrong encode/decode sample')
    }
    done()
  })
  it('should return the right decoding for a random range run', function (done) {
    this.timeout(0)
    for (var i = 0; i < fullRunLength; i++) {
      var number = Math.floor(Math.random() * maxNumber) + 1
      var labz_code = balz.encode(number)
      assert.equal(balz.decode(consumer(labz_code)), number, 'Wrong encode/decode random')
    }
    done()
  })
})
