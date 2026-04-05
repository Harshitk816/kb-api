import { Router } from 'express';
import { userController } from './controller/user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const userRouter = Router();

// Public routes
userRouter.post('/register', userController.register);
userRouter.post('/login',    userController.login);
userRouter.post('/refresh',  userController.refreshToken);

// Protected routes — authMiddleware applied to everything below
userRouter.use(authMiddleware);
userRouter.get('/me',        userController.me);
userRouter.get('/:id',       userController.getUser);
userRouter.put('/:id',       userController.updateUser);
userRouter.delete('/:id',    userController.deleteUser);

export { userRouter };
