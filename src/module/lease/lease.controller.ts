import type { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async.handler';
import { ApiResponse } from '../../utils/api.response';
import * as leaseService from './lease.service';

export const getMoveInByListing = asyncHandler(async (req: Request, res: Response) => {
  const lease = await leaseService.getTenantLeaseByListing(
    req.user.id as string,
    req.params.listingId as string,
  );
  res.status(200).json(new ApiResponse('Move-in details fetched successfully', lease));
});

export const uploadMoveInDocuments = asyncHandler(async (req: Request, res: Response) => {
  const lease = await leaseService.uploadDocuments(
    req.user.id as string,
    req.params.listingId as string,
    req.body.documents,
  );

  res.status(200).json(new ApiResponse('Documents uploaded successfully', lease));
});

export const signMoveInAgreement = asyncHandler(async (req: Request, res: Response) => {
  const lease = await leaseService.signAgreement(
    req.user.id as string,
    req.params.listingId as string,
    req.body.agreementSigned,
  );

  res.status(200).json(new ApiResponse('Agreement signed successfully', lease));
});

export const confirmMoveInInventory = asyncHandler(async (req: Request, res: Response) => {
  const lease = await leaseService.confirmInventory(
    req.user.id as string,
    req.params.listingId as string,
    req.body.inventoryConfirmed,
  );

  res.status(200).json(new ApiResponse('Inventory confirmed successfully', lease));
});

export const getAdminMoveIns = asyncHandler(async (req: Request, res: Response) => {
  const result = await leaseService.getAdminMoveIns(
    req.query,
    req.user.id as string,
    req.user.role as string,
  );
  res.status(200).json(new ApiResponse('Move-ins fetched successfully', result.data, result.meta));
});

export const adminUpdateMoveInStatus = asyncHandler(async (req: Request, res: Response) => {
  const lease = await leaseService.adminUpdateLeaseStatus(
    req.params.id as string,
    req.body.status,
    req.user.id as string,
    req.user.role as string,
  );

  res.status(200).json(new ApiResponse('Move-in status updated successfully', lease));
});
