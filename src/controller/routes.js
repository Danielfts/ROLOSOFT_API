import express from 'express';
import { User } from '../model/user.js';
import { createUser } from '../service/userService.js';
import userRouter from './usersRoutes.js';


const router = express.Router();

//USERS ROUTES
router.use('/users', userRouter);


export default router;