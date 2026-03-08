import type { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../../utils/async.handler';
import { ApiResponse } from '../../utils/api.response';
import * as visitService from './visit.service';

export const requestVisit = asyncHandler(async (req: Request, res: Response) => {
  const visit = await visitService.requestVisit(req.body, req.user.id as string);
  res.status(201).json(new ApiResponse('Visit requested successfully', visit));
});

export const getMyVisits = asyncHandler(async (req: Request, res: Response) => {
  const result = await visitService.getMyVisits(req.user.id as string, req.query);
  res.status(200).json(new ApiResponse('Visits fetched successfully', result.data, result.meta));
});

export const getAdminVisits = asyncHandler(async (req: Request, res: Response) => {
  const result = await visitService.getAdminVisits(
    req.query,
    req.user.id as string,
    req.user.role as string,
  );
  res
    .status(200)
    .json(new ApiResponse('Admin visits fetched successfully', result.data, result.meta));
});

export const getVisits = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (req.user.role === 'TENANT') {
    return getMyVisits(req, res, next);
  }
  return getAdminVisits(req, res, next);
});

export const getVisitById = asyncHandler(async (req: Request, res: Response) => {
  const visit = await visitService.getVisitById(
    req.params.id as string,
    req.user.id as string,
    req.user.role as string,
  );
  res.status(200).json(new ApiResponse('Visit fetched successfully', visit));
});

export const scheduleVisit = asyncHandler(async (req: Request, res: Response) => {
  const visit = await visitService.scheduleVisit(
    req.params.id as string,
    req.body.scheduledDate,
    req.user.id as string,
    req.user.role as string,
    req.body.notes,
  );

  res.status(200).json(new ApiResponse('Visit scheduled successfully', visit));
});

export const markVisited = asyncHandler(async (req: Request, res: Response) => {
  const visit = await visitService.markVisited(req.params.id as string, req.user.id as string);
  res.status(200).json(new ApiResponse('Visit marked as visited', visit));
});

export const makeDecision = asyncHandler(async (req: Request, res: Response) => {
  const result = await visitService.makeDecision(
    req.params.id as string,
    req.user.id as string,
    req.body.decision,
  );

  res.status(200).json(new ApiResponse('Visit decision saved successfully', result));
});

export const cancelVisitByOwner = asyncHandler(async (req: Request, res: Response) => {
  const visit = await visitService.cancelVisitByOwner(
    req.params.id as string,
    req.user.id as string,
    req.user.role as string,
    req.body.notes,
  );

  res.status(200).json(new ApiResponse('Visit cancelled by owner', visit));
});
