import { AppError } from '../../../utils/http';
import logger from '../../../utils/logger';
import { projectRepository } from '../../projects/repository/project.repository';
import { taskRepository } from '../../tasks/repository/task.repository';
import { activityLogRepository } from '../repository/activity-log.repository';

class ActivityLogController {

    createActivityLog = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { projectId, taskId, actionType } = requestJSON.body;

            if (!projectId || !actionType) {
                throw new AppError('projectId and actionType are required', 400);
            }

            requestJSON.params.id = projectId;
            const project = await projectRepository.getProjectById(requestJSON);
            if (!project) {
                throw new AppError('Project not found', 404);
            }

            if (taskId) {
                requestJSON.params.id = taskId;
                const task = await taskRepository.getTaskById(requestJSON);
                if (!task) {
                    throw new AppError('Task not found', 404);
                }
            }

            const activityLog = await activityLogRepository.createActivityLog(requestJSON);

            logger.info({ activityLogId: activityLog.id }, 'Activity log created');

            res.status(201).json({
                success: true,
                message: 'Activity log created successfully',
                data: activityLog
            });
        } catch (err) {
            next(err);
        }
    }

    getActivityLogsByProject = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            requestJSON.params.id = requestJSON.params.projectId;
            const project = await projectRepository.getProjectById(requestJSON);
            if (!project) {
                throw new AppError('Project not found', 404);
            }

            const logs = await activityLogRepository.getActivityLogsByProject(requestJSON);

            res.status(200).json({
                success: true,
                data: logs
            });
        } catch (err) {
            next(err);
        }
    }

    getActivityLogsByTask = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            requestJSON.params.id = requestJSON.params.taskId;
            const task = await taskRepository.getTaskById(requestJSON);
            if (!task) {
                throw new AppError('Task not found', 404);
            }

            const logs = await activityLogRepository.getActivityLogsByTask(requestJSON);

            res.status(200).json({
                success: true,
                data: logs
            });
        } catch (err) {
            next(err);
        }
    }

    getActivityLogById = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            const log = await activityLogRepository.getActivityLogById(requestJSON);
            if (!log) {
                throw new AppError('Activity log not found', 404);
            }

            res.status(200).json({
                success: true,
                data: log
            });
        } catch (err) {
            next(err);
        }
    }

}

export const activityLogController = new ActivityLogController();
