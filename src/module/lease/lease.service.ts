import Lease, { type ILeaseDocumentItem, type LeaseStatus } from './lease.model';
import Visit from '../visit/visit.model';
import Listing from '../listing/listing.model';
import { ApiError } from '../../utils/api.error';
import { getPagination } from '../../helper/query.builder';

const statusTransitions: Record<LeaseStatus, LeaseStatus[]> = {
  PENDING_DOCS: ['AGREEMENT_PENDING'],
  AGREEMENT_PENDING: ['INVENTORY_PENDING'],
  INVENTORY_PENDING: ['ACTIVE'],
  ACTIVE: ['TERMINATED'],
  TERMINATED: [],
};

const isSameId = (left: any, right: string) => String(left) === String(right);

export const ensureLeaseFromApprovedVisit = async (tenantId: string, listingId: string) => {
  const existingLease = await Lease.findOne({ tenant: tenantId, listing: listingId }).lean();
  if (existingLease) return existingLease;

  const approvedVisit = await Visit.findOne({
    tenant: tenantId,
    listing: listingId,
    status: 'APPROVED',
  })
    .sort({ updatedAt: -1 })
    .lean();

  if (!approvedVisit) {
    throw new ApiError(404, 'Approved visit not found for this listing');
  }

  const activeLease = await Lease.findOne({
    tenant: tenantId,
    listing: listingId,
    status: { $in: ['PENDING_DOCS', 'AGREEMENT_PENDING', 'INVENTORY_PENDING', 'ACTIVE'] },
  }).lean();

  if (activeLease) {
    throw new ApiError(400, 'Only one active lease is allowed per tenant per listing');
  }

  const lease = await Lease.create({
    tenant: tenantId,
    listing: listingId,
    visit: approvedVisit._id,
    status: 'PENDING_DOCS',
  });

  return lease;
};

const getTenantLeaseOrThrow = async (tenantId: string, listingId: string) => {
  const lease = await Lease.findOne({ tenant: tenantId, listing: listingId });
  if (!lease) throw new ApiError(404, 'Lease not found for this listing');
  return lease;
};

export const getTenantLeaseByListing = async (tenantId: string, listingId: string) => {
  const lease = await getTenantLeaseOrThrow(tenantId, listingId);
  return lease;
};

export const uploadDocuments = async (
  tenantId: string,
  listingId: string,
  documents: ILeaseDocumentItem[],
) => {
  const lease = await getTenantLeaseOrThrow(tenantId, listingId);

  if (lease.status !== 'PENDING_DOCS') {
    throw new ApiError(400, 'Documents can be uploaded only in PENDING_DOCS status');
  }

  lease.documents = documents;
  await lease.save();
  return lease;
};

export const signAgreement = async (
  tenantId: string,
  listingId: string,
  agreementSigned: boolean,
) => {
  const lease = await getTenantLeaseOrThrow(tenantId, listingId);

  if (lease.status !== 'AGREEMENT_PENDING') {
    throw new ApiError(400, 'Agreement can be signed only in AGREEMENT_PENDING status');
  }

  if (!agreementSigned) {
    throw new ApiError(400, 'agreementSigned must be true');
  }

  lease.agreementSigned = true;
  lease.status = 'INVENTORY_PENDING';
  await lease.save();
  return lease;
};

export const confirmInventory = async (
  tenantId: string,
  listingId: string,
  inventoryConfirmed: boolean,
) => {
  const lease = await getTenantLeaseOrThrow(tenantId, listingId);

  if (lease.status !== 'INVENTORY_PENDING') {
    throw new ApiError(400, 'Inventory confirmation is allowed only in INVENTORY_PENDING status');
  }

  if (!inventoryConfirmed) {
    throw new ApiError(400, 'inventoryConfirmed must be true');
  }

  lease.inventoryConfirmed = true;
  lease.status = 'ACTIVE';
  lease.startDate = lease.startDate ?? new Date();
  await lease.save();
  return lease;
};

export const getAdminMoveIns = async (query: any, userId: string, role: string) => {
  const { page: pageQuery, limit: limitQuery, status } = query;
  const { page, limit, skip } = getPagination(pageQuery as string, limitQuery as string);

  const filter: Record<string, any> = {};
  if (status) filter.status = status;

  if (role === 'OWNER') {
    const ownerListings = await Listing.find({ createdBy: userId }).select('_id').lean();
    filter.listing = { $in: ownerListings.map((item) => item._id) };
  }

  const total = await Lease.countDocuments(filter);
  const leases = await Lease.find(filter)
    .populate('tenant')
    .populate('listing')
    .populate('visit')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: leases,
  };
};

export const adminUpdateLeaseStatus = async (
  leaseId: string,
  status: LeaseStatus,
  userId: string,
  role: string,
) => {
  const lease = await Lease.findById(leaseId).populate('listing');
  if (!lease) throw new ApiError(404, 'Lease not found');

  const listing: any = lease.listing;
  if (role === 'OWNER' && !isSameId(listing?.createdBy, userId)) {
    throw new ApiError(403, 'Forbidden');
  }

  const allowed = statusTransitions[lease.status].includes(status);
  if (!allowed) {
    throw new ApiError(400, `Invalid lease status transition from ${lease.status} to ${status}`);
  }

  lease.status = status;

  if (status === 'ACTIVE') {
    lease.startDate = lease.startDate ?? new Date();
  }

  if (status === 'TERMINATED') {
    lease.endDate = new Date();
  }

  await lease.save();
  return lease;
};
