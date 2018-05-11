const {
    SHA256
} = require('crypto-js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



// const message = {
//     text: 'This is a test message'
// };
// const hash = SHA256(message).toString();
// console.log(hash);

// const token = jwt.sign(message, 'acer4830');
// console.log(token);

// const decoded = jwt.verify(token, 'acer4830');
// console.log(decoded);

const password = 'secret_password123';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
})


const hashed = '$2a$10$Jg64hOSCrN4uEfARK65iC.p8fZKsfD4Z5hHnJBwTFDqe46RIxe..i';
bcrypt.compare(password, hashed, (err, res) => {
    console.log(res);
})