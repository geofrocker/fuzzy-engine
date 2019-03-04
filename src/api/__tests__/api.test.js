const request = require("supertest");
const app = require("../api");

describe("Test the api.js", () => {
  test("It should respond with unsorted numbers and a 200 if all is well", done => {
    request(app)
      .get("/:4?order=none")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test("It should respond with an empty array if there is an error", done => {
    request(app)
      .get("/:4?order=none&fakePath=1")
      .then(response => {
        expect(JSON.parse(response.text).numbers.length).toBe(0);
        done();
      });
  });

  test("It should respond with sorted ascending order numbers and a 200 if all is well", done => {
    request(app)
      .get("/:10?order=asc")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test("It should respond with sorted descending order numbers and a 200 if all is well", done => {
    request(app)
      .get("/:10?order=desc")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  test("It should respond with a 201 if all is well", done => {
    request(app)
      .post("/")
      .send({ nums: [] })
      .then(response => {
        expect(response.statusCode).toBe(201);
        done();
      });
  });

  test("It should respond with a 500 if no data is sent", done => {
    request(app)
      .post("/")
      .send({})
      .then(response => {
        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.text).message).toBe("No data sent");
        done();
      });
  });
});
