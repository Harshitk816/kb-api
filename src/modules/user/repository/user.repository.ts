import { db, dbUtility } from "../../../utils/database";
import { userQueries } from "./sql/user.queries";

export interface IUser {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    full_name?: string;
    avatar_url?: string;
    created_date?: Date;
    status?: boolean;
}

export interface ICreateUserParams {
    username: string;
    email: string;
    passwordHash: string;
    fullName?: string;
}

export interface IUpdateUserParams {
    userId: number;
    fullName?: string;
    avatarUrl?: string;
    updatedBy: number;
}

class UserRepository {

    async getUserById(requestJSON: any) {
        const { params } = requestJSON;
        return db.oneOrNone(userQueries.getUserById, { 
            userId: params.id 
        });
    }

    async getUserByEmail(requestJSON: any) {
        const {email} = requestJSON.body;
        return db.oneOrNone(userQueries.getUserByEmail, { email });
    }

    async getUserByUsername(requestJSON: any) {
        const {username} = requestJSON;
        return db.oneOrNone(userQueries.getUserByUsername, { username });
    }

    async createUser(requestJSON: any) {
        const { body } = requestJSON;
        return dbUtility.insert({
            table: 'users',
            data: {
                username:      body.username,
                email:         body.email,
                password_hash: body.passwordHash,
                full_name:     body.fullName || null,
                created_by:    1,
                updated_by:    1
            },
            returning: 'id, username, email, full_name, avatar_url, created_date, status'
        });
    }

    async updateUser(requestJSON: any) {
        const { body, params, user } = requestJSON;
        return dbUtility.update({
            table: 'users',
            data: {
                full_name:  body.fullName,
                avatar_url: body.avatarUrl,
                updated_by: user.userId
            },
            where:     { id: params.id, status: true },
            returning: 'id, username, email, full_name, avatar_url, updated_date'
        });
    }

    async deleteUser(requestJSON: any) {
        const { params, user } = requestJSON;
        return dbUtility.softDelete({
            table:     'users',
            where:     { id: params.id },
            deletedBy: user.userId
        });
    }

}

export const userRepository = new UserRepository();