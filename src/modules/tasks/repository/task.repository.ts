import { db, dbUtility } from '../../../utils/database';
import { taskQueries } from './sql/ task.queries';

class TaskRepository {

    async getTaskById(requestJSON: any) {
        return db.oneOrNone(taskQueries.getTaskById, {
            taskId: requestJSON.params.id
        });
    }

    async getTasksByBoard(requestJSON: any) {
        return db.manyOrNone(taskQueries.getTasksByBoard, {
            boardId: requestJSON.params.boardId
        });
    }

    async createTask(requestJSON: any) {
        const { body, user } = requestJSON;
        return dbUtility.insert({
            table: 'tasks',
            data: {
                project_id:  body.projectId,
                board_id:    body.boardId,
                title:       body.title,
                description: body.description  || null,
                priority:    body.priority     || 'medium',
                task_status: body.taskStatus   || 'todo',
                position:    body.position,
                due_date:    body.dueDate      || null,
                created_by:  user.userId,
                updated_by:  user.userId
            },
            returning: 'id, project_id, board_id, title, description, priority, task_status, position, due_date, created_date, status'
        });
    }

     async updateTask(requestJSON: any) {
        const { body, params, user } = requestJSON;
        return dbUtility.update({
            table: 'tasks',
            data: {
                title:       body.title,
                description: body.description,
                priority:    body.priority,
                task_status: body.taskStatus,
                position:    body.position,
                due_date:    body.dueDate,
                updated_by:  user.userId
            },
            where:     { id: params.id, status: true },
            returning: 'id, project_id, board_id, title, description, priority, task_status, position, due_date, updated_date'
        });
    }

    async moveTask(requestJSON: any) {
        const { body, params, user } = requestJSON;
        return db.oneOrNone(taskQueries.moveTask, {
            taskId:    params.id,
            boardId:   body.boardId,
            position:  body.position,
            updatedBy: user.userId
        });
    }

    async deleteTask(requestJSON: any) {
        const { params, user } = requestJSON;
        return dbUtility.softDelete({
            table:     'tasks',
            where:     { id: params.id },
            deletedBy: user.userId
        });
    }


}

export const taskRepository = new TaskRepository();