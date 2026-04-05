
import path from 'path';
import { dbUtility } from '../../../../utils/database';

const sqlPath = path.join(__dirname, 'sql');

export const userQueries = {
    getUserByEmail: dbUtility.getSQL(path.join(sqlPath, 'get-user-by-email.sql')),
    getUserByUsername: dbUtility.getSQL(path.join(sqlPath, 'get-user-by-username.sql')),
    createUser: dbUtility.getSQL(path.join(sqlPath, 'create-user.sql')),
    getUserById: dbUtility.getSQL(path.join(sqlPath, 'get-user-by-id.sql')),
    updateUser: dbUtility.getSQL(path.join(sqlPath, 'update-user.sql')),
    deleteUser: dbUtility.getSQL(path.join(sqlPath, 'delete-user.sql')),
};
