const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");
require("jest-sorted");

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
            created_at: expect.any(String),
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
      .patch("/api/articles/2")
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

// Endpoint 4 - Get all articles

describe("GET /api/articles", () => {
  test("return status 200 and array of articles -  ", () => {
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
              votes: expect.any(Number),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });

  // test one of sort_by/order
  // test invalid query
  test("returns status 200 and array of articles - no queries, default values of sort_by=created_at and otder=desc are applied", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const createdArray = res.body.articles.map((article) => {
          return article.created_at;
        });
        expect(createdArray).toBeSorted({ descending: true });
      });
  });

  test("returns status 200 and array of articles w/ 1 query - sort_by=title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((res) => {
        const titleArray = res.body.articles.map((article) => {
          return article.title;
        });
        expect(titleArray).toBeSorted({ descending: true });
      });
  });

  test("returns status 200 and array of articles w/ 2 queries - sort_by=articl_id and order=asc", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then((res) => {
        const idArray = res.body.articles.map((article) => {
          return article.article_id;
        });
        expect(idArray).toBeSorted({ descending: false });
      });
  });

  test("returns status 200 and array of articles filter query ", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        expect(res.body.articles).toHaveLength(1);
        res.body.articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("returns status 200 and array w/ 3 queries - sort_by=article_id, order=asc, topic=mitch", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
      .expect(200)
      .then((res) => {
        res.body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  // Errors
  /*
  Invalid query name?
  */
  test("Returns error 400 if sort_by given invalid value", () => {
    return request(app)
      .get("/api/articles?sort_by=titles")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Invalid sort_by");
      });
  });

  test("Returns error 400 if order given invalid value", () => {
    return request(app)
      .get("/api/articles?order=ascending")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Invalid order");
      });
  });
  test("Returns error 400 if topic doesn't exist", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Nothing Found");
      });
  });
  // if topic exists but not in any article?
});

// Endpoint 5 - Get all comments by article_id

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200 and returns array of comments", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then((res) => {
        res.body.comments.forEach((comment) => {
          expect(comment.article_id).toBe(9);
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });

  test("returns status 404 if article out of range", () => {
    return request(app)
      .get("/api/articles/99/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Not Found");
      });
  });
  test("returns status 400 if article format invalid", () => {
    return request(app)
      .get("/api/articles/a/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });
});

// Endpoint 6 - Post new comment

describe("POST /api/articles/:article_id/comments", () => {
  test("returns status 201 and object containing posted comment ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", body: "I like this" })
      .expect(201)
      .then((res) => {
        expect(res.body.comment.article_id).toBe(1);
        expect(res.body.comment.author).toBe("butter_bridge");
        expect(res.body.comment.body).toBe("I like this");
      });
  });

  // Errors
  test("returns status 400 and error Bad Request - article_id out of range", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .send({ username: "butter_bridge", body: "I like this" })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });

  test("returns status 400 and error Bad Request - invalid article_id value", () => {
    return request(app)
      .post("/api/articles/a/comments")
      .send({ username: "butter_bridge", body: "I like this" })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });

  test("returns status 400 and error Bad Request - no info", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({})
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });

  test("returns status 400 and error Bad Request - missing info", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });
  test("returns status 400 and error Bad Request - user not in users table", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "new_user", body: "I like this" })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });
});

// Endpoint 7 - Delete comment

describe("DELETE /api/comments/:comment_id", () => {
  test("returns status 204 ", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(204)
      .then((res) => {
        expect(res.body).toEqual({});
      });
  });

  test("returns status 400 - invalid comment_id value ", () => {
    return request(app)
      .delete("/api/comments/aaaa")
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe("Bad Request");
      });
  });
  test("returns status 404 - comment_id out of range ", () => {
    return request(app)
      .delete("/api/comments/4444")
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe("Not Found");
      });
  });
});
