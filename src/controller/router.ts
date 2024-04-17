import { Router } from "express";
import userRouter from "./userRouter";

const router = Router();

// WELCOME
router.get("/", (req, res) => {
    res.send("The ROLOSOFT API is up and running!");
  });

// MAIN ROUTES
router.use("/users", userRouter);

export default router;