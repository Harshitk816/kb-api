import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { projectMemberController } from './controller/project-member.controller';

const projectMemberRouter = Router();

projectMemberRouter.use(authMiddleware);

projectMemberRouter.post('/', projectMemberController.addProjectMember);
projectMemberRouter.get('/project/:projectId', projectMemberController.getProjectMembers);
projectMemberRouter.delete('/:id', projectMemberController.removeProjectMember);

export { projectMemberRouter };