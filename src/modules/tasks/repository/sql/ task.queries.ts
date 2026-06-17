import path from 'path';
import { dbUtility } from '../../../../utils/database';

const sqlPath = __dirname;

export const taskQueries = {
    getTaskById:      dbUtility.getSQL(path.join(sqlPath, 'get-task-by-id.sql')),
    getTasksByBoard:  dbUtility.getSQL(path.join(sqlPath, 'get-tasks-by-board.sql')),
    moveTask:         dbUtility.getSQL(path.join(sqlPath, 'move-task.sql')),
}