SELECT * FROM tasks
WHERE board_id = ${boardId} AND status = TRUE
ORDER BY position ASC;