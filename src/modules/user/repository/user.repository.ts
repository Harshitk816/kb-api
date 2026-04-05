import { db } from "../../../utils/database";
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

    async getUserByEmail(email: string): Promise<IUser | null>{
        return db.oneOrNone(userQueries.getUserByEmail, {email});
    }

    async getUserByUsername(username: string): Promise<IUser | null> {
        return db.oneOrNone<IUser>(userQueries.getUserByUsername, { username });
    }
}