import { Router } from "express";
import { createUser } from "../service/userService.js";

const userRouter = Router();
userRouter.post('/', createUser);

export default userRouter;