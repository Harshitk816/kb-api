SELECT al.*, u.username, u.full_name, u.avatar_url
FROM activity_logs al
JOIN users u ON u.id = al.user_id
WHERE al.project_id = ${projectId} AND al.status = TRUE
ORDER BY al.created_at DESC;