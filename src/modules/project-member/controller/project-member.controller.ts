import { logActivity } from '../../../utils/audit';
import { AppError } from '../../../utils/http';
import logger from '../../../utils/logger';
import { projectRepository } from '../../projects/repository/project.repository';
import { projectMemberRepository } from '../repository/project-member.repository';

class ProjectMemberController {

    addProjectMember = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { projectId, userId, role } = requestJSON.body;

            if (!projectId || !userId) {
                throw new AppError('projectId and userId are required', 400);
            }

            if (role && !['owner', 'admin', 'member', 'viewer'].includes(role)) {
                throw new AppError('Invalid role', 400);
            }

            requestJSON.params.id = projectId;
            const project = await projectRepository.getProjectById(requestJSON);
            if (!project) {
                throw new AppError('Project not found', 404);
            }

            if (project.owner_id !== requestJSON.user.userId) {
                throw new AppError('Only project owner can add members', 403);
            }

            const existingMember = await projectMemberRepository.getProjectMemberByProjectAndUser(requestJSON);
            if (existingMember) {
                throw new AppError('User is already a member of this project', 409);
            }

            const member = await projectMemberRepository.createProjectMember(requestJSON);
            await logActivity({
                projectId,
                userId: requestJSON.user.userId,
                actionType: 'project_member_added',
                actionDetails: {
                    memberId: member.id,
                    addedUserId: userId,
                    role: member.role
                }
            });

            logger.info({ projectId, userId }, 'Project member added');

            res.status(201).json({
                success: true,
                message: 'Project member added successfully',
                data: member
            });
        } catch (err) {
            next(err);
        }
    }


    getProjectMembers = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            requestJSON.params.id = requestJSON.params.projectId;
            const project = await projectRepository.getProjectById(requestJSON);
            if (!project) {
                throw new AppError('Project not found', 404);
            }

            const members = await projectMemberRepository.getProjectMembersByProject(requestJSON);

            res.status(200).json({
                success: true,
                data: members
            });
        } catch (err) {
            next(err);
        }
    }


    removeProjectMember = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            const existingMember = await projectMemberRepository.getProjectMemberById(requestJSON);
            if (!existingMember) {
                throw new AppError('Project member not found', 404);
            }

            requestJSON.params.id = existingMember.project_id;
            const project = await projectRepository.getProjectById(requestJSON);
            if (!project) {
                throw new AppError('Project not found', 404);
            }

            if (project.owner_id !== requestJSON.user.userId) {
                throw new AppError('Only project owner can remove members', 403);
            }

            if (existingMember.role === 'owner') {
                throw new AppError('Owner cannot be removed', 400);
            }

            const deleted = await projectMemberRepository.deleteProjectMember(requestJSON);
            if (!deleted) {
                throw new AppError('Project member not found', 404);
            }

            await logActivity({
                projectId: existingMember.project_id,
                userId: requestJSON.user.userId,
                actionType: 'project_member_removed',
                actionDetails: {
                    removedUserId: existingMember.user_id,
                    role: existingMember.role
                }
            });

            logger.info({ projectMemberId: requestJSON.params.id }, 'Project member removed');

            res.status(200).json({
                success: true,
                message: 'Project member removed successfully'
            });
        } catch (err) {
            next(err);
        }
    }

}

export const projectMemberController = new ProjectMemberController();