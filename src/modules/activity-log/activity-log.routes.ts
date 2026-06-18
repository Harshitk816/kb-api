import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { activityLogController } from './controller/activity-log.controller';

const activityLogRouter = Router();

activityLogRouter.use(authMiddleware);

activityLogRouter.post('/', activityLogController.createActivityLog);
activityLogRouter.get('/project/:projectId', activityLogController.getActivityLogsByProject);
activityLogRouter.get('/task/:taskId', activityLogController.getActivityLogsByTask);
activityLogRouter.get('/:id', activityLogController.getActivityLogById);

export { activityLogRouter };