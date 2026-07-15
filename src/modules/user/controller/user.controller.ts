import bcrypt from 'bcrypt';
import { AppError } from "../../../utils/http";
import { jwtUtility } from "../../../utils/jwt";
import logger from "../../../utils/logger";
import { userRepository } from "../repository/user.repository";

class UserController {
    register = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { username, email, password, fullName } = requestJSON.body;

            if (!username || !email || !password) {
                throw new AppError('Username, email and password are required', 400);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new AppError('Invalid email format', 400);
            }

            if (password.length < 6) {
                throw new AppError('Password must be at least 6 characters', 400);
            }

            const existingEmail = await userRepository.getUserByEmail(requestJSON);
            if (existingEmail) throw new AppError('Email already registered', 409);

            const existingUsername = await userRepository.getUserByUsername(requestJSON);
            if (existingUsername) throw new AppError('Username already taken', 409);

            requestJSON.body.passwordHash = await bcrypt.hash(password, 10);

            const newUser = await userRepository.createUser(requestJSON);

            const tokenPayload = {
                userId:   newUser.id,
                email:    newUser.email,
                username: newUser.username
            };
            const accessToken  = jwtUtility.generateAccessToken(tokenPayload);
            const refreshToken = jwtUtility.generateRefreshToken(tokenPayload);

            logger.info({ userId: newUser.id }, 'User registered');

            delete newUser.password_hash;

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: { user: newUser, accessToken, refreshToken }
            });
        } catch(err) {
            next(err);
        }
    }


    login = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { email, password } = requestJSON.body;

            if (!email || !password) {
                throw new AppError('Email and password are required', 400);
            }

            const user = await userRepository.getUserByEmail(requestJSON);
            if (!user) throw new AppError('Invalid email or password', 401);

            const isValid = await bcrypt.compare(password, user.password_hash);
            if (!isValid) throw new AppError('Invalid email or password', 401);

            const tokenPayload = {
                userId:   user.id,
                email:    user.email,
                username: user.username
            };
            const accessToken  = jwtUtility.generateAccessToken(tokenPayload);
            const refreshToken = jwtUtility.generateRefreshToken(tokenPayload);

            logger.info({ userId: user.id }, 'User logged in');

            delete user.password_hash;

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: { user, accessToken, refreshToken }
            });
        } catch(err) {
            next(err);
        }
    }
    

    refreshToken = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            const { refreshToken } = requestJSON.body;

            if (!refreshToken) throw new AppError('Refresh token required', 400);

            const payload     = jwtUtility.verifyRefreshToken(refreshToken);
            const accessToken = jwtUtility.generateAccessToken({
                userId:   payload.userId,
                email:    payload.email,
                username: payload.username
            });

            res.status(200).json({ success: true, data: { accessToken } });
        } catch(err) {
            next(err);
        }
    }


    me = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;
            requestJSON.params.id = requestJSON.user.userId;

            const user = await userRepository.getUserById(requestJSON);
            if (!user) throw new AppError('User not found', 404);

            res.status(200).json({ success: true, data: user });
        } catch(err) {
            next(err);
        }
    }


    getUser = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            const user = await userRepository.getUserById(requestJSON);
            if (!user) throw new AppError('User not found', 404);

            res.status(200).json({ success: true, data: user });
        } catch(err) {
            next(err);
        }
    }

    updateUser = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            if (parseInt(requestJSON.params.id) !== requestJSON.user.userId) {
                throw new AppError('Forbidden', 403);
            }

            const updatedUser = await userRepository.updateUser(requestJSON);
            if (!updatedUser) throw new AppError('User not found', 404);

            logger.info({ userId: requestJSON.user.userId }, 'User updated');

            res.status(200).json({ success: true, data: updatedUser });
        } catch(err) {
            next(err);
        }
    }

    deleteUser = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            if (parseInt(requestJSON.params.id) !== requestJSON.user.userId) {
                throw new AppError('Forbidden', 403);
            }

            const deleted = await userRepository.deleteUser(requestJSON);
            if (!deleted) throw new AppError('User not found', 404);

            logger.info({ userId: requestJSON.user.userId }, 'User deleted');

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch(err) {
            next(err);
        }
    }

    logout = async (req: any, res: any, next: any) => {
        try {
            res.status(200).json({ success: true, message: 'Logged out successfully' });
        } catch(err) {
            next(err);
        }
    }

    getAllUsers = async (req: any, res: any, next: any) => {
        try {
            const { requestJSON } = req;

            const users = await userRepository.getAllUsers(requestJSON);

            res.status(200).json({
                success: true,
                data: users
            });
        } catch (err) { next(err); }
    }

}

export const userController = new UserController();