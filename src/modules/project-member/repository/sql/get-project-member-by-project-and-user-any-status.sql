SELECT id, project_id, user_id, role, status
FROM project_members
WHERE project_id = ${projectId}
  AND user_id = ${userId};