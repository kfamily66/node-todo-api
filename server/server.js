require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const { ObjectId } = require("mongodb");

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const port = process.env.PORT;

const app = express();
app.use(bodyParser.json());

app.post("/todos", authenticate, async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  try {
    const doc = await todo.save();
    res.send(doc);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/todos", authenticate, async (req, res) => {
  try {
    const todos = await Todo.find({ _creator: req.user._id });
    res.send({ todos });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/todos/:id", authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOne({ _id: id, _creator: req.user._id });

    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  } catch (err) {
    res.status(400).send();
  }
});

app.delete("/todos/:id", authenticate, async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  } catch (err) {
    res.status(400).send();
  }
});

app.patch("/todos/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["text", "completed"]);

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  try {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: id,
        _creator: req.user._id
      },
      {
        $set: body
      },
      {
        new: true
      }
    );

    if (!todo) {
      return res.status(404).send();
    }

    res.send({ todo });
  } catch (err) {
    res.status(400).send();
  }
});

app.post("/users", async (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);
  user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/users/login", async (req, res) => {
  const body = _.pick(req.body, ["email", "password"]);

  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header("x-auth", token).send(user);
  } catch (err) {
    res.status(400).send();
  }
});

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

app.delete("/users/me/token", authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (err) {
    res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}...`);
});

module.exports = {
  app
};
