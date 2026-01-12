const crypto = require('crypto');

// 1. Generate RSA Key Pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // Secure key size
});

const dataToSign = "This is the file content I want to sign.";

// 2. Sign the Data (using Private Key)
const sign = crypto.createSign('SHA256');
sign.update(dataToSign);
sign.end();

const signature = sign.sign(privateKey, 'hex');
console.log(`Digital Signature: ${signature}`);

// 3. Verify the Data (using Public Key)
const verify = crypto.createVerify('SHA256');
verify.update(dataToSign);
verify.end();

const isVerified = verify.verify(publicKey, signature, 'hex');
console.log(`Is the signature valid? ${isVerified}`);