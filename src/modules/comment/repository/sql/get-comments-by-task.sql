SELECT c.*, u.username, u.full_name, u.avatar_url
FROM comments c
JOIN users u ON u.id = c.user_id
WHERE c.task_id = ${taskId} AND c.status = TRUE
ORDER BY c.created_date ASC;