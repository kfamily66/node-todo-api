const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");

const { populateTodos, populateUsers, todos, users } = require("./seed/seed");

beforeEach(populateTodos);
beforeEach(populateUsers);

describe("POST /todos :", () => {
  it("should create new todo", done => {
    var text = "This is test text";

    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({
          text
        })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should not create todo with invalid body data", done => {
    request(app)
      .post("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({})
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe("GET /todos :", () => {
  it("should get all todos", done => {
    request(app)
      .get("/todos")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe("GET /todos/:id :", () => {
  it("should return doc", done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it("should not return todo doc created by other user", done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 if id is not valid", done => {
    request(app)
      .get("/todos/12345")
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    const wrong_valid_id = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${wrong_valid_id}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id :", () => {
  it("should remove a todo", done => {
    const hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(doc => {
        expect(doc.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should not remove the todo created by other user", done => {
    const hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId)
          .then(todo => {
            expect(todo).toBeTruthy();
            done();
          })
          .catch(e => done(e));
      });
  });

  it("should return 404 if id is not valid", done => {
    request(app)
      .delete(`/todos/12345`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 if todo not found", done => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id :", () => {
  it("should update first todo", done => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .send({
        text: "Updated todo",
        completed: true
      })
      .expect(200)
      .expect(doc => {
        // console.log(doc);
        expect(doc.body.todo.text).toBe("Updated todo");
        expect(doc.body.todo.completed).toBe(true);
        expect(doc.body.todo.completedAt).not.toBeNull();
      })
      .end(done);
  });

  it("should not update the todo created by other user", done => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[0].tokens[0].token)
      .send({
        text: "Updated todo",
        completed: true
      })
      .expect(404)
      .end(done);
  });

  it("should clear completedAt when completed is false", done => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .set("x-auth", users[1].tokens[0].token)
      .send({
        text: "Updated second todo",
        completed: false
      })
      .expect(200)
      .expect(doc => {
        expect(doc.body.todo.text).toBe("Updated second todo");
        expect(doc.body.todo.completed).toBe(false);
        expect(doc.body.todo.completedAt).toBeNull();
      })
      .end(done);
  });
});

describe("GET /users/me :", () => {
  it("should return user if authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .set("x-auth", "random")
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users :", () => {
  it("should create a user", done => {
    var email = "example@test.com";
    var password = "valid_pass";

    request(app)
      .post("/users")
      .send({
        email,
        password
      })
      .expect(200)
      .expect(res => {
        expect(res.header).toHaveProperty("x-auth");
        expect(res.body).toHaveProperty("_id");
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          res.send(done(err));
        }

        User.findOne({
          email
        })
          .then(user => {
            expect(user).toHaveProperty("_id");
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(err => {
            done(err);
          })
          .catch(err => done(err));
      });
  });

  it("should return validation error if request invalid", done => {
    var email = "invalid_email";
    var password = 123;

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use", done => {
    var email = users[0].email;
    var password = "valid_password";

    request(app)
      .post("/users")
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe("POST /users/login:", () => {
  it("should login user and return auth token", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers["x-auth"]).toBeDefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1]).toEqual(
              expect.objectContaining({
                access: "auth",
                token: res.headers["x-auth"]
              })
            );
            done();
          })
          .catch(err => done(err));
      });
  });

  it("should reject invalid login", done => {
    request(app)
      .post("/users/login")
      .send({
        email: users[1].email,
        password: "wrong_password"
      })
      .expect(400)
      .end((err, res) => {
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe("DELETE /users/me/token", () => {
  it("should remove auth token on logout", done => {
    request(app)
      .delete("/users/me/token")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(err => done(err));
      });
  });
});
