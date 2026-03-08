import type { Request, Response } from 'express';
import * as listingService from './listing.service';
import { asyncHandler } from '../../utils/async.handler';
import { ApiResponse } from '../../utils/api.response';

export const getListings = asyncHandler(async (req: Request, res: Response) => {
  const result = await listingService.getListings(req.query);
  console.log('listing controller', result);
  res.status(200).json(new ApiResponse('Listings fetched successfully', result.data, result.meta));
});

export const getListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await listingService.getListing(req.params.id as string);
  res.status(200).json(new ApiResponse('Listing fetched successfully', listing));
});

export const compareListings = asyncHandler(async (req: Request, res: Response) => {
  const ids = String(req.query.ids || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const listings = await listingService.compareListings(ids);
  res.status(200).json(new ApiResponse('Listings compared successfully', listings));
});

export const getAdminListings = asyncHandler(async (req: Request, res: Response) => {
  const result = await listingService.getAdminListings(req.query);
  res
    .status(200)
    .json(new ApiResponse('Admin listings fetched successfully', result.data, result.meta));
});

export const createListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await listingService.createListing(req.body, req.user.id as string);
  res.status(201).json(new ApiResponse('Listing created successfully', listing));
});

export const updateListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await listingService.updateListing(req.params.id as string, req.body);
  res.status(200).json(new ApiResponse('Listing updated successfully', listing));
});

export const updateListingStatus = asyncHandler(async (req: Request, res: Response) => {
  const listing = await listingService.updateListingStatus(
    req.params.id as string,
    req.body.status,
  );
  res.status(200).json(new ApiResponse('Listing status updated successfully', listing));
});

export const deleteListing = asyncHandler(async (req: Request, res: Response) => {
  await listingService.deleteListing(req.params.id as string);
  res.status(200).json(new ApiResponse('Listing deleted successfully'));
});

export const acceptListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await listingService.acceptListing(req.params.id as string);
  res.status(200).json(new ApiResponse('Listing accepted successfully', listing));
});

export const rejectListing = asyncHandler(async (req: Request, res: Response) => {
  const listing = await listingService.rejectListing(req.params.id as string, req.body.reason);
  res.status(200).json(new ApiResponse('Listing rejected successfully', listing));
});
