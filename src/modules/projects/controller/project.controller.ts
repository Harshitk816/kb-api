import { AppError } from '../../../utils/http';
import { projectRepository } from '../repository/project.repository';
import logger from '../../../utils/logger';

class ProjectController {
    createProject = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { projectName } = requestJSON.body;

            if (!projectName)
                throw new AppError('projectName is required', 400);

            const project = await projectRepository.createProject(requestJSON);
            logger.info({ projectId: project.id }, 'Project created');

            res.status(201).json({ success: true, message: 'Project created successfully', data: project });
        } catch(err) { 
            next(err);
         }
    }

    getMyProjects = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const projects = await projectRepository.getProjectsByOwner(requestJSON);
            res.status(200).json({ success: true, data: projects });
        } catch(err) { 
            next(err);
        }
    }

    getProjectById = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const project = await projectRepository.getProjectById(requestJSON);
            if (!project) throw new AppError('Project not found', 404);
            res.status(200).json({ success: true, data: project });
        } catch(err) { 
            next(err);
        }
    }

    updateProject = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            const existing = await projectRepository.getProjectById(requestJSON);
            if (!existing) throw new AppError('Project not found', 404);
            if (existing.owner_id !== requestJSON.user.userId)
                throw new AppError('Forbidden', 403);

            const project = await projectRepository.updateProject(requestJSON);
            logger.info({ projectId: requestJSON.params.id }, 'Project updated');

            res.status(200).json({ success: true, message: 'Project updated successfully', data: project });
        } catch(err) { 
            next(err); 
        }
    }

    deleteProject = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            const existing = await projectRepository.getProjectById(requestJSON);
            if (!existing) throw new AppError('Project not found', 404);
            if (existing.owner_id !== requestJSON.user.userId)
                throw new AppError('Forbidden', 403);

            const deleted = await projectRepository.deleteProject(requestJSON);
            if (!deleted) throw new AppError('Project not found', 404);
            logger.info({ projectId: requestJSON.params.id }, 'Project deleted');

            res.status(200).json({ success: true, message: 'Project deleted successfully' });
        } catch(err) { next(err); }
    }

}

export const projectController = new ProjectController();
