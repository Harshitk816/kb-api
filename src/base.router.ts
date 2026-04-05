import { Router } from 'express';
import { userRouter } from './modules/user/user.routes';
// import { authRouter } from './modules/auth/auth.routes';
// import { userRouter } from './modules/user/user.routes';
// import { projectRouter } from './modules/projects/project.routes';
// import { boardRouter } from './modules/boards/board.routes';
// import { taskRouter } from './modules/tasks/task.routes';

const baseRouter = Router();

// Public
// baseRouter.use('/auth', authRouter);

// Protected
baseRouter.use('/users', userRouter);
// baseRouter.use('/projects', projectRouter);
// baseRouter.use('/boards', boardRouter);
// baseRouter.use('/tasks', taskRouter);

export { baseRouter };
