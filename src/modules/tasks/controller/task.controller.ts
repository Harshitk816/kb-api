import { AppError } from '../../../utils/http';
import { taskRepository } from '../repository/task.repository';
import logger from '../../../utils/logger';
import { logActivity } from '../../../utils/audit';

class TaskController {

    createTask = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { projectId, boardId, title, position } = requestJSON.body;

            if (!projectId || !boardId || !title || position === undefined)
                throw new AppError('projectId, boardId, title and position are required', 400);

            const task = await taskRepository.createTask(requestJSON);
            await logActivity({
                projectId: task.project_id,
                taskId: task.id,
                userId: requestJSON.user.userId,
                actionType: 'task_created',
                actionDetails: {
                    title: task.title,
                    boardId: task.board_id
                }
            });
            logger.info({ taskId: task.id }, 'Task created');

            res.status(201).json({ success: true, message: 'Task created successfully', data: task });
        } 
        catch(err) { 
            next(err); 
        }
    }


    getTasksByBoard = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const tasks = await taskRepository.getTasksByBoard(requestJSON);
            res.status(200).json({ success: true, data: tasks });
        } 
        catch(err) { 
            next(err); 
        }
    }

    getTaskById = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const task = await taskRepository.getTaskById(requestJSON);
            if (!task) throw new AppError('Task not found', 404);
            res.status(200).json({ success: true, data: task });
        } 
        catch(err) { 
            next(err); 
        }
    }


    updateTask = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const task = await taskRepository.updateTask(requestJSON);
            if (!task) throw new AppError('Task not found', 404);
            await logActivity({
                projectId: task.project_id,
                taskId: task.id,
                userId: requestJSON.user.userId,
                actionType: 'task_updated',
                actionDetails: {
                    updatedFields: Object.keys(requestJSON.body)
                }
            });
            logger.info({ taskId: requestJSON.params.id }, 'Task updated');
            res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
        } 
        catch(err) { 
            next(err); 
        }
    }

    moveTask = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { boardId, position } = requestJSON.body;

            if (!boardId || position === undefined)
                throw new AppError('boardId and position are required', 400);

            const task = await taskRepository.moveTask(requestJSON);
            if (!task) throw new AppError('Task not found', 404);
            logger.info({ taskId: requestJSON.params.id }, 'Task moved');
            res.status(200).json({ success: true, message: 'Task moved successfully', data: task });
        } 
        catch(err) { 
            next(err); 
        }
    }


    deleteTask = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const task = await taskRepository.getTaskById(requestJSON);
            if (!task) throw new AppError('Task not found', 404);

            const deleted = await taskRepository.deleteTask(requestJSON);
            if (!deleted) throw new AppError('Task not found', 404);
            await logActivity({
                projectId: task.project_id,
                taskId: task.id,
                userId: requestJSON.user.userId,
                actionType: 'task_deleted',
                actionDetails: {
                    title: task.title
                }
            });
            logger.info({ taskId: requestJSON.params.id }, 'Task deleted');
            res.status(200).json({ success: true, message: 'Task deleted successfully' });
        } catch(err) { next(err); }
    }
}

export const taskController = new TaskController();