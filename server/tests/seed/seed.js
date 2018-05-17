const { ObjectID } = require("mongodb");
const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");
const jwt = require("jsonwebtoken");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    email: "userOne@test.com",
    password: "userOnePass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign(
            {
              _id: userOneId,
              access: "auth"
            },
            "secret_word"
          )
          .toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: "userTwo@test.com",
    password: "userTwoPass",
    tokens: [
      {
        access: "auth",
        token: jwt
          .sign(
            {
              _id: userTwoId,
              access: "auth"
            },
            "secret_word"
          )
          .toString()
      }
    ]
  }
];

const todos = [
  {
    _id: new ObjectID(),
    text: "First todo",
    _creator: userOneId
  },
  {
    _id: new ObjectID(),
    text: "Second todo",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
  }
];

const populateUsers = done => {
  User.remove({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => {
      done();
    });
};

module.exports = {
  todos,
  populateTodos,
  populateUsers,
  users
};
