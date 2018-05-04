const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})



const User = mongoose.model('User', {
    name: {
        type: String,
        trim: true,
        minlength: 1
    },

    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

var eugene = new User({
    name: 'Eugene',
    email: 'kfamily66@yandex.ru'
});

eugene.save().then((doc) => {
    console.log(`${doc.name} is saved!`);

}, (e) => {
    console.log('Unable to save user,', e);

})

// var todo = new Todo({
//     text: 'Create first todo',
//     completed: true
// });

// var todo = new Todo({
//     text: "            Create second todo            ",
//     // completed: true,
//     // completedAt: new Date()
// })

// todo.save().then((doc) => {
//     console.log('Saved todo:', JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save todo', e);

// });