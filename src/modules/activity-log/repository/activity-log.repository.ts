import { db, dbUtility } from '../../../utils/database';
import { activityLogQueries } from './sql/activity-log.queries';

class ActivityLogRepository {

    async getActivityLogById(requestJSON: any) {
        return db.oneOrNone(activityLogQueries.getActivityLogById, {
            activityLogId: requestJSON.params.id
        });
    }

    async getActivityLogsByProject(requestJSON: any) {
        return db.manyOrNone(activityLogQueries.getActivityLogsByProject, {
            projectId: requestJSON.params.projectId
        });
    }

    async getActivityLogsByTask(requestJSON: any) {
        return db.manyOrNone(activityLogQueries.getActivityLogsByTask, {
            taskId: requestJSON.params.taskId
        });
    }

    async createActivityLog(requestJSON: any) {
        const { body, user } = requestJSON;
        return dbUtility.insert({
            table: 'activity_logs',
            data: {
                task_id: body.taskId || null,
                user_id: user.userId,
                project_id: body.projectId,
                action_type: body.actionType,
                action_details: body.actionDetails || null,
                created_by: user.userId,
                updated_by: user.userId
            },
            returning: 'id, task_id, user_id, project_id, action_type, action_details, created_at, status'
        });
    }
}

export const activityLogRepository = new ActivityLogRepository();