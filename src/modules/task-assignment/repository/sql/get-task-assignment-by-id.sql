SELECT *
FROM task_assignments
WHERE id = ${taskAssignmentId} AND status = TRUE;