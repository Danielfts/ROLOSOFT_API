import { Router } from "express";
import UserService from "../service/userService";
import { UserEntity } from "../entities/userEntity";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await UserService.getAllUsers();
  res.send(users).status(200);
});

userRouter.post("/", async (req, res) => {
  const user = req.body as UserEntity;
  const createdUser =  await UserService.createUser(user);
  res.send(createdUser).status(201);
});

export default userRouter;