// const MongoClient = require('mongodb').MongoClient;

const { MongoClient, ObjectID } = require("mongodb");

var user = {
  name: "Eugene",
  age: 24
};

var { name } = user;

console.log(name);

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  // db.collection('Todos').insertOne({
  //     text: "Something to do",
  //     completed: false
  // }, (err, result) => {
  //     if (err) {
  //         return console.log('Unable to insert todo', err);
  //     }
  //     console.log(JSON.stringify(result.ops, undefined, 2));

  // });

  // db.collection('Users').insertOne({
  //     name: 'Eugene',
  //     age: 24,
  //     location: 'Lysva'
  // }, (err, result) => {
  //     if (err) {
  //         return console.log('Unable to insert user');
  //     }

  //     console.log(JSON.stringify(result.ops, undefined, 2));
  //     console.log(result.ops[0]._id.getTimestamp());

  // });

  db.close();
});
