import { Router } from 'express';
import { taskController } from './controller/task.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const taskRouter = Router();

taskRouter.use(authMiddleware);

taskRouter.post('/',                 taskController.createTask);
taskRouter.get('/board/:boardId',    taskController.getTasksByBoard);
taskRouter.get('/:id',               taskController.getTaskById);
taskRouter.put('/:id',               taskController.updateTask);
taskRouter.patch('/:id/move',        taskController.moveTask);
taskRouter.delete('/:id',            taskController.deleteTask);

export { taskRouter };