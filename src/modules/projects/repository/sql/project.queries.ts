import path from "path";
import { dbUtility } from "../../../../utils/database";

const sqlPath = __dirname;

export const projectQueries = {
    getProjectById: dbUtility.getSQL(path.join(sqlPath, 'get-project-by-id.sql')),
    getProjectsByOwner: dbUtility.getSQL(path.join(sqlPath, 'get-projects-by-owner.sql')),
};