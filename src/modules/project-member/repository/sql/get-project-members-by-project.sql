SELECT pm.*, u.username, u.email, u.full_name, u.avatar_url
FROM project_members pm
JOIN users u ON u.id = pm.user_id
WHERE pm.project_id = ${projectId} AND pm.status = TRUE
ORDER BY pm.joined_at ASC;