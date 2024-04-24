import { Router } from "express";
import UserController from "../controllers/UserController";
import { validateClient } from "../middlewares/clientValidation";

const userRouter = Router();

userRouter.get("/", validateClient ,UserController.getAllUsers);

userRouter.post("/", UserController.createUser);

userRouter.delete("/:id", UserController.deleteUser);

userRouter.post("/login", UserController.logIn);

export default userRouter;
