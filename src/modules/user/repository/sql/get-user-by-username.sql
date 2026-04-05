SELECT 
    id,
    username,
    email,
    status
FROM users
WHERE username = ${username} 
AND status = TRUE;
