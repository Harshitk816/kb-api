import { AppError } from '../../../utils/http';
import logger from '../../../utils/logger';
import { taskRepository } from '../../tasks/repository/task.repository'; 
import { projectMemberRepository } from '../../project-member/repository/project-member.repository';
import { taskAssignmentRepository } from '../repository/task-assignment.repository';
import { logActivity } from '../../../utils/audit';

class TaskAssignmentController {

    assignUser = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { taskId, userId } = requestJSON.body;

            if (!taskId || !userId)
                throw new AppError('taskId and userId are required', 400);

            // Check task exists
            requestJSON.params.id = taskId;
            const task = await taskRepository.getTaskById(requestJSON);
            if (!task) throw new AppError('Task not found', 404);

            // Check user is a member of the project
            const membership = await projectMemberRepository.getProjectMemberByProjectAndUser({
                body: { projectId: task.project_id, userId },
                user: requestJSON.user
            });
            if (!membership)
                throw new AppError('User is not a member of this project', 403);

            // Check not already assigned
            const existing = await taskAssignmentRepository.getTaskAssignmentByTaskAndUser(taskId, userId);
            if (existing)
                throw new AppError('User is already assigned to this task', 409);

            const assignment = await taskAssignmentRepository.createTaskAssignment(requestJSON);
            await logActivity({
                projectId: task.project_id,
                taskId: task.id,
                userId: requestJSON.user.userId,
                actionType: 'task_assigned',
                actionDetails: {
                    assignedUserId: userId,
                    assignmentId: assignment.id
                }
            });
            logger.info({ taskId, userId }, 'User assigned to task');

            res.status(201).json({
                success: true,
                message: 'User assigned to task successfully',
                data: assignment
            });
        } catch (err) { next(err); }
    }

    getTaskAssignments = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const assignments = await taskAssignmentRepository.getTaskAssignmentsByTask(requestJSON);
            res.status(200).json({ success: true, data: assignments });
        } catch (err) { next(err); }
    }

    removeAssignment = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            const existing = await taskAssignmentRepository.getTaskAssignmentById(requestJSON);
            if (!existing) throw new AppError('Assignment not found', 404);

            const task = await taskRepository.getTaskById({ params: { id: existing.task_id } });
            if (!task) throw new AppError('Task not found', 404);

            const deleted = await taskAssignmentRepository.deleteTaskAssignment(requestJSON);
            if (!deleted) throw new AppError('Assignment not found', 404);
            await logActivity({
                projectId: task.project_id,
                taskId: task.id,
                userId: requestJSON.user.userId,
                actionType: 'task_unassigned',
                actionDetails: {
                    removedUserId: existing.user_id,
                    assignmentId: existing.id
                }
            });

            logger.info({ assignmentId: requestJSON.params.id }, 'Task assignment removed');

            res.status(200).json({
                success: true,
                message: 'Assignment removed successfully'
            });
        } catch (err) { next(err); }
    }

    getMyTaskAssignments = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            const assignments = await taskAssignmentRepository.getTaskAssignmentsByUser(requestJSON);

            res.status(200).json({
                success: true,
                data: assignments
            });
        } catch (err) { next(err); }
    }
}

export const taskAssignmentController = new TaskAssignmentController();