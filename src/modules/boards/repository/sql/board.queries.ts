import path from 'path';
import { dbUtility } from '../../../../utils/database';

const sqlPath = __dirname;

export const boardQueries = {
    getBoardById: dbUtility.getSQL(path.join(sqlPath, 'get-board-by-id.sql')),
    getBoardsByProject: dbUtility.getSQL(path.join(sqlPath, 'get-boards-by-project.sql')),
};