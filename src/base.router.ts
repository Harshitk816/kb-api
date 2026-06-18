import { Router } from 'express';
import { userRouter } from './modules/user/user.routes';
import { projectRouter } from './modules/projects/project.routes';
import { boardRouter } from './modules/boards/board.routes';
import { taskRouter } from './modules/tasks/task.routes';
import { projectMemberRouter } from './modules/project-member/project-member.routes';
import { taskAssignmentRouter } from './modules/task-assignment/task-assignment.routes';
import { commentRouter } from './modules/comment/comment.routes';
import { activityLogRouter } from './modules/activity-log/activity-log.routes';

const baseRouter = Router();

// Public
// baseRouter.use('/auth', authRouter);

// Protected
baseRouter.use('/users', userRouter);
baseRouter.use('/projects', projectRouter);
baseRouter.use('/boards', boardRouter);
baseRouter.use('/tasks', taskRouter);
baseRouter.use('/project-members', projectMemberRouter);
baseRouter.use('/task-assignments', taskAssignmentRouter);
baseRouter.use('/comments', commentRouter);
baseRouter.use('/activity-logs', activityLogRouter);
export { baseRouter };
