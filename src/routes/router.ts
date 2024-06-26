import { Router } from "express";
import userRouter from "./userRouter";
import tournamentRouter from "./tournamentRouter";
import schoolRouter from "./schoolRouter";

const router = Router();

// WELCOME
router.get("/", (req, res) => {
    res.send("<h1>The ROLOSOFT API is up and running!<h1>");
  });

// MAIN ROUTES
router.use("/users", userRouter);

router.use("/tournaments", tournamentRouter);

router.use("/schools", schoolRouter);



export default router;