import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { commentController } from './controller/comment.controller';

const commentRouter = Router();

commentRouter.use(authMiddleware);

commentRouter.post('/',              commentController.createComment);
commentRouter.get('/task/:taskId',   commentController.getCommentsByTask);
commentRouter.put('/:id',            commentController.updateComment);
commentRouter.delete('/:id',         commentController.deleteComment);

export { commentRouter };