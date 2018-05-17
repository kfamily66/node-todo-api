const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if (err) {
    return console.log("Unable connect to MongoDb server", err);
  }

  // db.collection('Users').deleteMany({
  //     name: 'Eugene'
  // });

  // db.collection('Users').findOneAndDelete({
  //     name: 'Mike'
  // }).then((result) => {
  //     console.log(JSON.stringify(result, undefined, 2));
  // });

  db
    .collection("Users")
    .deleteOne({
      name: "Andrew"
    })
    .then(result => {
      console.log(result.result);
    });

  // db.collection('Users').findOneAndDelete({
  //     _id: new ObjectID("5aeb395af9c31f49fd410038")
  // }).then((result) => {
  //     console.log(JSON.stringify(result, undefined, 2));

  // })
});
