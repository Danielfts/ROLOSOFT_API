import { Router } from "express";
import SchoolController from "../controllers/SchoolController";
import { validateClient } from "../middlewares/clientValidation";
import multer from "multer";

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_DIR!);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' +  file.originalname);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});
// SET SCHOOL SHIELD
schoolRouter.post(
  "/:schoolId/shield",
  upload.single("shield"),
  validateClient,
  SchoolController.setSchoolShield
);

export default schoolRouter;
