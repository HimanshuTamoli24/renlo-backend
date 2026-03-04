import { Router } from 'express';
import {
  compareListings,
  createListing,
  deleteListing,
  getAdminListings,
  getListing,
  getListings,
  updateListing,
  updateListingStatus,
} from './listing.controller';
import authorize from '../../middleware/auth.middleware';
import Protect from '../../middleware/role.middleware';
import { roles } from '../../constant/role';
import { validate } from '../../middleware/zodvalidation.middleware';
import {
  createListingSchema,
  updateListingSchema,
  updateListingStatusSchema,
} from '../../zodschema/listing.schema';

const router = Router();
const { BIGBOSS, OWNER } = roles;

router.get('/', getListings);
router.get('/compare', compareListings);

router.get('/admin', authorize(), Protect([BIGBOSS, OWNER]), getAdminListings);
router.post('/admin', authorize(), Protect([BIGBOSS, OWNER]), validate(createListingSchema), createListing);
router.patch('/admin/:id', authorize(), Protect([BIGBOSS, OWNER]), validate(updateListingSchema), updateListing);
router.patch(
  '/admin/:id/status',
  authorize(),
  Protect([BIGBOSS, OWNER]),
  validate(updateListingStatusSchema),
  updateListingStatus,
);
router.delete('/admin/:id', authorize(), Protect([BIGBOSS, OWNER]), deleteListing);

router.get('/:id', getListing);

export default router;
