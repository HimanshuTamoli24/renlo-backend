import { Router } from 'express';
import authorize from '../../middleware/auth.middleware';
import Protect from '../../middleware/role.middleware';
import { roles } from '../../constant/role';
import { validate } from '../../middleware/zodvalidation.middleware';
import {
  cancelVisitByOwner,
  getAdminVisits,
  getMyVisits,
  getVisitById,
  getVisits,
  makeDecision,
  markVisited,
  requestVisit,
  scheduleVisit,
} from './visit.controller';
import {
  cancelVisitSchema,
  createVisitSchema,
  scheduleVisitSchema,
  visitDecisionSchema,
} from '../../zodschema/visit.schema';

const router = Router();
const { BIGBOSS, OWNER, TENANT } = roles;

router.use(authorize());
router.get('/', Protect([BIGBOSS, OWNER, TENANT]), getVisits);
router.post('/', Protect([TENANT]), validate(createVisitSchema), requestVisit);
router.get('/my', Protect([TENANT]), getMyVisits);
router.get('/incoming', Protect([BIGBOSS, OWNER]), getAdminVisits);
router.get('/admin', Protect([BIGBOSS, OWNER]), getAdminVisits);
router.get('/:id', Protect([BIGBOSS, OWNER, TENANT]), getVisitById);

router.patch(
  '/admin/:id/schedule',
  Protect([BIGBOSS, OWNER]),
  validate(scheduleVisitSchema),
  scheduleVisit,
);

router.patch(
  '/admin/:id/cancel',
  Protect([BIGBOSS, OWNER]),
  validate(cancelVisitSchema),
  cancelVisitByOwner,
);

router.patch('/:id/visited', Protect([TENANT]), markVisited);
router.patch('/:id/decision', Protect([TENANT]), validate(visitDecisionSchema), makeDecision);

export default router;
