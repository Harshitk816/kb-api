import { db, dbUtility } from '../../../utils/database';
import { boardQueries } from './sql/board.queries';

class BoardRepository {
    async getBoardById(requestJSON: any) {
        return db.oneOrNone(boardQueries.getBoardById, {
            boardId: requestJSON.params.id
        });
    }

    async getBoardsByProject(requestJSON: any) {
        return db.manyOrNone(boardQueries.getBoardsByProject, {
            projectId: requestJSON.params.projectId
        });
    }

    async createBoard(requestJSON: any) {
        const { body, user } = requestJSON;
        return dbUtility.insert({
            table: 'boards',
            data: {
                project_id: body.projectId,
                board_name: body.boardName,
                position:   body.position,
                created_by: user.userId,
                updated_by: user.userId
            },
            returning: 'id, project_id, board_name, position, created_date, status'
        });
    }

    async updateBoard(requestJSON: any) {
        const { body, params, user } = requestJSON;
        return dbUtility.update({
            table: 'boards',
            data: {
                board_name: body.boardName,
                position: body.position,
                updated_by: user.userId
            },
            where:     { id: params.id, status: true },
            returning: 'id, project_id, board_name, position, updated_date'
        });
    }

    async deleteBoard(requestJSON: any) {
        const { params, user } = requestJSON;
        return dbUtility.softDelete({
            table:     'boards',
            where:     { id: params.id },
            deletedBy: user.userId
        });
    }


}

export const boardRepository = new BoardRepository();