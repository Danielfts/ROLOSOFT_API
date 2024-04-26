import { Router } from "express";
import UserController from "../controllers/UserController";
import { validateClient } from "../middlewares/clientValidation";

const userRouter = Router();

userRouter.get("/", validateClient, UserController.getAllUsers);

userRouter.post("/", validateClient, UserController.createUser);

userRouter.delete("/:id", validateClient, UserController.deleteUser);

userRouter.post("/login", UserController.logIn);

userRouter.get("/validate-token", validateClient, UserController.validateToken);

userRouter.get("/myself", validateClient, UserController.getMyself);

export default userRouter;
