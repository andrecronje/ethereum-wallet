const ethWallet = require('ethereumjs-wallet')
const ethTx = require('ethereumjs-tx')
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')
const Web3 = require('web3')
const ethUtil = require('ethereumjs-util')

//const mnemonic = bip39.generateMnemonic()
const mnemonic = "time unhappy fade domain stairs tape roof nephew walk erase magnet main"
console.log('['+mnemonic+']')


var hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

// Get the first account using the standard hd path.
var wallet_hdpath = "m/44'/60'/0'/0/0";
var wallet = hdwallet.derivePath(wallet_hdpath).getWallet();

console.log(wallet.getAddress().toString('hex'))
const v3 = wallet.toV3String('2006')
console.log(v3)



var v3Wallet = ethWallet.fromV3(v3, '2006')
var privateKey = v3Wallet.getPrivateKey()
var address = v3Wallet.getAddressString()


var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/metamask"))


const txParams = {
  nonce: ethUtil.addHexPrefix('0'.toString('hex')),
  gasPrice: ethUtil.addHexPrefix('5'.toString('hex')),
  gasLimit: ethUtil.addHexPrefix('21000'.toString('hex')),
  to: '0x0000000000000000000000000000000000000000',
  value: ethUtil.addHexPrefix('0.001'.toString('hex')),
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
  // EIP 155 chainId - mainnet: 1, ropsten: 3
  chainId: 3
}
console.log(txParams)

const tx = new ethTx(txParams)
tx.sign(privateKey)
const serializedTx = tx.serialize()


console.log('Senders Address: ' + tx.getSenderAddress().toString('hex'))

if (tx.verifySignature()) {
  console.log('Signature Checks out!')
}

console.log(address)
web3.eth.getTransactionCount(address)
.then(function(count) {
  console.log(count)
})
.catch(function(err) {
  console.log(err)
})

console.log('0x' + serializedTx.toString('hex'))
web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
.then(function(hash) {
  console.log(hash)
})
.catch(function(err) {
  console.log(err)
})

/*web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
});*/
