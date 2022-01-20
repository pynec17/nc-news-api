const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

// All invalid URLS
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

// Endpoint 1 - Get all topics
describe("GET /api/topics", () => {
  test("returns status 200 and array of topics", () => {
    return request(app)
      .get("/api/topics/")
      .expect(200)
      .then((res) => {
        expect(res.body.topics.length).toBe(3);
      });
  });
  test("returns status 404 and error message", () => {
    return request(app)
      .get("/api/topic/22/")
      .expect(404)
      .then((res) => {
        console.log(res.body);
        expect(res.body.message).toBe("Invalid URL");
      });
  });
});

// Endpoint 2 - Get article by ID
describe("GET /api/articles/:article_id", () => {
  test("returns 200 and article object", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((res) => {
        expect(res.body.article.article_id).toBe(3);
        expect(res.body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            body: expect.any(String),
            votes: expect.any(Number),
            topic: expect.any(String),
            author: expect.any(String),
            // timestamp
            comment_count: expect.any(String),
          })
        );
      });
  });
  test("returns 404 not found if article_id out of range", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("No Data Found");
      });
  });
  test("returns 404 not found if article_id out of range", () => {
    return request(app)
      .get("/api/articles/g")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });
});

//Endpoint 3 - Patch article votes

describe("PATCH /api/articles/:article_id", () => {
  test("return status 200 and updated article with incremented votes", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 10 })
      .expect(200)
      .then((res) => {
        expect(res.body.article.votes).toBe(10);
      });
  });
  test("return status 200 and updated article with decremented votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then((res) => {
        expect(res.body.article.votes).toBe(90);
      });
  });

  // Errors
  test("return status 400 and message Bad Request - invalid value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "a" })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });
  test("return status 400 and message Bad Request - empty object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });
  test("return status 404 and message No Data Found - article out of range", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: -10 })
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("No Data Found");
      });
  });
});

// Endpoint 4

describe.only("GET /api/articles", () => {
  test("return status 200 and array of articles ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toHaveLength(12);
        res.body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              body: expect.any(String),
              votes: expect.any(Number),
              topic: expect.any(String),
              author: expect.any(String),
              // timestamp
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  // test no queries (should do default values)
  // test one of sort_by/order
  // test invalid query
  test("queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
      .expect(200)
      .then((res) => {});
  });
});

// Endpoint 5

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200 and returns array of comments", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(() => {});
  });
});
