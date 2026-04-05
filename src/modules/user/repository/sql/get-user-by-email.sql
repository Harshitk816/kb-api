SELECT 
    id,
    username,
    email,
    password_hash,
    full_name,
    avatar_url,
    status
FROM users
WHERE email = ${email} 
AND status = TRUE;