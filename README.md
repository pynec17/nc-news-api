## Description

This is a news API built on with Node.js/Express with a PostgreSQL backend.

You can find the API here https://claytons-news.herokuapp.com/api

You can find the frontend website here https://claytons-nc-news.netlify.app/

## Dependencies

- [cors](https://www.npmjs.com/package/cors) (v2.8.5)
- [dotenv](https://www.npmjs.com/package/dotenv) (v.14.1.0)
- [express](https://www.npmjs.com/package/express) (v4.17.3)
- [node-postgres](https://node-postgres.com/) (v8.7.1)
- [pg-format](https://www.npmjs.com/package/pg-format) (v1.0.4)

## Dev Dependencies

- [jest](https://jestjs.io/) (v27.4.7)
- [jest-sorted](https://www.npmjs.com/package/jest-sorted) (v1.0.14)
- [supertest](https://www.npmjs.com/package/supertest) (v6.2.1)

## Cloning

To clone this repository, copy the following command in your terminal:

```
git clone https://github.com/pynec17/be-nc-news
```

## Installing Dependencies

To install the dependencies above, copy either of the following commands into your terminal:

```
npm i
npm install
```

## Setting Up The Database Locally

Run the following command:

```
npm run setup-dbs
```

## Seeding The Database

To seed the database, enter the following command in the terminal:

```
npm run seed
```

Some data has been provided in the `db` folder along with a `setup.sql` file containing the database names and a `seeds` folder. The above commands will take care of running the functions in the `seeds` folder.

## Testing

To run the provided tests, run this in your terminal:

```
npm test
```

## Creating Test and Development Environments

You will need to create two `.env` files for your project: `.env.test` and `.env.development.` Into each, add `PGDATABASE=<database_name_here>`, with the names of the appropriate database for that environment.

<br>

# Endpoints

### **GET /api**

Responds with:

- JSON describing all the available endpoints.

### **GET /api/topics**

Responds with:

- an array of topic objects, each of which should have the following properties:
  - `slug`
  - `description`

---

### **GET /api/articles/:article_id**

Responds with:

- an article object, which should have the following properties:

  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `body`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count`

---

### **PATCH /api/articles/:article_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - `newVote` indicates how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` will increment the current article's vote property by 1

  `{ inc_votes : -100 }` will decrement the current article's vote property by 100

Responds with:

- the updated article

---

#### **GET /api/articles**

Responds with:

- an `articles` array of article objects, each of which should have the following properties:
  - `author` which is the `username` from the users table
  - `title`
  - `article_id`
  - `topic`
  - `created_at`
  - `votes`
  - `comment_count`

Optional queries:

- `sort_by`, which sorts the articles by column (default column is created_at)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `topic`, which filters the articles by the topic value specified in the query

---

### **GET /api/articles/:article_id/comments**

Responds with:

- an array of comments for the given `article_id` of which each comment should have the following properties:
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

---

### **POST /api/articles/:article_id/comments**

Request body accepts:

- an object with the following properties:
  - `username`
  - `body`

Responds with:

- the posted comment

---

### **DELETE /api/comments/:comment_id**

Deletes the given comment by `comment_id`

Responds with:

- status 204 and no content

---

### **GET /api/users**

Responds with:

- an array of objects, each object should have the following property:
  - `username`

---

### **GET /api/users/:username**

Responds with:

- a user object which should have the following properties:
  - `username`
  - `avatar_url`
  - `name`

---

#### **PATCH /api/comments/:comment_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - where `newVote` indicates the amount to update the vote count by

  e.g.

  `{ inc_votes : 1 }` would increment the current comment's vote property by 1

  `{ inc_votes : -1 }` would decrement the current comment's vote property by 1

Responds with:

- the updated comment

---

#### **POST /api/articles**

Request body accepts:

- an object with the following properties:

  - `author` which is the `username` from the users table
  - `title`
  - `body`
  - `topic`

Responds with:

- the newly added article, with all the above properties as well as:

  - `article_id`
  - `votes`
  - `created_at`
  - `comment_count`

  ***
