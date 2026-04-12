import { AppError } from '../../../utils/http';
import { boardRepository } from '../repository/board.repository';
import logger from '../../../utils/logger';

class BoardController {

    createBoard = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { projectId, boardName, position } = requestJSON.body;

            if (!projectId || !boardName || position === undefined)
                throw new AppError('projectId, boardName and position are required', 400);

            const board = await boardRepository.createBoard(requestJSON);
            logger.info({ boardId: board.id }, 'Board created');

            res.status(201).json({ success: true, message: 'Board created successfully', data: board });
        } catch(err) { 
            next(err); 
        }
    }

    getBoardsByProject = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const boards = await boardRepository.getBoardsByProject(requestJSON);
            res.status(200).json({ success: true, data: boards });
        } catch(err) { 
            next(err); 
        }
    }

    getBoardById = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const board = await boardRepository.getBoardById(requestJSON);
            if (!board) throw new AppError('Board not found', 404);
            res.status(200).json({ success: true, data: board });
        } catch(err) { 
            next(err); 
        }
    }

    updateBoard = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const board = await boardRepository.updateBoard(requestJSON);
            if (!board) throw new AppError('Board not found', 404);
            logger.info({ boardId: requestJSON.params.id }, 'Board updated');
            res.status(200).json({ success: true, message: 'Board updated successfully', data: board });
        } catch(err) { 
            next(err); 
        }
    }

    deleteBoard = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const deleted = await boardRepository.deleteBoard(requestJSON);
            if (!deleted) throw new AppError('Board not found', 404);
            logger.info({ boardId: requestJSON.params.id }, 'Board deleted');
            res.status(200).json({ success: true, message: 'Board deleted successfully' });
        } catch(err) { 
            next(err); 
        }
    }

}

export const boardController = new BoardController();
