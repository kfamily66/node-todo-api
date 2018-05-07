const {
    ObjectId
} = require('mongodb');


const {
    mongoose
} = require('./../server/db/mongoose');
const {
    Todo
} = require('./../server/models/todo');
const {
    User
} = require('./../server/models/user');




const id = '5af065b134a50d2d908e48f3';
const user_id = '5aec18ab5915431d3c1fc06c';
// console.log(ObjectId.isValid(id));



// Todo.find().then((todos) => {
//     console.log('Todos:', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo:', todo);
// });

// Todo.findById(id).then((todo) => {
//     console.log('Todo by ID:', todo);
// }).catch((err) => {
//     console.log(err);
// });

User.findById(user_id).then((user) => {
    if (!user) {
        return console.log('Unable to find this user');
    }
    console.log('User:', user);
}, (err) => {
    console.log(err);
});