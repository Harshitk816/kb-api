SELECT ta.*, u.username, u.email, u.full_name, u.avatar_url
FROM task_assignments ta
JOIN users u ON u.id = ta.user_id
WHERE ta.task_id = ${taskId} AND ta.status = TRUE
ORDER BY ta.assigned_at ASC;