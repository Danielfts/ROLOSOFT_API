import { Router } from "express";
import UserController from "../controllers/UserController";
import { validateClient } from "../middlewares/clientValidation";
import multer from "multer";

const userRouter = Router();

userRouter.get("/", validateClient, UserController.getAllUsers);

userRouter.post("/", validateClient, UserController.createUser);

userRouter.delete("/:id", validateClient, UserController.deleteUser);

userRouter.post("/login", UserController.logIn);

userRouter.get("/validate-token", validateClient, UserController.validateToken);

userRouter.get("/myself", validateClient, UserController.getMyself);

userRouter.post("/:studentId/green-cards", validateClient, UserController.addGreenCardToStudent)

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

userRouter.post("/:studentId/photo",
  upload.single("image"),
  validateClient, 
  UserController.uploadPhoto)

export default userRouter;
