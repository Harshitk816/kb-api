import { db, dbUtility } from '../../../utils/database';
import { taskAssignmentQueries } from './sql/ task-assignment.queries';

class TaskAssignmentRepository {

    async getTaskAssignmentById(requestJSON: any) {
        return db.oneOrNone(taskAssignmentQueries.getTaskAssignmentById, {
            taskAssignmentId: requestJSON.params.id
        });
    }

    async getTaskAssignmentsByTask(requestJSON: any) {
        return db.manyOrNone(taskAssignmentQueries.getTaskAssignmentsByTask, {
            taskId: requestJSON.params.taskId
        });
    }

    async getTaskAssignmentByTaskAndUser(taskId: number, userId: number) {
        return db.oneOrNone(taskAssignmentQueries.getTaskAssignmentByTaskAndUser, {
            taskId,
            userId
        });
    }

    async createTaskAssignment(requestJSON: any) {
        const { body, user } = requestJSON;
        return dbUtility.insert({
            table: 'task_assignments',
            data: {
                task_id:     body.taskId,
                user_id:     body.userId,
                assigned_by: user.userId,
                created_by:  user.userId,
                updated_by:  user.userId
            },
            returning: 'id, task_id, user_id, assigned_by, assigned_at, created_date, status'
        });
    }

    async deleteTaskAssignment(requestJSON: any) {
        const { params, user } = requestJSON;
        return dbUtility.softDelete({
            table:     'task_assignments',
            where:     { id: params.id },
            deletedBy: user.userId
        });
    }
}

export const taskAssignmentRepository = new TaskAssignmentRepository();