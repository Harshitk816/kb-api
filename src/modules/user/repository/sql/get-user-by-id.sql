SELECT 
    id,
    username,
    email,
    full_name,
    avatar_url,
    created_date,
    status
FROM users
WHERE id = ${userId} 
AND status = TRUE;