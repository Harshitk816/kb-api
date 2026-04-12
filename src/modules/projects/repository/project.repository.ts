import { db, dbUtility } from '../../../utils/database';
import { projectQueries } from './sql/project.queries';

class ProjectRepository {

    async getProjectById(requestJSON: any) {
        const { params } = requestJSON;
        return db.oneOrNone(projectQueries.getProjectById, {
            projectId: params.id
        });
    }

    async getProjectsByOwner(requestJSON: any) {
        const { user } = requestJSON;
        return db.manyOrNone(projectQueries.getProjectsByOwner, {
            ownerId: user.userId
        });
    }

    async createProject(requestJSON: any) {
        const { body, user } = requestJSON;
        return dbUtility.insert({
            table: 'projects',
            data: {
                project_name: body.projectName,
                description:  body.description || null,
                owner_id:     user.userId,
                created_by:   user.userId,
                updated_by:   user.userId
            },
            returning: 'id, project_name, description, owner_id, created_date, status'
        });
    }

    async updateProject(requestJSON: any) {
        const { body, params, user } = requestJSON;
        return dbUtility.update({
            table: 'projects',
            data: {
                project_name: body.projectName,
                description:  body.description,
                updated_by:   user.userId
            },
            where:     { id: params.id, status: true },
            returning: 'id, project_name, description, owner_id, updated_date'
        });
    }

    async deleteProject(requestJSON: any) {
        const { params, user } = requestJSON;
        return dbUtility.softDelete({
            table:     'projects',
            where:     { id: params.id },
            deletedBy: user.userId
        });
    }
}

export const projectRepository = new ProjectRepository();