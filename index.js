const ethWallet = require('ethereumjs-wallet')
const ethTx = require('ethereumjs-tx')
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')

//const mnemonic = bip39.generateMnemonic()
const mnemonic = "time unhappy fade domain stairs tape roof nephew walk erase magnet main"
console.log('['+mnemonic+']')

/*var wallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic)).getWallet()
console.log(wallet.toV3String('2006'))
var wallet = hdkey.fromMasterSeed(bip39.mnemonicToSeedHex(mnemonic)).getWallet()
console.log(wallet.toV3String('2006'))
var wallet = hdkey.fromMasterSeed(mnemonic).getWallet()
console.log(wallet.toV3String('2006'))*/

var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/0";
var wallet = hdwallet.derivePath(wallet_hdpath).getWallet();

console.log(wallet.getAddress().toString('hex'))
const v3 = wallet.toV3String('2006')
console.log(v3)



var v3Wallet = ethWallet.fromV3(v3, '2006')
var privateKey = v3Wallet.getPrivateKey()

var tx = new ethTx(null, 1)

console.log('-')
console.log('-')
console.log('-')
console.log('-')

tx.nonce = 0
tx.gasPrice = 100
tx.gasLimit = 1000
tx.value = 0

tx.sign(privateKey)
// We have a signed transaction, Now for it to be fully fundable the account that we signed
// it with needs to have a certain amount of wei in to. To see how much this
// account needs we can use the getUpfrontCost() method.
var feeCost = tx.getUpfrontCost()
tx.gas = feeCost
console.log('Total Amount of wei needed:' + feeCost.toString())

// if your wondering how that is caculated it is
// bytes(data length) * 5
// + 500 Default transaction fee
// + gasAmount * gasPrice

// lets serialize the transaction

console.log('---Serialized TX----')
console.log(tx.serialize().toString('hex'))
console.log('--------------------')

var tx2 = new ethTx(tx)

// Note rlp.decode will actully produce an array of buffers `new Transaction` will
// take either an array of buffers or an array of hex strings.
// So assuming that you were able to parse the tranaction, we will now get the sender's
// address

console.log('Senders Address: ' + tx2.getSenderAddress().toString('hex'))

// Cool now we know who sent the tx! Lets verfy the signature to make sure it was not
// some poser.

if (tx2.verifySignature()) {
  console.log('Signature Checks out!')
}

// Now that we have the serialized transaction we can get AlethZero to except by
// selecting debug>inject transaction and pasting the transaction serialization and
// it should show up in pending transaction.

// Parsing & Validating transactions
// If you have a transaction that you want to verify you can parse it. If you got
// it directly from the network it will be rlp encoded. You can decode you the rlp
// module. After that you should have something like
var rawTx = [
  '0x00',
  '0x09184e72a000',
  '0x2710',
  '0x0000000000000000000000000000000000000000',
  '0x00',
  '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
  '0x1c',
  '0x5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
  '0x5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
]

var tx2 = new ethTx(rawTx)

// Note rlp.decode will actully produce an array of buffers `new Transaction` will
// take either an array of buffers or an array of hex strings.
// So assuming that you were able to parse the tranaction, we will now get the sender's
// address

console.log('Senders Address: ' + tx2.getSenderAddress().toString('hex'))

// Cool now we know who sent the tx! Lets verfy the signature to make sure it was not
// some poser.

if (tx2.verifySignature()) {
  console.log('Signature Checks out!')
}

// And hopefully its verified. For the transaction to be totally valid we would
// also need to check the account of the sender and see if they have at least
// `TotalFee`.
