import { logActivity } from '../../../utils/audit';
import { AppError } from '../../../utils/http';
import logger from '../../../utils/logger';
import { taskRepository } from '../../tasks/repository/task.repository';
import { commentRepository } from '../repository/comment.repository';

class CommentController {

    createComment = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { taskId, commentText } = requestJSON.body;

            if (!taskId || !commentText)
                throw new AppError('taskId and commentText are required', 400);

            // Verify task exists
            requestJSON.params.id = taskId;
            const task = await taskRepository.getTaskById(requestJSON);
            if (!task) throw new AppError('Task not found', 404);

            const comment = await commentRepository.createComment(requestJSON);
            await logActivity({
                projectId: task.project_id,
                taskId: comment.task_id,
                userId: requestJSON.user.userId,
                actionType: 'comment_added',
                actionDetails: {
                    commentId: comment.id
                }
            });
            logger.info({ commentId: comment.id }, 'Comment created');

            res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                data: comment
            });
        } catch (err) { next(err); }
    }

    getCommentsByTask = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const comments = await commentRepository.getCommentsByTask(requestJSON);
            res.status(200).json({ success: true, data: comments });
        } catch (err) { next(err); }
    }

    updateComment = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { commentText } = requestJSON.body;

            if (!commentText)
                throw new AppError('commentText is required', 400);

            // Only comment owner can update
            const existing = await commentRepository.getCommentById(requestJSON);
            if (!existing) throw new AppError('Comment not found', 404);
            if (existing.user_id !== requestJSON.user.userId)
                throw new AppError('Forbidden', 403);
            const task = await taskRepository.getTaskById({ params: { id: existing.task_id } });
            if (!task) throw new AppError('Task not found', 404);

            const comment = await commentRepository.updateComment(requestJSON);
            await logActivity({
                projectId: task.project_id,
                taskId: existing.task_id,
                userId: requestJSON.user.userId,
                actionType: 'comment_updated',
                actionDetails: {
                    commentId: existing.id
                }
            });
            logger.info({ commentId: requestJSON.params.id }, 'Comment updated');

            res.status(200).json({
                success: true,
                message: 'Comment updated successfully',
                data: comment
            });
        } catch (err) { next(err); }
    }

    deleteComment = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            // Only comment owner can delete
            const existing = await commentRepository.getCommentById(requestJSON);
            if (!existing) throw new AppError('Comment not found', 404);
            if (existing.user_id !== requestJSON.user.userId)
                throw new AppError('Forbidden', 403);
            const task = await taskRepository.getTaskById({ params: { id: existing.task_id } });
            if (!task) throw new AppError('Task not found', 404);

            const deleted = await commentRepository.deleteComment(requestJSON);
            if (!deleted) throw new AppError('Comment not found', 404);
            await logActivity({
                projectId: task.project_id,
                taskId: existing.task_id,
                userId: requestJSON.user.userId,
                actionType: 'comment_deleted',
                actionDetails: {
                    commentId: existing.id
                }
            });
            logger.info({ commentId: requestJSON.params.id }, 'Comment deleted');

            res.status(200).json({
                success: true,
                message: 'Comment deleted successfully'
            });
        } catch (err) { next(err); }
    }

}

export const commentController = new CommentController();