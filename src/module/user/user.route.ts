import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser } from './user.controller';
import Protect from '../../middleware/role.middleware';
import { roles } from '../../constant/role';
import authorize from '../../middleware/auth.middleware';

const router = Router();
const { BIGBOSS } = roles;

router.use(authorize());

router.get('/', Protect([BIGBOSS]), getUsers);

router.get('/:id', Protect([BIGBOSS]), getUser);

router.put('/:id', Protect([BIGBOSS]), updateUser);

router.delete('/:id', Protect([BIGBOSS]), deleteUser);

export default router;
