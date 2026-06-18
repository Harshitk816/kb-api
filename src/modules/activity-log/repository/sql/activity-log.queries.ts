import path from 'path';
import { dbUtility } from '../../../../utils/database';

const sqlPath = __dirname;

export const activityLogQueries = {
    getActivityLogById: dbUtility.getSQL(path.join(sqlPath, 'get-activity-log-by-id.sql')),
    getActivityLogsByProject: dbUtility.getSQL(path.join(sqlPath, 'get-activity-logs-by-project.sql')),
    getActivityLogsByTask: dbUtility.getSQL(path.join(sqlPath, 'get-activity-logs-by-task.sql')),
};