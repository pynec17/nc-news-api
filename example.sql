\c nc_news_test

-- SELECT articles.*, COUNT(comment_id) AS comment_count
-- FROM articles 
-- LEFT JOIN comments 
-- ON articles.article_id = comments.article_id
-- WHERE articles.article_id=3
-- GROUP BY articles.article_id;


--SELECT COUNT(*) FROM comments WHERE article_id=2;

--articles.article_id, title, comment_id, comments.article_id 

SELECT * FROM articles;