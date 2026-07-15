import path from 'path';
import { dbUtility } from '../../../../utils/database';

const sqlPath = __dirname;

export const taskAssignmentQueries = {
    getTaskAssignmentById:           dbUtility.getSQL(path.join(sqlPath, 'get-task-assignment-by-id.sql')),
    getTaskAssignmentsByTask:        dbUtility.getSQL(path.join(sqlPath, 'get-task-assignments-by-task.sql')),
    getTaskAssignmentByTaskAndUser:  dbUtility.getSQL(path.join(sqlPath, 'get-task-assignment-by-task-and-user.sql')),
    getTaskAssignmentsByUser:        dbUtility.getSQL(path.join(sqlPath, 'get-task-assignments-by-user.sql')),
};