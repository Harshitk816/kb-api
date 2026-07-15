import { db, dbUtility } from '../../../utils/database';
import { projectMemberQueries } from './sql/project-member.queries';

class ProjectMemberRepository {


    async getProjectMembersByProject(requestJSON: any) {
        return db.manyOrNone(projectMemberQueries.getProjectMembersByProject, {
            projectId: requestJSON.params.projectId
        });
    }

    async getProjectMemberByProjectAndUser(requestJSON: any) {
        return db.oneOrNone(projectMemberQueries.getProjectMemberByProjectAndUser, {
            projectId: requestJSON.body.projectId,
            userId: requestJSON.body.userId
        });
    }

    async createProjectMember(requestJSON: any) {
        const { body, user } = requestJSON;
        return dbUtility.insert({
            table: 'project_members',
            data: {
                project_id:  body.projectId,
                user_id:     body.userId,
                role:        body.role || 'member',
                invited_by:  user.userId,
                created_by:  user.userId,
                updated_by:  user.userId
            },
            returning: 'id, project_id, user_id, role, invited_by, joined_at, created_date, status'
        });
    }


    async getProjectMemberByProjectAndUserAnyStatus(requestJSON: any) {
        return db.oneOrNone(projectMemberQueries.getProjectMemberByProjectAndUserAnyStatus, {
            projectId: requestJSON.body.projectId,
            userId: requestJSON.body.userId
        });
    }

    async reactivateProjectMember(requestJSON: any) {
        const { body, user } = requestJSON;
        return db.one(projectMemberQueries.reactivateProjectMember, {
            projectId: body.projectId,
            userId: body.userId,
            role: body.role || 'member',
            updatedBy: user.userId
        });
    }

    async getProjectMemberById(requestJSON: any) {
    return db.oneOrNone(projectMemberQueries.getProjectMemberById, {
        projectMemberId: requestJSON.params.id
    });
}

async deleteProjectMember(requestJSON: any) {
    const { params, user } = requestJSON;

    return dbUtility.softDelete({
        table: 'project_members',
        where: { id: params.id },
        deletedBy: user.userId
    });
}
}

export const projectMemberRepository = new ProjectMemberRepository();