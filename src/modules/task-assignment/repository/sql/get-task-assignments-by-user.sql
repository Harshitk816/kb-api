SELECT
        ta.id,
        ta.task_id,
        t.title,
        t.task_status,
        t.priority,
        t.project_id,
        p.project_name AS project_name,
        t.board_id,
        b.board_name AS board_name,
        ta.assigned_at
    FROM task_assignments ta
    JOIN tasks t     ON t.id = ta.task_id AND t.status = TRUE
    JOIN projects p  ON p.id = t.project_id AND p.status = TRUE
    LEFT JOIN boards b ON b.id = t.board_id AND b.status = TRUE
    WHERE ta.user_id = ${userId}
      AND ta.status = TRUE
    ORDER BY ta.assigned_at DESC