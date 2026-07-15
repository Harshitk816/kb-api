import path from 'path';
import { dbUtility } from '../../../../utils/database';

const sqlPath = __dirname;

export const projectMemberQueries = {
    getProjectMemberById: dbUtility.getSQL(path.join(sqlPath, 'get-project-member-by-id.sql')),
    getProjectMembersByProject: dbUtility.getSQL(path.join(sqlPath, 'get-project-members-by-project.sql')),
    getProjectMemberByProjectAndUser: dbUtility.getSQL(path.join(sqlPath, 'get-project-member-by-project-and-user.sql')),
    getProjectMemberByProjectAndUserAnyStatus: dbUtility.getSQL(path.join(sqlPath, 'get-project-member-by-project-and-user-any-status.sql')),
    reactivateProjectMember: dbUtility.getSQL(path.join(sqlPath, 'reactivate-project-member.sql')),
};