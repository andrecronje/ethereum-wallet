const ethWallet = require('ethereumjs-wallet')
const ethTx = require('ethereumjs-tx')
const bip39 = require('bip39')
const hdkey = require('ethereumjs-wallet/hdkey')
const Web3 = require('web3')
const ethUtil = require('ethereumjs-util')
const request = require('request')



request.get('https://ethgasstation.info/json/ethgasAPI.json', function(err,response,body) {
  console.log(err)
  console.log(body)
  var json;
  try {
    json = JSON.parse(body)
  } catch (err) {
    console.log(err)
  }
  console.log(json)
})

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
var web3Wallet = {
    privateKey: v3Wallet.getPrivateKeyString(),
    address: address
}
console.log(web3Wallet)
console.log(web3.eth.accounts.wallet.add(web3Wallet));

console.log(address)
web3.eth.getTransactionCount(address)
.then(function(count) {
  console.log(count)
  sendTransaction(count, privateKey)
})
.catch(function(err) {
  console.log(err)
})
web3.eth.getGasPrice()
.then(console.log);
web3.eth.getBalance(address)
.then(console.log);
web3.eth.estimateGas({
    to: address,
    data: "0x7f7465737432000000000000000000000000000000000000000000000000000000600057"
})
.then(console.log);



function sendTransaction(nonce, privateKey) {
  var value = 1*1000000000000000000
  var gasPrice = 50
  var gasLimit = 21464
  const txParams = {
    nonce: ethUtil.addHexPrefix(nonce.toString(16)),
    gasPrice: ethUtil.addHexPrefix(gasPrice.toString(16)),
    gasLimit: ethUtil.addHexPrefix(gasLimit.toString(16)),
    to: '0x0000000000000000000000000000000000000000',
    value: ethUtil.addHexPrefix(value.toString(16)),
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

  console.log('0x' + serializedTx.toString('hex'))
  /*web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
  .then(function(hash) {
    console.log(hash)
  })
  .catch(function(err) {
    console.log(err)
  })*/
  var tx2 = {
      from: address,
      to: address,
      value: value,
      gas: gasLimit,
      gasPrice: gasPrice
  }
  console.log(tx2)
  web3.eth.sendTransaction(tx2)
  .on('transactionHash', function(hash){
      console.log(hash)
  })
  .on('receipt', function(receipt){
      console.log(receipt)
  })
  .on('confirmation', function(confirmationNumber, receipt){
    console.log(confirmationNumber)
    console.log(receipt)
   })
  .on('error', console.error); // If a out of gas error, the second parameter is the receipt.*/
}
/*web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
});*/
