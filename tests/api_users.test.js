const supertest = require("supertest");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const assert = require("node:assert");
const app = require("../app");
const api = supertest(app);

const User = require("../models/users");
const mock_users = require("./mock_users.json");

describe("when there are users saved initially", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(mock_users.users);
  });
  test("users are returnes as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("users creation", () => {
  test("fails with statuscode 400 if trying to pass invalid credentials (password and username)", async () => {
    const userBadPasswd = {
      username: "bob",
      name: "user",
      password: "bo",
    };

    const userBadUsrName = {
      username: "th",
      name: "SuperUser",
      password: "theo",
    };

    const result = await api.post("/api/users").send(userBadPasswd).expect(400);
    const resultUsr = await api
      .post("/api/users")
      .send(userBadUsrName)
      .expect(400);

    const userAtEnd = await User.find({});

    assert(
      result.body.error.includes("password must be at least 3 characters long"),
    );
    assert(
      resultUsr.body.error.includes(
        "User validation failed: username: must be at least 3 characters long",
      ),
    );
    assert.strictEqual(userAtEnd.length, mock_users.users.length);
  });
  test("successfully creates user with statuscode 201", async () => {
    const user = {
      username: "theo",
      name: "SuperUser",
      password: "theo",
    };

    await api.post("/api/users").send(user).expect(201);
    const userAtEnd = await User.find({});

    assert.strictEqual(userAtEnd.length, mock_users.users.length + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
