import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { taskAssignmentController } from './controller/task-assignment.controller';

const taskAssignmentRouter = Router();

taskAssignmentRouter.use(authMiddleware);

taskAssignmentRouter.post('/',               taskAssignmentController.assignUser);
taskAssignmentRouter.get('/task/:taskId',    taskAssignmentController.getTaskAssignments);
taskAssignmentRouter.delete('/:id',          taskAssignmentController.removeAssignment);

export { taskAssignmentRouter };