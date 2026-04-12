import { Router } from 'express';
import { projectController } from './controller/project.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const projectRouter = Router();

projectRouter.use(authMiddleware);

projectRouter.post('/',    projectController.createProject);
projectRouter.get('/',     projectController.getMyProjects);
projectRouter.get('/:id',  projectController.getProjectById);
projectRouter.put('/:id',  projectController.updateProject);
projectRouter.delete('/:id', projectController.deleteProject);

export { projectRouter };