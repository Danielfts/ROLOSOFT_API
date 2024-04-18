import { Router } from "express";
import UserService from "../service/userService";
import { UserEntity } from "../entities/userEntity";
import UserController from "../controller/userController";

const userRouter = Router();

userRouter.get("/", UserController.getAllUsers);

userRouter.post("/", UserController.createUser);

userRouter.delete("/:id", UserController.deleteUser);

userRouter.post("/login", UserController.logIn);

export default userRouter;
