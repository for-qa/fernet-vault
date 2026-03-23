const readline = require('readline');
const fernet = require('fernet');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateSecret() {
  // Generate a base64-encoded 32-byte random sequence
  const crypto = require('crypto');
  const secretKey = crypto.randomBytes(32).toString('base64');
  const secret = new fernet.Secret(secretKey);
  console.log('\nGenerated Secret:');
  console.log(secretKey);
  return secret;
}

function createToken(secret) {
  rl.question('\nEnter message to encode: ', (message) => {
    const token = new fernet.Token({
      secret: secret,
      time: new Date()
    });
    const encoded = token.encode(message);
    console.log('\nEncoded Token:');
    console.log(encoded);
    showMenu(secret);
  });
}

function decodeToken(secret) {
  rl.question('\nEnter token to decode: ', (tokenString) => {
    try {
      const token = new fernet.Token({
        secret: secret,
        token: tokenString,
        ttl: 0
      });
      const decoded = token.decode();
      console.log('\nDecoded Message:');
      console.log(decoded);
    } catch (error) {
      console.log('\nError decoding token:', error.message);
    }
    showMenu(secret);
  });
}

function showMenu(secret) {
  console.log('\nFernet Token Operations:');
  console.log('1. Create new Secret');
  console.log('2. Create Encoded Token');
  console.log('3. Decode Token');
  console.log('4. Exit');

  rl.question('\nSelect an option (1-4): ', (choice) => {
    switch (choice) {
      case '1':
        const newSecret = generateSecret();
        showMenu(newSecret);
        break;
      case '2':
        createToken(secret);
        break;
      case '3':
        decodeToken(secret);
        break;
      case '4':
        rl.close();
        break;
      default:
        console.log('Invalid option. Please try again.');
        showMenu(secret);
    }
  });
}

// Start the application
console.log('Welcome to Fernet Token Operations');
console.log('\nDo you want to:');
console.log('1. Use an existing secret');
console.log('2. Generate a new secret');

rl.question('\nSelect an option (1-2): ', (choice) => {
  switch (choice) {
    case '1':
      rl.question('\nEnter your existing secret: ', (secretKey) => {
        try {
          const secret = new fernet.Secret(secretKey);
          console.log('\nUsing provided secret');
          showMenu(secret);
        } catch (error) {
          console.log('\nInvalid secret format. Please try again.');
          rl.close();
        }
      });
      break;
    case '2':
      const newSecret = generateSecret();
      showMenu(newSecret);
      break;
    default:
      console.log('Invalid option. Please try again.');
      rl.close();
  }
}); 