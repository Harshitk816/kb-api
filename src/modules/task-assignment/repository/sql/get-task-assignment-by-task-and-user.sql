SELECT *
FROM task_assignments
WHERE task_id = ${taskId}
  AND user_id = ${userId}
  AND status = TRUE;