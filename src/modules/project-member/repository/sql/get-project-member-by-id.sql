SELECT
    id,
    project_id,
    user_id,
    role,
    status
FROM project_members
WHERE id = ${projectMemberId}
  AND status = TRUE;