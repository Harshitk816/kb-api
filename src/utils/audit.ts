import { db } from './database';
import logger from './logger';

interface IAuditLog {
    taskId?: number | null;
    userId: number;
    projectId: number;
    actionType: string;
    actionDetails?: object;
}

export async function logActivity(params: IAuditLog): Promise<void> {
    try {
        await db.none(
            `INSERT INTO activity_logs 
                (task_id, user_id, project_id, action_type, action_details, created_by, updated_by)
             VALUES 
                ($1, $2, $3, $4, $5, $2, $2)`,
            [
                params.taskId || null,
                params.userId,
                params.projectId,
                params.actionType,
                JSON.stringify(params.actionDetails || {})
            ]
        );
    } catch (err) {
        logger.warn({ err, params }, 'Activity log insert failed');
    }
}
