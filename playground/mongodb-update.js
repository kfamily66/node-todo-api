const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable connect to mongodb server');
    }

    // db.collection('Users').findOneAndUpdate({
    //     name: 'Test'
    // }, {
    //     $set: {
    //         name: 'Eugene'
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });


    // db.collection('Users').findOneAndUpdate({
    //     name: 'Eugene'
    // }, {
    //     $inc: {
    //         age: 1
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5aeb3f32f9c31f49fd410137")
    }, {
        $set: {
            name: "Mike"
        },
        $inc: {
            age: -2
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });


})