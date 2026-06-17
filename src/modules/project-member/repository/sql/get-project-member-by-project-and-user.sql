SELECT *
FROM project_members
WHERE project_id = ${projectId}
  AND user_id = ${userId}
  AND status = TRUE;