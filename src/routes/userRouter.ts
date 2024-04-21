import { Router } from "express";
import UserController from "../controllers/UserController";

const userRouter = Router();

userRouter.get("/", UserController.getAllUsers);

userRouter.post("/", UserController.createUser);

userRouter.delete("/:id", UserController.deleteUser);

userRouter.post("/login", UserController.logIn);

export default userRouter;
