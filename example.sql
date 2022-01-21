\c nc_news_test

-- INSERT INTO IF NOT EXIST
-- users (username) VALUES ('new_user');
SELECT username, comments.* FROM users
LEFT JOIN comments
ON users.username = comments.author;