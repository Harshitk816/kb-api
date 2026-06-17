UPDATE tasks
SET board_id = ${boardId},
    position = ${position},
    updated_by = ${updatedBy},
    updated_date = CURRENT_TIMESTAMP
WHERE id = ${taskId} AND status = TRUE
RETURNING *;