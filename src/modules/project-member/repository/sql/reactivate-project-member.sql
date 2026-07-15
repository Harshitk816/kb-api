UPDATE project_members
SET
    status = TRUE,
    role = COALESCE(${role}, role),
    updated_by = ${updatedBy},
    updated_date = NOW()
WHERE project_id = ${projectId}
  AND user_id = ${userId}
RETURNING id, project_id, user_id, role, status, created_date, updated_date;