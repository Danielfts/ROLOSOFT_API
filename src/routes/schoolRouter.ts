import { Router } from "express";
import SchoolController from "../controllers/SchoolController";
import { validateClient } from "../middlewares/clientValidation";

const schoolRouter = Router();

schoolRouter.get(
  "/",
  validateClient,
  SchoolController.getSchools
);

schoolRouter.post(
  "/",
  validateClient,
  SchoolController.createSchool
);

export default schoolRouter;
