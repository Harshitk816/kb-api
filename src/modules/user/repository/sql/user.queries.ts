
import path from 'path';
import { dbUtility } from '../../../../utils/database';

const sqlPath = __dirname;

export const userQueries = {
    getUserByEmail: dbUtility.getSQL(path.join(sqlPath, 'get-user-by-email.sql')),
    getUserByUsername: dbUtility.getSQL(path.join(sqlPath, 'get-user-by-username.sql')),
    getUserById: dbUtility.getSQL(path.join(sqlPath, 'get-user-by-id.sql')),
    
};
