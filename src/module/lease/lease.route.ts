import { Router } from 'express';
import authorize from '../../middleware/auth.middleware';
import Protect from '../../middleware/role.middleware';
import { roles } from '../../constant/role';
import { validate } from '../../middleware/zodvalidation.middleware';
import {
  adminUpdateMoveInStatus,
  confirmMoveInInventory,
  getAdminMoveIns,
  getMoveInByListing,
  signMoveInAgreement,
  uploadMoveInDocuments,
} from './lease.controller';
import {
  adminUpdateLeaseStatusSchema,
  confirmInventorySchema,
  signAgreementSchema,
  uploadLeaseDocumentsSchema,
} from '../../zodschema/lease.schema';

const router = Router();
const { TENANT, BIGBOSS, OWNER } = roles;

router.use(authorize());

router.get('/movein/:listingId', Protect([TENANT]), getMoveInByListing);
router.post(
  '/movein/:listingId/documents',
  Protect([TENANT]),
  validate(uploadLeaseDocumentsSchema),
  uploadMoveInDocuments,
);
router.patch(
  '/movein/:listingId/agreement',
  Protect([TENANT]),
  validate(signAgreementSchema),
  signMoveInAgreement,
);
router.patch(
  '/movein/:listingId/inventory',
  Protect([TENANT]),
  validate(confirmInventorySchema),
  confirmMoveInInventory,
);

router.get('/admin/movein', Protect([BIGBOSS, OWNER]), getAdminMoveIns);
router.patch(
  '/admin/movein/:id/status',
  Protect([BIGBOSS, OWNER]),
  validate(adminUpdateLeaseStatusSchema),
  adminUpdateMoveInStatus,
);

export default router;
