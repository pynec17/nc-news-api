const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("Invalid URL", () => {
  test("return status 404 and a message", () => {
    return request(app)
      .get("/invalid/url")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Invalid URL");
      });
  });
});

describe("GET /api/topics", () => {
  test("returns status 200 and array of topics", () => {
    return request(app)
      .get("/api/topics/")
      .expect(200)
      .then((res) => {
        expect(res.body.topics.length).toBe(3);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("returns 200 and article object", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((res) => {
        // expect to be object?
        // expect to have length
        // loop through, expect object containing etc
      });
  });
});
