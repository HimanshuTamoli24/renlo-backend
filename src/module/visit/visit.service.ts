import Listing from '../listing/listing.model';
import Visit from './visit.model';
import { ApiError } from '../../utils/api.error';
import { getPagination } from '../../helper/query.builder';

const isSameId = (left: any, right: string) => String(left) === String(right);

export const requestVisit = async (data: any, tenantId: string) => {
  const { listingId, requestedDate, notes } = data;

  const listing = await Listing.findOne({ _id: listingId, status: 'PUBLISHED' }).lean();
  if (!listing) throw new ApiError(404, 'Listing not found or not published');

  const existing = await Visit.findOne({
    tenant: tenantId,
    listing: listingId,
    status: { $in: ['REQUESTED', 'SCHEDULED', 'VISITED', 'APPROVED'] },
  }).lean();

  if (existing) {
    throw new ApiError(400, 'You already have an active visit flow for this listing');
  }

  const visit = await Visit.create({
    tenant: tenantId,
    owner: listing.createdBy,
    listing: listingId,
    requestedDate,
    notes,
    status: 'REQUESTED',
  });

  return visit;
};

export const getMyVisits = async (tenantId: string, query: any) => {
  const { page: pageQuery, limit: limitQuery } = query;
  const { page, limit, skip } = getPagination(pageQuery as string, limitQuery as string);

  const filter = { tenant: tenantId };
  const total = await Visit.countDocuments(filter);
  const visits = await Visit.find(filter)
    .populate('listing')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    success: true,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: visits,
  };
};

export const getAdminVisits = async (query: any, userId: string, role: string) => {
  const { page: pageQuery, limit: limitQuery, status } = query;
  const { page, limit, skip } = getPagination(pageQuery as string, limitQuery as string);

  const filter: Record<string, any> = {};
  if (status) filter.status = status;
  if (role === 'OWNER') filter.owner = userId;

  const total = await Visit.countDocuments(filter);
  const visits = await Visit.find(filter)
    .populate('listing')
    .populate('tenant')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    success: true,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: visits,
  };
};

export const getVisitById = async (id: string, userId: string, role: string) => {
  const visit = await Visit.findById(id).populate('listing').populate('tenant').lean();
  if (!visit) throw new ApiError(404, 'Visit not found');

  if (role === 'TENANT' && !isSameId(visit.tenant?._id || visit.tenant, userId)) {
    throw new ApiError(403, 'Forbidden');
  }

  if (role === 'OWNER' && !isSameId(visit.owner, userId)) {
    throw new ApiError(403, 'Forbidden');
  }

  return visit;
};

export const scheduleVisit = async (
  id: string,
  scheduledDate: Date,
  userId: string,
  role: string,
  notes?: string,
) => {
  const visit = await Visit.findById(id);
  if (!visit) throw new ApiError(404, 'Visit not found');

  if (role === 'OWNER' && !isSameId(visit.owner, userId)) {
    throw new ApiError(403, 'Only listing owner can schedule this visit');
  }

  if (visit.status !== 'REQUESTED') {
    throw new ApiError(400, 'Visit can be scheduled only from REQUESTED status');
  }

  visit.scheduledDate = scheduledDate;
  if (notes) visit.notes = notes;
  visit.status = 'SCHEDULED';
  await visit.save();
  return visit;
};

export const markVisited = async (id: string, tenantId: string) => {
  const visit = await Visit.findById(id);
  if (!visit) throw new ApiError(404, 'Visit not found');

  if (!isSameId(visit.tenant, tenantId)) {
    throw new ApiError(403, 'Only tenant can mark visit as visited');
  }

  if (visit.status !== 'SCHEDULED') {
    throw new ApiError(400, 'Visit can be marked visited only from SCHEDULED status');
  }

  visit.visitedAt = new Date();
  visit.status = 'VISITED';
  await visit.save();
  return visit;
};

export const makeDecision = async (id: string, tenantId: string, notes?: string) => {
  const visit = await Visit.findById(id);
  if (!visit) throw new ApiError(404, 'Visit not found');

  if (!isSameId(visit.tenant, tenantId)) {
    throw new ApiError(403, 'Only tenant can make decision');
  }

  if (visit.status !== 'VISITED') {
    throw new ApiError(400, 'Decision can be made only after visit is marked VISITED');
  }

  visit.decisionAt = new Date();
  if (notes) visit.notes = notes;


  await visit.save();
  return {
    visit
  };
};

export const cancelVisitByOwner = async (
  id: string,
  userId: string,
  role: string,
  notes?: string,
) => {
  const visit = await Visit.findById(id);
  if (!visit) throw new ApiError(404, 'Visit not found');

  if (role === 'OWNER' && !isSameId(visit.owner, userId)) {
    throw new ApiError(403, 'Only listing owner can cancel this visit');
  }

  if (['APPROVED', 'REJECTED', 'CANCELLED'].includes(visit.status)) {
    throw new ApiError(400, `Visit already in final status ${visit.status}`);
  }

  visit.status = 'CANCELLED';
  if (notes) visit.notes = notes;
  await visit.save();
  return visit;
};
