const nodeRSA = require('node-rsa');

class Crypt {
  constructor() {}

  encrypt(text, publicKey) {
    const key = new nodeRSA();
    key.importKey(publicKey, 'openssh-pem-public');
    let status = 'success';
    let encrpted;
    try {
      encrpted = key.encrypt(text, 'base64');
    } catch (e) {
      status = 'error';
    }
    return status == 'success' ? encrpted : null;
  }

  decrypt(text, privateKey) {
    const key = new nodeRSA();
    key.importKey(privateKey, 'openssh-pem-private');
    let status = 'success';
    let decrypted;
    try {
      decrypted = key.decrypt(text, 'utf8');
    } catch (e) {
      status = 'error';
    }
    return status == 'success' ? decrypted : null;
  }

  generate = () => {
    const key = new nodeRSA({ b: 512 });
    return {
      publicKey: key.exportKey('openssh-pem-public'),
      privateKey: key.exportKey('openssh-pem-private'),
    };
  };
}
const enc = new Crypt();
export default enc;
