import { db, dbUtility } from '../../../utils/database';
import { commentQueries } from './sql/comment.queries';

class CommentRepository {
    async getCommentById(requestJSON: any) {
        return db.oneOrNone(commentQueries.getCommentById, {
            commentId: requestJSON.params.id
        });
    }

    async getCommentsByTask(requestJSON: any) {
        return db.manyOrNone(commentQueries.getCommentsByTask, {
            taskId: requestJSON.params.taskId
        });
    }

    async createComment(requestJSON: any) {
        const { body, user } = requestJSON;
        return dbUtility.insert({
            table: 'comments',
            data: {
                task_id:      body.taskId,
                user_id:      user.userId,
                comment_text: body.commentText,
                created_by:   user.userId,
                updated_by:   user.userId
            },
            returning: 'id, task_id, user_id, comment_text, created_date, status'
        });
    }

    async updateComment(requestJSON: any) {
        const { body, params, user } = requestJSON;
        return dbUtility.update({
            table: 'comments',
            data: {
                comment_text: body.commentText,
                updated_by:   user.userId
            },
            where:     { id: params.id, status: true },
            returning: 'id, task_id, user_id, comment_text, updated_date'
        });
    }

    async deleteComment(requestJSON: any) {
        const { params, user } = requestJSON;
        return dbUtility.softDelete({
            table:     'comments',
            where:     { id: params.id },
            deletedBy: user.userId
        });
    }
}

export const commentRepository = new CommentRepository();