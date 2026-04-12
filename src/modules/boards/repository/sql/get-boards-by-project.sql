SELECT * FROM boards
WHERE project_id = ${projectId} AND status = TRUE
ORDER BY position ASC;