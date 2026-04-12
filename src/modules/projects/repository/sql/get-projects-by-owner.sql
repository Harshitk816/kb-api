SELECT * FROM projects WHERE owner_id = ${ownerId} AND status = TRUE
ORDER BY created_date DESC;