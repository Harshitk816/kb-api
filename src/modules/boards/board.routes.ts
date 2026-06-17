import { Router } from 'express';
import { boardController } from './controller/board.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const boardRouter = Router();

boardRouter.use(authMiddleware);

boardRouter.post('/', boardController.createBoard);
boardRouter.get('/project/:projectId', boardController.getBoardsByProject);
boardRouter.get('/:id', boardController.getBoardById);
boardRouter.put('/:id', boardController.updateBoard);
boardRouter.delete('/:id', boardController.deleteBoard);

export { boardRouter };