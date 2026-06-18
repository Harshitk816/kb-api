SELECT c.*, u.username, u.full_name, u.avatar_url
FROM comments c
JOIN users u ON u.id = c.user_id
WHERE c.id = ${commentId} AND c.status = TRUE;