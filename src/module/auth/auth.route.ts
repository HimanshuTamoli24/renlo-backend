import { Router } from 'express';
import { login, register,logout } from './auth.controller';
import { validate } from '../../middleware/zodvalidation.middleware';
import { loginSchema, registerSchema } from '../../zodschema/register.schema';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);   

export default router;
