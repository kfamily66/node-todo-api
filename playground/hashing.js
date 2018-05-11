const {
    SHA256
} = require('crypto-js');

const jwt = require('jsonwebtoken');


const message = {
    text: 'This is a test message'
};
const hash = SHA256(message).toString();
console.log(hash);

const token = jwt.sign(message, 'acer4830');
console.log(token);

const decoded = jwt.verify(token, 'acer4830');
console.log(decoded);