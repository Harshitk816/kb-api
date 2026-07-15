SELECT id, username, email, full_name, avatar_url, status
FROM users
WHERE status = TRUE
ORDER BY full_name ASC;