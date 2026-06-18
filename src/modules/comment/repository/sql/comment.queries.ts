import path from 'path';
import { dbUtility } from '../../../../utils/database';

const sqlPath = __dirname;

export const commentQueries = {
    getCommentById:      dbUtility.getSQL(path.join(sqlPath, 'get-comment-by-id.sql')),
    getCommentsByTask:   dbUtility.getSQL(path.join(sqlPath, 'get-comments-by-task.sql')),
};