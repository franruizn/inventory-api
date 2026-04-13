import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { CreateUserSchema, LoginUserSchema } from "../schemas/auth.schema";

const authRouter = Router();

authRouter.post('/register', validate(CreateUserSchema), AuthController.register);
authRouter.post('/login', validate(LoginUserSchema), AuthController.login);

export default authRouter;